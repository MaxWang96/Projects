'use strict';

console.time('t');
// console.log(window.navigator.languages[0]);
// function for creating modals that display various error messages
function modal(id, header, text, error) {
    document.body.insertAdjacentHTML('beforeend', `
            <div class="spc_modal_container">
                <div class="modal right fade" id="${id}" role="dialog">
                    <div class="modal-dialog" style='width:230px;'>
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                <p>${header}<p>
                            </div>
                            <div class="modal-body">
                                <p style="margin:0px;">${text}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`);

    function showModal() {
        $(`#${id}`)
            .css({
                'font-size': '13px',
                'color': '#25282a',
                'line-height': '19px',
            })
            .modal({
                backdrop: false
            });
    }

    if (document.readyState != 'complete') {
        setTimeout(showModal, 1000);
    } else showModal();

    if (error) throw new Error(error);
}

function dataError(gameName) {
    modal('price_data_error_modal', chrome.i18n.getMessage('priceDataErrorHeader'), chrome.i18n.getMessage('priceDataErrorText', gameName), 'Price data error');
}

// check whether the store region is supported
const config = JSON.parse(document.getElementById('application_config').getAttribute('data-config'));
let region = config.COUNTRY;
const eu1 = ['AL', 'AD', 'AT', 'BE', 'FI', 'FR', 'DK', 'DE', 'IE', 'LI', 'LU', 'MK', 'NL', 'SE', 'CH'];
if (eu1.includes(region)) region = 'EU1';
const supportedRegion = ['US', 'CN', 'EU1'];
if (!supportedRegion.includes(region)) {
    modal('not_supported_modal',
        chrome.i18n.getMessage('regionErrorHeader'),
        chrome.i18n.getMessage('regionErrorText', region),
        'Region not supported');
}

//check for free game
if (document.getElementById('game_area_purchase').getElementsByTagName('div')[0].getAttribute('class') == 'game_area_purchase_game ') {
    modal('free_game_modal', )
    throw new Error('This game is free, stopped drawing the chart');
}

//find the price to search for
let foundFirstOption = false,
    i = 0,
    isBundle = false,
    id,
    firstPurchaseOption;
const wrappers = document.getElementsByClassName('game_area_purchase_game_wrapper');
while (!foundFirstOption) {
    if (wrappers[i].classList.length == 1) {
        firstPurchaseOption = wrappers[i];
        id = location.href.split('/')[4];
        foundFirstOption = true;
    } else if (wrappers[i].classList.length == 3) {
        firstPurchaseOption = wrappers[i];
        isBundle = true;
        id = firstPurchaseOption.getAttribute('data-ds-bundleid');
        foundFirstOption = true;
    }
    i++;
}

class localeOptions {
    constructor(options = {}) {
        this.siteButton = options.hasOwnProperty('siteButton') ? options.siteButton : true;
        this.dateFormat = options.dateFormat || '%A, %b %e, %Y';
        this.inputDateFormat = options.inputDateFormat || '%b %e, %Y';
        this.inputBoxWidth = options.inputBoxWidth || 90;
        this.buttonText = options.buttonText || ['1m', '3m', '6m', '1y', '3y', 'All'];
        this.dateTimeLabelFormats = options.dateTimeLabelFormats || {};
        this.navigatorDateFormats = options.navigatorDateFormats || {};
        this.chartLang = options.chartLang || {};
    }
}
const locale = {
    US: new localeOptions(),
    CN: new localeOptions({
        siteButton: false,
        dateFormat: '%m月%d日 %A %Y',
        inputDateFormat: '%Y年%m月%d日',
        inputBoxWidth: 100,
        buttonText: ['1月', '3月', '6月', '1年', '3年', '全部'],
        dateTimeLabelFormats: {
            week: '%m月%d日',
            month: '%Y年%m月',
        },
        navigatorDateFormats: {
            month: '%Y.%m',
        },
        chartLang: {
            lang: {
                months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                weekdays: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
                rangeSelectorZoom: '缩放',
                rangeSelectorFrom: '从',
                rangeSelectorTo: '到',
            }
        }
    }),
    EU1: new localeOptions({
        dateFormat: '%e %b %Y',
        inputDateFormat: '%e %b %Y',
    })
}

const localePrice = {
    US: {
        currency: ['$', ''],
        valueDecimals: 2,
        valueSymbol: '.'
    },
    CN: {
        currency: ['¥', ''],
        valueDecimals: 0,
        valueSymbol: '.'
    },
    EU1: {
        currency: ['', '€'],
        valueDecimals: 2,
        valueSymbol: ','
    }
}
// console.time('t');
const sysLang = window.navigator.languages[0];
// console.log(sysLang);
const langSetting = (sysLang == 'zh-CN' || sysLang == 'zh-TW') ? locale['CN'] : (sysLang == 'en' || sysLang == 'en-US') ? locale['US'] : locale['EU1'];
const priceSetting = localePrice[region];
const gameName = document.getElementsByClassName('apphub_AppName')[0].textContent;

