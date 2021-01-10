// console.time('t')
let wait_on = 1;
// console.log(response[0]);
// console.timeEnd('t');
let data = [
    [1576108800000, 24.99, 19.99],
    [1578009600000, 24.99, 19.99],
    [1578009600000, 24.99],
    [1579629600000, 24.99],
    [1579629600000, 24.99, 19.99],
    [1580148000000, 24.99, 19.99],
    [1580148000000, 24.99],
    [1588870800000, 24.99],
    [1588870800000, 24.99, 19.99],
    [1589216400000, 24.99, 19.99],
    [1589216400000, 24.99],
    [1592931600000, 24.99],
    [1592931600000, 24.99, 19.99],
    [1594335600000, 24.99, 19.99],
    [1594335600000, 24.99],
    [1600362000000, 24.99],
    [1600362000000, 24.99, 19.99],
    [1600988400000, 24.99, 19.99],
    [1600988400000, 24.99],
    [1603990800000, 24.99],
    [1603990800000, 24.99, 19.99],
    [1604599200000, 24.99, 19.99],
    [1604599200000, 24.99],
    [1606327200000, 24.99],
    [1606327200000, 24.99, 19.99],
    [1606932000000, 24.99, 19.99],
    [1606932000000, 24.99],
    [1607536800000, 24.99],
    [1607536800000, 24.99, 19.99],
    [1607990400000, 24.99, 19.99],
    [1607990400000, 24.99],
    [1608660000000, 24.99],
    [1608660000000, 24.99, 19.99],
    [1609869600000, 24.99, 19.99],
    [1609869600000, 24.99],
    [1610122957000, 24.99],
];
function cleanData() {
	data.forEach(data => data.forEach((data, idx, arr) => arr[idx] = +data));
	let startIdx;
	if (data[0].length == 2) {
		startIdx = 1;
	} else {
		startIdx = 0;
	}
	for (; startIdx < data.length; startIdx++) {
		if (data[startIdx].length == 3) {
			data[startIdx].splice(1, 1);
		} else if (data[startIdx].length == 1) {
			data.splice(startIdx, 1);
		}
	}
}
cleanData(data);

const loc = document.getElementsByClassName('page_content')[2];
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
		newScript.onload = drawChartCounter;
	}
}

const src1 = 'https://code.highcharts.com/stock/highstock.js';
createScript(src1, '', document.head, 'after', true);
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
		const drawChart = `
Highcharts.stockChart('chart_container', {

	chart: {
        backgroundColor: 'rgba( 0, 0, 0, 0.2 )',
        style: {
        	fontFamily: '"Motiva Sans", sans-serif'
        }
    },

	rangeSelector: {
	    selected: 1
	},

	title: {
	    text: document.getElementsByClassName('apphub_AppName')[0].textContent + ' Price History',
	    style: {
	    	color: '#FFFFFF'
	    }
	},

	series: [{
		name: 'Price',
	    data: ${JSON.stringify(data)},
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
			format: '$\{value\}',
		},
	},

	tooltip: {
		backgroundColor: '#000000',
		style: {
			color: '#67c1f5',
		},
	},

	navigator: {
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
                    }
                }
            }
        },
        //inputBoxBorderColor: "#505053",
        inputStyle: {
            backgroundColor: "rgba( 103, 193, 245, 0.2 )",
            color: "#acb2b8"
        },
        labelStyle: {
            color: "#acb2b8"
        },
    },

    credits: {
    	href: 'https://www.steamprices.com/',
    	text: 'SteamPrices.com',
    },
});`;
		createScript('', drawChart, spcDiv, 'after', false);
	}
}
// const drawChart = `
//         window.chartColors = {
//             red: 'rgb(255, 99, 132)',
//             orange: 'rgb(255, 159, 64)',
//             yellow: 'rgb(255, 205, 86)',
//             green: 'rgb(75, 192, 192)',
//             blue: 'rgb(54, 162, 235)',
//             purple: 'rgb(153, 102, 255)',
//             grey: 'rgb(201, 203, 207)'
//         };

//         (function (global) {
//             var MONTHS = [
//                 'January',
//                 'February',
//                 'March',
//                 'April',
//                 'May',
//                 'June',
//                 'July',
//                 'August',
//                 'September',
//                 'October',
//                 'November',
//                 'December'
//             ];

//             var COLORS = [
//                 '#4dc9f6',
//                 '#f67019',
//                 '#f53794',
//                 '#537bc4',
//                 '#acc236',
//                 '#166a8f',
//                 '#00a950',
//                 '#58595b',
//                 '#8549ba'
//             ];

