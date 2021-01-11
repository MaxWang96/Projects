let drawChart;
let wait_on = 2;
// chrome.storage.sync.get('region', (value) => console.log(value));
// console.time('t');
let steamRegion = JSON.parse(document.getElementById('application_config').getAttribute('data-userinfo'))['country_code'].toLowerCase();
console.time('t');
chrome.storage.sync.get('region', (value) => {
	console.timeEnd('t');
	let setCookie = false, regionUser = value.region, currency = '$';
	if (regionUser != steamRegion) {
		chrome.storage.sync.set({
			region: steamRegion
		});
		setCookie = true;
		regionUser = steamRegion;
	}
	if (regionUser == 'cn') {
		currency = '¥';
	}
	chrome.runtime.sendMessage({
		url: location.href,
		cookie: setCookie,
		region: regionUser
	}, function(response) {
		drawChart = `
Highcharts.stockChart('chart_container', {

	chart: {
        backgroundColor: 'rgba( 0, 0, 0, 0.2 )',
        style: {
        	fontFamily: '"Motiva Sans", sans-serif'
        }
    },

	title: {
	    text: document.getElementsByClassName('apphub_AppName')[0].textContent + ' Price History',
	    style: {
	    	color: '#FFFFFF'
	    }
	},

	series: [{
		name: 'Price',
	    data: ${response},
	    color: '#67c1f5',
	    step: true,
	    tooltip: {
	        valueDecimals: 2,
	        valuePrefix: '$'
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
	},

	yAxis: {
		gridLineColor: '#626366',
		gridLineWidth: 0.5,
		labels: {
			style: {
				color: '#acb2b8',
				fontSize: '12px',
			},
			format: '${currency}\{value\}',
		},
		offset: 25,
        tickLength: 25,
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
    	href: 'https://isthereanydeal.com/',
    	text: 'IsThereAnyDeal.com',
    	style: {
			color: '#acb2b8',
		},
		position: {
			x: -35,
		},
    },

});`;
		drawChartCounter();
		// console.log(response[0]);
		// console.timeEnd('t');
	});
})
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
const chart = document.getElementsByClassName('chart_container')[0];

function createScript(source, text, loc, option, promise) {
	let newScript = document.createElement('script');
	if (source) newScript.src = source;
	newScript.text = text;
	if (option === 'before') loc.insertBefore(newScript, chart);
	else if (option === 'after') loc.appendChild(newScript);
	if (promise) {
		return new Promise((res, rej) => {
			newScript.onload = drawChartCounter;
			newScript.onerror = rej;
		});
	}
}

const src1 = 'https://code.highcharts.com/stock/highstock.js';
createScript(src1, '', document.head, 'after', true)
	.then();
// const src2 = 'https://code.highcharts.com/stock/modules/data.js';
// createScript(src2, '', document.head, 'after', true)
// 	.then(drawChartCounter());
// const src3 = 'https://code.highcharts.com/stock/modules/exporting.js';
// createScript(src3, '', document.head, 'after', true)
// 	.then(drawChartCounter());
// const src4 = 'https://code.highcharts.com/stock/modules/export-data.js';
// createScript(src4, '', document.head, 'after', true)
// 	.then(drawChartCounter());

// createScript(src, '', document.head, 'after', true)
// 	.then(() => {
// 		createScript('', drawChart, spcDiv, 'after', false);
// 	});

function drawChartCounter() {
	wait_on--;
	if (wait_on == 0) {
		createScript('', drawChart, spcDiv, 'after', false);
		// console.timeEnd('t');
	}
}