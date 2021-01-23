'use strict';

console.time('t');
// console.log(window.navigator.languages[0]);
// console.log(document.readyState);
function errorModal(id, header, text, error) {
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
                // 'color': '#ffffff'
                'color': '#25282a',
                'line-height': '19px',
            })
            .modal({
                backdrop: false
            });
    }

    if (document.readyState != 'complete') {
        $(window).on('load', showModal);
    } else showModal();

    throw new Error(error);
}

function dataError(gameName) {
    errorModal('price_data_error_modal', 'Price History Data Error', `Sorry, there is something wrong with ${gameName}'s price history data, Steam Price Chart can't draw the chart.`, 'Price data error');
}

const config = JSON.parse(document.getElementById('application_config').getAttribute('data-config'));
const region = config.COUNTRY;
const supportedRegion = ['US', 'CN'];
if (!supportedRegion.includes(region)) {
    errorModal('not_supported_modal',
        'Region Not Supported',
        `Sorry, Steam Price Chart doesn't support the store region (${region}) you are in.`,
        'Region not supported');
}

// console.log(document.getElementById('game_area_purchase').getElementsByTagName('div')[0].getAttribute('class') == 'game_area_purchase_game ');

//check for free game
// if (document.getElementsByClassName('game_area_purchase_game_wrapper').length == 0) throw new Error('This game is free, stopped drawing the chart');
if (document.getElementById('game_area_purchase').getElementsByTagName('div')[0].getAttribute('class') == 'game_area_purchase_game ') {
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

const locale = {
    US: {
        siteButton: true,
        dateFormat: '%A, %b %e, %Y',
        inputDateFormat: '%b %e, %Y',
        inputBoxWidth: 90,
        buttonText: ['1m', '3m', '6m', '1y', '3y', 'All'],
        dateTimeLabelFormats: {},
        chartLang: {},
    },
    CN: {
        siteButton: false,
        dateFormat: '%m月%d日 %A %Y',
        inputDateFormat: '%Y年%m月%d日',
        inputBoxWidth: 100,
        buttonText: ['1月', '3月', '6月', '1年', '3年', '全部'],
        dateTimeLabelFormats: {
            week: '%m月%d日',
            month: '%Y年%m月',
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
    }
};
const localePrice = {
    US: {
        currency: '$',
        valueDecimals: 2,
    },
    CN: {
        currency: '¥',
        valueDecimals: 0,
    }
}
// chrome.storage.sync.get('region', (value) => console.log(value));
// console.time('t');
// console.log(window.navigator.languages[0]);
const sysLang = window.navigator.languages[0];
let langSetting = locale['US'];
if (sysLang == 'zh-CN') {
    langSetting = locale['CN'];
}
const priceSetting = localePrice[region];
const gameName = document.getElementsByClassName('apphub_AppName')[0].textContent;
// const lang = config.LANGUAGE;
const message = {
    id: id,
    storeRegion: region.toLowerCase(),
    lang: sysLang,
    name: gameName,
    bundle: isBundle
}
let chart;

// console.time('t');
chrome.runtime.sendMessage(message, function(response) {
    if (response.data.points[0][1] == 0) {
        dataError(gameName);
    }

    let curPrice;
    if (firstPurchaseOption.getElementsByClassName('discount_final_price').length != 0) curPrice = firstPurchaseOption.getElementsByClassName('discount_final_price')[0];
    else curPrice = firstPurchaseOption.getElementsByClassName('game_purchase_price')[0];
    const price = curPrice.textContent.match(/[\d.]+/)[0];
    // console.log(price);
    if (price != response.data.points[response.data.points.length - 1][1]) {
        // console.log('this price is wrong');
        // errorModal('price_data_error_modal', 'Price History Data Error', `Sorry, there is something wrong with ${gameName}'s price history data, Steam Price Chart won't draw the chart.`, 'Price data error');
        dataError(gameName);
    }

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
        <div id="chart_container" style="height: 400px; min-width: 310px"></div>
    </div>
    `);

    const title = isBundle ? response.bundleTitle : gameName;

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
            addImgUrl(addImg(itadImgUrl, itadLabel, -85), response.itadUrl);
            // const hltbLabel = addLabel('View the game on HowLongToBeat').align({
            //     align: 'right',
            //     x: -180,
            //     y: 5
            // });
            // const hltbImg = addImg(hltbUrl, response.hltbUrl, hltbLabel, -55);
            if (response.hltbUrl == 'https://howlongtobeat.com/') {
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
                addImgUrl(addImg(hltbImgUrl, hltbLabel, -55), response.hltbUrl);
            }
        }
    }

    Highcharts.setOptions(langSetting.chartLang);

    // console.time('chartTime');

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
            data: response.data.points,
            color: '#67c1f5',
            step: true,
            tooltip: {
                valueDecimals: priceSetting.valueDecimals,
                valuePrefix: priceSetting.currency,
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
                    return priceSetting.currency + Math.round(this.value);
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
            },
            yAxis: {
                min: response.data.range[0] - (response.data.range[1] - response.data.range[0]) * 0.6,
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
            rifleColor: '#67c1f5',
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

    console.timeEnd('t');
    // console.timeEnd('chartTime');
});

chrome.storage.sync.get('simplified', function(value) {
    swit.checked = value.simplified;
    let initSpeed = '0.4s';
    if (value.simplified) initSpeed = '0s';
    const init = new Switchery(swit, {
        size: 'small',
        color: '#377096',
        speed: initSpeed
    });
    if (value.simplified) init.options.speed = '0.4s';
});

chrome.runtime.onMessage.addListener(
    function(request, sender) {
        if (request.simplified) {
            document.getElementById('chart_container').style.height = '350px';
            chart.update({
                chart: {
                    animation: false,
                    height: '350px',
                },

                rangeSelector: {
                    enabled: false
                },

                navigator: {
                    margin: 20,
                },

                scrollbar: {
                    enabled: false
                },

                tooltip: {
                    animation: false
                }
            });
        } else {
            document.getElementById('chart_container').style.height = '400px';
            chart.update({
                chart: {
                    height: '400px',
                },

                rangeSelector: {
                    enabled: true
                },

                navigator: {
                    margin: 25,
                },

                scrollbar: {
                    enabled: true
                },

                tooltip: {
                    animation: true
                }
            });
        }
    });