//             var Samples = global.Samples || (global.Samples = {});
//             var Color = global.Color;

//             Samples.utils = {
//                 // Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
//                 srand: function (seed) {
//                     this._seed = seed;
//                 },

//                 rand: function (min, max) {
//                     var seed = this._seed;
//                     min = min === undefined ? 0 : min;
//                     max = max === undefined ? 1 : max;
//                     this._seed = (seed * 9301 + 49297) % 233280;
//                     return min + (this._seed / 233280) * (max - min);
//                 },

//                 numbers: function (config) {
//                     var cfg = config || {};
//                     var min = cfg.min || 0;
//                     var max = cfg.max || 1;
//                     var from = cfg.from || [];
//                     var count = cfg.count || 8;
//                     var decimals = cfg.decimals || 8;
//                     var continuity = cfg.continuity || 1;
//                     var dfactor = Math.pow(10, decimals) || 0;
//                     var data = [];
//                     var i, value;

//                     for (i = 0; i < count; ++i) {
//                         value = (from[i] || 0) + this.rand(min, max);
//                         if (this.rand() <= continuity) {
//                             data.push(Math.round(dfactor * value) / dfactor);
//                         } else {
//                             data.push(null);
//                         }
//                     }

//                     return data;
//                 },

//                 labels: function (config) {
//                     var cfg = config || {};
//                     var min = cfg.min || 0;
//                     var max = cfg.max || 100;
//                     var count = cfg.count || 8;
//                     var step = (max - min) / count;
//                     var decimals = cfg.decimals || 8;
//                     var dfactor = Math.pow(10, decimals) || 0;
//                     var prefix = cfg.prefix || '';
//                     var values = [];
//                     var i;

//                     for (i = min; i < max; i += step) {
//                         values.push(prefix + Math.round(dfactor * i) / dfactor);
//                     }

//                     return values;
//                 },

//                 months: function (config) {
//                     var cfg = config || {};
//                     var count = cfg.count || 12;
//                     var section = cfg.section;
//                     var values = [];
//                     var i, value;

//                     for (i = 0; i < count; ++i) {
//                         value = MONTHS[Math.ceil(i) % 12];
//                         values.push(value.substring(0, section));
//                     }

//                     return values;
//                 },

//                 color: function (index) {
//                     return COLORS[index % COLORS.length];
//                 },

//                 transparentize: function (color, opacity) {
//                     var alpha = opacity === undefined ? 0.5 : 1 - opacity;
//                     return Color(color).alpha(alpha).rgbString();
//                 }
//             };

//             // DEPRECATED
//             window.randomScalingFactor = function () {
//                 return Math.round(Samples.utils.rand(-100, 100));
//             };

//             // INITIALIZATION

//             Samples.utils.srand(Date.now());

//             // Google Analytics
//             /* eslint-disable */
//             if (document.location.hostname.match(/^(www\.)?chartjs\.org$/)) {
//                 (function (i, s, o, g, r, a, m) {
//                     i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
//                         (i[r].q = i[r].q || []).push(arguments)
//                     }, i[r].l = 1 * new Date(); a = s.createElement(o),
//                         m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
//                 })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
//                 ga('create', 'UA-28909194-3', 'auto');
//                 ga('send', 'pageview');
//             }
//             /* eslint-enable */

//         }(this));
//         var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//         var color = Chart.helpers.color;
//         var barChartData = {
//             labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
//             datasets: [{
//                 label: 'Dataset 1',
//                 backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
//                 borderColor: window.chartColors.red,
//                 borderWidth: 1,
//                 data: [
//                     randomScalingFactor(),
//                     randomScalingFactor(),
//                     randomScalingFactor(),
//                     randomScalingFactor(),
//                     randomScalingFactor(),
//                     randomScalingFactor(),
//                     randomScalingFactor()
//                 ]
//             }, {
//                 label: 'Dataset 2',
//                 backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
//                 borderColor: window.chartColors.blue,
//                 borderWidth: 1,
//                 data: [
//                     randomScalingFactor(),
//                     randomScalingFactor(),
//                     randomScalingFactor(),
//                     randomScalingFactor(),
//                     randomScalingFactor(),
//                     randomScalingFactor(),
//                     randomScalingFactor()
//                 ]
//             }]

//         };

//         window.onload = function () {
//             var ctx = document.getElementById('price_history_chart').getContext('2d');
//             window.myBar = new Chart(ctx, {
//                 type: 'bar',
//                 data: barChartData,
//                 options: {
//                     responsive: true,
//                     legend: {
//                         position: 'top',
//                     },
//                     title: {
//                         display: true,
//                         text: 'Chart.js Bar Chart'
//                     }
//                 }
//             });