const userChart = {
    full: {
        chart: {
            height: '400px',
        },

        navigator: {
            margin: 25,
        },

        scrollbar: {
            enabled: true
        },

        tooltip: {
            animation: true
        },

        rangeSelector: {
            enabled: true,
        },

        xAxis: {
            range: undefined
        }
    },
    simp: {
        chart: {
            animation: false,
            height: '350px',
        },

        plotOptions: {
            series: {
                animation: false,
            },
        },

        navigator: {
            margin: 20,
        },

        scrollbar: {
            enabled: false
        },

        tooltip: {
            animation: false
        },

        xAxis: {
            range: 7776000000
        }
    }
};
Object.freeze(userChart.full);
Object.freeze(userChart.simp);
let chartSetting;

const message = {
    id: id,
    storeRegion: region.toLowerCase(),
    lang: sysLang,
    name: gameName,
    bundle: isBundle
}
let bgResponse;
let chart;

// console.time('t');


const getData = new Promise(function(resolve, reject) {
    chrome.runtime.sendMessage(message, function(response) {
        if (response.data.points[0][1] == 0) {
            dataError(gameName);
        }

        let curPrice;
        if (firstPurchaseOption.getElementsByClassName('discount_final_price').length != 0) curPrice = firstPurchaseOption.getElementsByClassName('discount_final_price')[0];
        else curPrice = firstPurchaseOption.getElementsByClassName('game_purchase_price')[0];
        const price = curPrice.textContent.match(/[\d.,]+/)[0].replace(',', '.');
        // console.log(price);
        if (price != response.data.points[response.data.points.length - 1][1]) {
            dataError(gameName);
        }

        bgResponse = response;
        resolve();
        // console.timeEnd('t');
        // console.timeEnd('chartTime');
    });
});

const getSetting = new Promise(function(resolve, reject) {
    chrome.storage.sync.get('simplified', function(value) {
        chartSetting = value.simplified ? userChart.simp : userChart.full;
        resolve();
    });
});

