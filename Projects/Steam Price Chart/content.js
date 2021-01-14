'use strict';

console.time('t');
let drawChart;
let waitOnChart = 2;
const setting = {
	us: {
		currency: '$',
		valueDecimals: 2,
	},
	cn: {
		currency: '¥',
		valueDecimals: 0,
	}
};
// chrome.storage.sync.get('region', (value) => console.log(value));
// console.time('t');
const config = JSON.parse(document.getElementById('application_config').getAttribute('data-config'));
const country = config.COUNTRY.toLowerCase();
const countrySetting = setting[country];
const gameName = document.getElementsByClassName('apphub_AppName')[0].textContent;
// const lang = config.LANGUAGE;
const message = {
	url: location.href,
	country: country,
	name: gameName
}
// console.time('t');
chrome.runtime.sendMessage(message, function(response) {
	if (response.data.length == 2 && response.data[0] == 0) {
		return;
	}
	const itadUrl = chrome.extension.getURL('../images/isthereanydeal_icon.svg');
	const hltbUrl = chrome.extension.getURL('../images/howlongtobeat_logo.png');
	drawChart = `
Highcharts.stockChart('chart_container', {

	chart: {
        backgroundColor: 'rgba( 0, 0, 0, 0.2 )',
        style: {
        	fontFamily: '"Motiva Sans", sans-serif'
        }
    },

	title: {
	    text: "${gameName}" + ' Price History',
	    style: {
	    	color: '#FFFFFF'
	    }
	},

	series: [{
		name: 'Price',
	    data: ${JSON.stringify(response.data)},
	    color: '#67c1f5',
	    step: true,
	    tooltip: {
	        valueDecimals: ${countrySetting.valueDecimals},
	        valuePrefix: '${countrySetting.currency}'
	    }
	}],

	xAxis: {
		ordinal: false,
		labels: {
			style: {
				color: '#acb2b8',
				fontSize: '12px'
			}
		},
		lineColor: '#626366',
		tickColor: '#626366',
		crosshair: false,
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
				return '${countrySetting.currency}' + Math.round(this.value);
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
		xDateFormat: '%A, %b %e, %Y'
	},

	navigator: {
        handles: {
            backgroundColor: '#434953',
            borderColor: '#acb2b8',
        },
        series: {
            type: 'area'
        },
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
        labelStyle: {
            color: "#acb2b8"
        },
        selected: 1,
        buttons: [{
            type: "month",
            count: 1,
            text: "1m"
        }, {
            type: "month",
            count: 3,
            text: "3m"
        }, {
            type: "month",
            count: 6,
            text: "6m"
        }, {
            type: "year",
            count: 1,
            text: "1y"
        }, {
            type: "year",
            count: 3,
            text: "3y"
        }, {
            type: "all",
            text: "All"
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

}, function (chart) {
        function addImg(image, url, label, xAlign) {
            chart.renderer.image(image, 0, 0, 20, 20)
                .css({ cursor: 'pointer' })
                .on('click', function () {
                    window.open(url, "_blank");
                })
                .on('mouseover', function () {
                    label.css({ display: 'inline' });
                })
                .on('mouseout', function () {
                    label.css({ display: 'none' });
                })
                .align({ align: 'right', x: xAlign, y: 10 }, false, 'chart')
                .add();
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

        const itadLabel = addLabel('View the game on IsThereAnyDeal').align({ align: 'right', x: -215, y: 5 });
        addImg('${itadUrl}', '${response.itadUrl}', itadLabel, -85);
        const hltbLabel = addLabel('View the game on HowLongtoBeat').align({ align: 'right', x: -180, y: 5 });
        addImg('${hltbUrl}', '${response.hltbUrl}', hltbLabel, -55);
});`;
	drawChartCounter();
	// console.timeEnd('t');
});


function createScript(source, text, loc, promise = false) {
	let newScript = document.createElement('script');
	if (source) newScript.src = source;
	newScript.text = text;
	loc.appendChild(newScript);
	if (promise) {
		return new Promise((res, rej) => {
			newScript.onload = promise;
			newScript.onerror = rej;
		});
	}
}

const chartSrc = 'https://code.highcharts.com/stock/highstock.js';
createScript(chartSrc, '', document.head, drawChartCounter).then();

function drawChartCounter() {
	waitOnChart--;
	if (waitOnChart == 0) {
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
		const spcDiv = document.getElementsByClassName('steam_price_chart')[0];
		createScript('', drawChart, spcDiv, false);
		console.timeEnd('t');
	}
}