//         };
// `;



// let source = document.getElementsByTagName('head')[0];
// source.insertAdjacentHTML('beforeend', `
// 	<script src="https://code.highcharts.com/highcharts.js"></script>
// 	<script src="https://code.highcharts.com/modules/exporting.js"></script>
// 	<script src="https://code.highcharts.com/modules/export-data.js"></script>
// 	<script src="https://code.highcharts.com/modules/accessibility.js"></script>
// 	<script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.4/dist/Chart.min.js"></script>
// 	<script>
//         window.chartColors = {
//             red: 'rgb(255, 99, 132)',
//             orange: 'rgb(255, 159, 64)',
//             yellow: 'rgb(255, 205, 86)',
//             green: 'rgb(75, 192, 192)',
//             blue: 'rgb(54, 162, 235)',
//             purple: 'rgb(153, 102, 255)',
//             grey: 'rgb(201, 203, 207)'
//         };

//         (function (global) {
//             var MONTHS = [
//                 'January',
//                 'February',
//                 'March',
//                 'April',
//                 'May',
//                 'June',
//                 'July',
//                 'August',
//                 'September',
//                 'October',
//                 'November',
//                 'December'
//             ];

//             var COLORS = [
//                 '#4dc9f6',
//                 '#f67019',
//                 '#f53794',
//                 '#537bc4',
//                 '#acc236',
//                 '#166a8f',
//                 '#00a950',
//                 '#58595b',
//                 '#8549ba'
//             ];

//             var Samples = global.Samples || (global.Samples = {});
//             var Color = global.Color;

//             Samples.utils = {
//                 // Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
//                 srand: function (seed) {
//                     this._seed = seed;
//                 },

//                 rand: function (min, max) {
//                     var seed = this._seed;
//                     min = min === undefined ? 0 : min;
//                     max = max === undefined ? 1 : max;
//                     this._seed = (seed * 9301 + 49297) % 233280;
//                     return min + (this._seed / 233280) * (max - min);
//                 },

//                 numbers: function (config) {
//                     var cfg = config || {};
//                     var min = cfg.min || 0;
//                     var max = cfg.max || 1;
//                     var from = cfg.from || [];
//                     var count = cfg.count || 8;
//                     var decimals = cfg.decimals || 8;
//                     var continuity = cfg.continuity || 1;
//                     var dfactor = Math.pow(10, decimals) || 0;
//                     var data = [];
//                     var i, value;

//                     for (i = 0; i < count; ++i) {
//                         value = (from[i] || 0) + this.rand(min, max);
//                         if (this.rand() <= continuity) {
//                             data.push(Math.round(dfactor * value) / dfactor);
//                         } else {
//                             data.push(null);
//                         }
//                     }

//                     return data;
//                 },

//                 labels: function (config) {
//                     var cfg = config || {};
//                     var min = cfg.min || 0;
//                     var max = cfg.max || 100;
//                     var count = cfg.count || 8;
//                     var step = (max - min) / count;
//                     var decimals = cfg.decimals || 8;
//                     var dfactor = Math.pow(10, decimals) || 0;
//                     var prefix = cfg.prefix || '';
//                     var values = [];
//                     var i;

//                     for (i = min; i < max; i += step) {
//                         values.push(prefix + Math.round(dfactor * i) / dfactor);
//                     }

//                     return values;
//                 },

//                 months: function (config) {
//                     var cfg = config || {};
//                     var count = cfg.count || 12;
//                     var section = cfg.section;
//                     var values = [];
//                     var i, value;

//                     for (i = 0; i < count; ++i) {
//                         value = MONTHS[Math.ceil(i) % 12];
//                         values.push(value.substring(0, section));
//                     }

//                     return values;
//                 },

//                 color: function (index) {
//                     return COLORS[index % COLORS.length];
//                 },

//                 transparentize: function (color, opacity) {
//                     var alpha = opacity === undefined ? 0.5 : 1 - opacity;
//                     return Color(color).alpha(alpha).rgbString();
//                 }
//             };

//             // DEPRECATED
//             window.randomScalingFactor = function () {
//                 return Math.round(Samples.utils.rand(-100, 100));
//             };

//             // INITIALIZATION

//             Samples.utils.srand(Date.now());

//             // Google Analytics
//             /* eslint-disable */
//             if (document.location.hostname.match(/^(www\.)?chartjs\.org$/)) {
//                 (function (i, s, o, g, r, a, m) {
//                     i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
//                         (i[r].q = i[r].q || []).push(arguments)
//                     }, i[r].l = 1 * new Date(); a = s.createElement(o),
//                         m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
//                 })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
//                 ga('create', 'UA-28909194-3', 'auto');
//                 ga('send', 'pageview');
//             }
//             /* eslint-enable */

