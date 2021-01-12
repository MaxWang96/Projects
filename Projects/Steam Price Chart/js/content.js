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
let region = setting.us;
// chrome.storage.sync.get('region', (value) => console.log(value));
// console.time('t');
const config = JSON.parse(document.getElementById('application_config').getAttribute('data-config'));
const steamRegion = config.COUNTRY.toLowerCase();
const lang = config.LANGUAGE;
const gameName = document.getElementsByClassName('apphub_AppName')[0].textContent;
const message = {
	url: location.href,
	cookie: false,
	region: steamRegion,
	name: gameName,
	lang: lang
}
// console.time('t');
chrome.storage.sync.get('region', (value) => {
	// console.timeEnd('t');
	let regionUser = value.region;
	if (regionUser != steamRegion) {
		chrome.storage.sync.set({
			region: steamRegion
		});
		message.cookie = true;
		regionUser = steamRegion;
	}
	if (regionUser == 'cn') {
		region = setting.cn;
	}
	chrome.runtime.sendMessage(message, function(response) {
		if (response.length == 2 && response[0] == 0) {
			return;
		}
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
	    data: ${JSON.stringify(response)},
	    color: '#67c1f5',
	    step: true,
	    tooltip: {
	        valueDecimals: ${region.valueDecimals},
	        valuePrefix: '${region.currency}'
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
			format: '${region.currency}\{value\}',
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
    	href: 'https://isthereanydeal.com/',
    	text: 'IsThereAnyDeal.com',
    	style: {
			color: '#acb2b8',
		},
		position: {
			x: -40,
		},
    },

});`;
		drawChartCounter();
		// console.timeEnd('t');
	});
})

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
		// console.timeEnd('t');
	}
}