Promise.all([getData, getSetting]).then(function() {
    const elements = document.getElementsByClassName('page_content');
    let loc;
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].className == 'page_content') {
            loc = elements[i];
            break;
        }
    }
    loc.insertAdjacentHTML('afterbegin', `
    <div class="steam_price_chart">
        <div id="chart_container" style="height: ${chartSetting.chart.height}; min-width: 310px"></div>
    </div>
    `);

    const title = isBundle ? bgResponse.bundleTitle : gameName;

    Highcharts.setOptions(langSetting.chartLang);
    Highcharts.setOptions(chartSetting);
    Highcharts.setOptions({
        lang: {
            decimalPoint: priceSetting.valueSymbol
        }
    });

    // console.log(bgResponse);

    // console.time('chartTime');

    let addButton = function(chart) {};
    if (langSetting.siteButton) {
        const itadImgUrl = chrome.extension.getURL('../images/isthereanydeal_icon.svg');
        const hltbImgUrl = chrome.extension.getURL('../images/howlongtobeat_logo.png');

        addButton = function(chart) {

            //add images
            function addImg(image, label, xAlign) {
                return chart.renderer.image(image, 0, 0, 20, 20)
                    .on('mouseover', function() {
                        label.css({
                            display: 'inline'
                        });
                    })
                    .on('mouseout', function() {
                        label.css({
                            display: 'none'
                        });
                    })
                    .align({
                        align: 'right',
                        x: xAlign,
                        y: 10
                    }, false, 'chart')
                    .add();
            }

            function addImgUrl(imgObj, url) {
                imgObj.css({
                        cursor: 'pointer'
                    })
                    .on('click', function() {
                        window.open(url, "_blank");
                    });
            }

            function addLabel(text) {
                return chart.renderer.label(text, 0, 0, 'callout', 910, 15)
                    .attr({
                        fill: '#377096',
                        r: 5,
                        padding: 8,
                        zIndex: 8,
                    })
                    .css({
                        color: '#d9dadd',
                        fontSize: '12px',
                        width: '120px',
                        display: 'none',
                    })
                    .shadow(true)
                    .add();
            }

            const itadLabel = addLabel('View the game on IsThereAnyDeal').align({
                align: 'right',
                x: -215,
                y: 5
            });
            addImgUrl(addImg(itadImgUrl, itadLabel, -85), bgResponse.itadUrl);

            if (bgResponse.hltbUrl == 'https://howlongtobeat.com/') {
                const hltbLabel = addLabel("Can't find the game on HowLongToBeat").align({
                    align: 'right',
                    x: -190,
                    y: 5
                });
                addImg(hltbImgUrl, hltbLabel, -55).css({
                    opacity: 0.3
                });
            } else {
                const hltbLabel = addLabel('View the game on HowLongToBeat').align({
                    align: 'right',
                    x: -180,
                    y: 5
                });
                addImgUrl(addImg(hltbImgUrl, hltbLabel, -55), bgResponse.hltbUrl);
            }
        }
    }

    chart = Highcharts.stockChart('chart_container', {
        chart: {
            backgroundColor: 'rgba( 0, 0, 0, 0.2 )',
            style: {
                fontFamily: '"Motiva Sans", sans-serif'
            }
        },

        title: {
            text: title + chrome.i18n.getMessage('priceHistory'),
            style: {
                color: '#FFFFFF'
            }
        },

        series: [{
            name: chrome.i18n.getMessage('lineName'),
            data: bgResponse.data.points,
            color: '#67c1f5',
            step: true,
            tooltip: {
                valueDecimals: priceSetting.valueDecimals,
                valuePrefix: priceSetting.currency[0],
                valueSuffix: priceSetting.currency[1]
            }
        }],

        xAxis: {
            ordinal: false,
            labels: {
                style: {
                    color: '#acb2b8',
                    fontSize: '12px',
                }
            },
            lineColor: '#626366',
            tickColor: '#626366',
            crosshair: false,
            tickPixelInterval: 200,
            dateTimeLabelFormats: langSetting.dateTimeLabelFormats,
        },

        yAxis: {
            gridLineColor: '#626366',
            gridLineWidth: 0.5,
            labels: {
                style: {
                    color: '#acb2b8',
                    fontSize: '12px',
                },
                formatter: function() {
                    return priceSetting.currency[0] + Math.round(this.value) + priceSetting.currency[1];
                }
            },
            offset: 30,
            tickLength: 30,
        },

        tooltip: {
            backgroundColor: '#171a21',
            style: {
                color: '#b8b6b4',
            },
            split: false,
            shared: true,
            useHTML: true,
            borderColor: '#171a21',
            xDateFormat: langSetting.dateFormat,
        },

        navigator: {
            handles: {
                backgroundColor: '#16202d',
                borderColor: '#acb2b8',
                height: 12,
                width: 6,
            },
            series: {
                type: 'line',
                step: true,
            },
            xAxis: {
                gridLineColor: '#626366',
                dateTimeLabelFormats: langSetting.navigatorDateFormats,
            },
            yAxis: {
                min: bgResponse.data.range[0] - (bgResponse.data.range[1] - bgResponse.data.range[0]) * 0.6,
                // minPadding: 0.7,
            },
            outlineColor: 'rgba( 0, 0, 0, 0 )',
            maskFill: 'rgba(102,133,194,0.2)',
        },

        scrollbar: {
            barBackgroundColor: '#274155',
            barBorderWidth: 1,
            barBorderColor: '#274155',
            barBorderRadius: 3,
            rifleColor: '#274155',
            buttonArrowColor: '#67c1f5',
            buttonBackgroundColor: '#274155',
            buttonBorderRadius: 3,
            buttonBorderWidth: 0,
            trackBackgroundColor: 'rgba( 0, 0, 0, 0 )',
            trackBorderColor: 'rgba( 0, 0, 0, 0 )',
        },

        rangeSelector: {
            buttonTheme: {
                fill: "rgba( 103, 193, 245, 0.2 )",
                style: {
                    color: "#67c1f5",
                },
                states: {
                    select: {
                        fill: "rgb(84, 165, 212)",
                        style: {
                            color: "#ffffff"
                        },
                        select: {
                            fill: "rgb(84, 165, 212)",
                            style: {
                                color: "#ffffff"
                            }
                        },
                    }
                }
            },
            inputStyle: {
                backgroundColor: "#18222e",
                color: "#acb2b8",
            },
            inputDateFormat: langSetting.inputDateFormat,
            inputEditDateFormat: '%m/%d/%Y',
            inputBoxWidth: langSetting.inputBoxWidth,
            labelStyle: {
                color: "#acb2b8"
            },
            selected: 1,
            buttons: [{
                type: "month",
                count: 1,
                text: langSetting.buttonText[0],
            }, {
                type: "month",
                count: 3,
                text: langSetting.buttonText[1],
            }, {
                type: "month",
                count: 6,
                text: langSetting.buttonText[2],
            }, {
                type: "year",
                count: 1,
                text: langSetting.buttonText[3],
            }, {
                type: "year",
                count: 3,
                text: langSetting.buttonText[4],
            }, {
                type: "all",
                text: langSetting.buttonText[5],
            }],
        },

        credits: {
            href: 'javascript:window.open("https://isthereanydeal.com/", "_blank")',
            text: 'IsThereAnyDeal.com',
            style: {
                color: '#acb2b8',
            },
            position: {
                x: -40,
            },
        },
    }, addButton);
    if (chartSetting.chart.height == '350px') {
        chart.update({
            rangeSelector: {
                enabled: false
            }
        });
    }
    if (isBundle) modal('display_bundle_modal', chrome.i18n.getMessage('bundleHeader'), chrome.i18n.getMessage('bundleText', gameName), false);
    console.timeEnd('t');
});

chrome.runtime.onMessage.addListener(
    function(request, sender) {
        if (request.simplified) {
            document.getElementById('chart_container').style.height = '350px';
            chart.update({
                rangeSelector: {
                    enabled: false
                }
            }, false);
            chart.update(userChart.simp);
        } else {
            document.getElementById('chart_container').style.height = '400px';
            chart.update(userChart.full);
            chart.update({
                chart: {
                    animation: true
                }
            });
        }
    });