//         }(this));
//     </script>
// 	`);
// let chart = document.getElementsByClassName('page_content')[2];
// chart.insertAdjacentHTML('afterbegin', `
// 	<div class="chart_container">
// 		<div>
// 		<canvas id="price_history_chart"></canvas>
// 		</div>
// 	</div>
// 	`);
// let body = document.getElementsByTagName('body')[0];
// body.insertAdjacentHTML('beforeend', `
// 		<script>
// 		console.log('Hello??');
//         var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//         var color = Chart.helpers.color;
//         var barChartData = {
//             labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
//             datasets: [{
//                 label: 'Dataset 1',
//                 backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
//                 borderColor: window.chartColors.red,
//                 borderWidth: 1,
//                 data: [
//                     randomScalingFactor(),
//                     randomScalingFactor(),
//                     randomScalingFactor(),
//                     randomScalingFactor(),
//                     randomScalingFactor(),
//                     randomScalingFactor(),
//                     randomScalingFactor()
//                 ]
//             }, {
//                 label: 'Dataset 2',
//                 backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
//                 borderColor: window.chartColors.blue,
//                 borderWidth: 1,
//                 data: [
//                     randomScalingFactor(),
//                     randomScalingFactor(),
//                     randomScalingFactor(),
//                     randomScalingFactor(),
//                     randomScalingFactor(),
//                     randomScalingFactor(),
//                     randomScalingFactor()
//                 ]
//             }]

//         };

//         window.onload = function () {
//             var ctx = document.getElementById('price_history_chart').getContext('2d');
//             window.myBar = new Chart(ctx, {
//                 type: 'bar',
//                 data: barChartData,
//                 options: {
//                     responsive: true,
//                     legend: {
//                         position: 'top',
//                     },
//                     title: {
//                         display: true,
//                         text: 'Chart.js Bar Chart'
//                     }
//                 }
//             });

//         };
// 	</script>
// 	`)
// chart.insertAdjacentHTML('afterbegin', `
// 	<div id="chartContainer" style="width:100%; height:400px;">
// 	</div>
// 	<script>
// 	document.addEventListener('DOMContentLoade', () => {
// 		Highcharts.chart('chartContainer', {
// 		    title: {
// 		        text: 'Logarithmic axis demo'
// 		    },

// 		    xAxis: {
// 		        tickInterval: 1,
// 		        type: 'logarithmic',
// 		        accessibility: {
// 		            rangeDescription: 'Range: 1 to 10'
// 		        }
// 		    },

// 		    yAxis: {
// 		        type: 'logarithmic',
// 		        minorTickInterval: 0.1,
// 		        accessibility: {
// 		            rangeDescription: 'Range: 0.1 to 1000'
// 		        }
// 		    },

// 		    tooltip: {
// 		        headerFormat: '<b>{series.name}</b><br />',
// 		        pointFormat: 'x = {point.x}, y = {point.y}'
// 		    },

// 		    series: [{
// 		        data: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512],
// 		        pointStart: 1
// 		    }]
// 		});
// 	});
//     </script>
// 	`);


// loc.insertAdjacentHTML('afterbegin', `
// 	<div id="chartContainer" style="width:100%; height:400px;">
// 	</div>
// 	<script src="https://code.highcharts.com/highcharts.js"></script>
// 	<script src="https://code.highcharts.com/modules/exporting.js"></script>
// 	<script src="https://code.highcharts.com/modules/export-data.js"></script>
// 	<script src="https://code.highcharts.com/modules/accessibility.js"></script>
// 	<script>
// 	console.log('test');
// 	Highcharts.chart('chartContainer', {
// 	    title: {
// 	        text: 'Logarithmic axis demo'
// 	    },

// 	    xAxis: {
// 	        tickInterval: 1,
// 	        type: 'logarithmic',
// 	        accessibility: {
// 	            rangeDescription: 'Range: 1 to 10'
// 	        }
// 	    },

// 	    yAxis: {
// 	        type: 'logarithmic',
// 	        minorTickInterval: 0.1,
// 	        accessibility: {
// 	            rangeDescription: 'Range: 0.1 to 1000'
// 	        }
// 	    },

// 	    tooltip: {
// 	        headerFormat: '<b>{series.name}</b><br />',
// 	        pointFormat: 'x = {point.x}, y = {point.y}'
// 	    },

// 	    series: [{
// 	        data: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512],
// 	        pointStart: 1
// 	    }]
// 	});
// 	console.log('test');
//     </script>
// 	`);