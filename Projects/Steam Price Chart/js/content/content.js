'use strict';

console.time('t');
// console.log(window.navigator.languages[0]);
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

const purchaseArea = document.getElementById('game_area_purchase');
const isMusic = purchaseArea.getElementsByClassName('game_area_soundtrack_bubble').length != 0;
const isDlc = purchaseArea.getElementsByClassName('game_area_dlc_bubble').length != 0;
const itemName = document.getElementsByClassName('apphub_AppName')[0].textContent;
const gameName = (!isDlc && !isMusic) ?
	itemName :
	purchaseArea.getElementsByClassName('game_area_bubble')[0].querySelector('a').textContent;
//check for free game
if (purchaseArea.querySelector("div.game_area_purchase_game")
	.getAttribute('class') == 'game_area_purchase_game ') {
	modal('free_item_modal',
		chrome.i18n.getMessage('freeItemHeader'),
		chrome.i18n.getMessage('freeItemText', itemName),
		'This item is free, stopped drawing the chart');
}

//find the price to search for
let i = 0,
	isBundle = false,
	id,
	firstPurchaseOption;
const wrappers = purchaseArea.getElementsByClassName('game_area_purchase_game_wrapper');
while (true) {
	if (wrappers[i].classList.length == 1) {
		if (isMusic || wrappers[i].getElementsByClassName('music').length == 0) {
			const p = wrappers[i].querySelector('p');
			if (p == undefined || p.querySelector('a') == undefined) {
				firstPurchaseOption = wrappers[i];
				id = location.href.split('/')[4];
				break;
			}
		}
	} else if (wrappers[i].classList.length == 3) {
		firstPurchaseOption = wrappers[i];
		isBundle = true;
		id = firstPurchaseOption.getAttribute('data-ds-bundleid');
		break;
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
		dateFormat: '%Y年%m月%d日 %A',
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
			selected: 1,
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

		rangeSelector: {
			selected: 1
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


const getData = new Promise((resolve, reject) => {
	// console.time('bg');
	const noResponse = setTimeout(() => {
		reject('timeout');
	}, 10000);
	chrome.runtime.sendMessage(message, function(response) {
		// console.timeEnd('bg');
		clearTimeout(noResponse);

		if (response.error && response.error[0] == 0) {
			modal("cant_connect_to_itad_modal",
				"Can't Connect to ITAD",
				"Sorry, Steam Price Chart fail to connect to IsThereAnyDeal.com to get the price history data.",
				"Can't Connect: ITAD");
		}

		const points = response.data.points;
		if (points[0][1] == 0 || points[points.length - 1][1] != points[points.length - 2][1]) {
			dataError(itemName);
		}

		let price;
		let priceArr = [];
		let isDiscount = true;
		for (let i = 0; i < points.length; i++) {
			priceArr.push(points[i][1]);
		}
		// let discountData = response.data.discount;
		const discount = firstPurchaseOption.getElementsByClassName('discount_block');
		if (isBundle) {
			price = discount[0].getElementsByClassName('discount_final_price')[0].textContent.match(/[\d.,]+/)[0].replace(',', '.');
			if (discount.length != 0) {
				const searchRange = priceArr.length < 5 ? priceArr.length - 1 : 4;
				let max = price,
					k;
				for (k = 0; k < searchRange; k++) {
					if (priceArr[priceArr.length - k - 2] > max) {
						max = priceArr[priceArr.length - k - 2];
					}
				}
				if (max != price) {
					priceArr[priceArr.length - 1] = max;
				} else {
					priceArr[priceArr.length - 1] = price / 2;
					priceArr.push(price);
					isDiscount = false;
				}
			} else {
				priceArr[priceArr.length - 1] = price / 2;
				priceArr.push(price);
				isDiscount = false;
			}
		} else {
			if (discount.length != 0) {
				price = discount[0].getElementsByClassName('discount_final_price')[0].textContent.match(/[\d.,]+/)[0].replace(',', '.');
				priceArr[priceArr.length - 1] = discount[0].getElementsByClassName('discount_original_price')[0].textContent.match(/[\d.,]+/)[0].replace(',', '.');
			} else {
				price = firstPurchaseOption.getElementsByClassName('game_purchase_price')[0].textContent.match(/[\d.,]+/)[0].replace(',', '.');
				priceArr[priceArr.length - 1] = price / 2;
				priceArr.push(price);
				isDiscount = false;
			}
		}

		if (price != response.data.points[response.data.points.length - 1][1]) {
			dataError(itemName);
		}

		let k,
			base = [],
			priceIncrease = [];

		if (priceArr[0] >= priceArr[1]) {
			base.push(priceArr[0]);
			k = 0;
		} else {
			base.push(priceArr[1], priceArr[1]);
			priceIncrease.push(1);
			k = 1;
		}
		while (k < priceArr.length - 2) {
			let curBase = priceArr[k];
			if (curBase < priceArr[k + 1]) {
				base.push(priceArr[k + 1]);
				priceIncrease.push(k + 1);
				k++;
			} else {
				if (curBase == priceArr[k + 2]) {
					base.push(curBase, curBase);
					k += 2;
				} else if (curBase > priceArr[k + 2]) {
					if (curBase == priceArr[k + 3]) {
						base.push(curBase, curBase, curBase);
						k += 3;
					} else if (curBase == priceArr[k + 4]) {
						base.push(curBase, curBase, curBase, curBase);
						k += 4;
					} else if (priceArr[k + 1] == priceArr[k + 3]) {
						base.push(priceArr[k + 1], priceArr[k + 1], priceArr[k + 1]);
						k += 3;
					} else if (priceArr[k + 1] < priceArr[k + 2]) { // E
						base.push(curBase, priceArr[k + 2]);
						k += 2;
					} else if (priceArr[k + 2] > priceArr[k + 3]) {
						base.push(curBase, priceArr[k + 2], priceArr[k + 2], priceArr[k + 2]);
						k += 4;
					} else if (priceArr[k + 2] < priceArr[k + 3]) {
						base.push(priceArr[k + 1]);
						k++;
					} else {
						modal('unknown_discount_type_modal',
							'Unknown Discount Error',
							'Sorry, something went wrong when calculating the discount. Please consider reporting the issue to help improve the extension.',
							'Unknown Discount Type');
					}
				} else {
					base.push(curBase, priceArr[k + 2]);
					k += 2;
				}
			}
		}

		// check abnormally high price
		for (let i = priceIncrease.length - 1; i >= 0; i--) {
			const tmp = priceIncrease[i];
			if (tmp < priceArr.length - 1 && base[tmp] != base[tmp + 1]) {
				base[tmp - 1] = base[tmp + 1];
				base.splice(priceIncrease[i], 2);
				priceArr.splice(priceIncrease[i], 2);
				points.splice(priceIncrease[i], 2);
			}
		}

		if (isDiscount) {
			priceArr[priceArr.length - 1] = priceArr[priceArr.length - 2];
		} else {
			priceArr[priceArr.length - 2] = priceArr[priceArr.length - 3];
		}

		let discountArr = [];
		let j = 0;
		for (; j < points.length - 2; j++) {
			const curDiscount = Math.round((1 - priceArr[j] / base[j]) * 100);
			discountArr.push(curDiscount, curDiscount);
		}
		discountArr.push(Math.round((1 - priceArr[j] / base[j]) * 100), Math.round((1 - priceArr[j + 1] / base[j + 1]) * 100));

		response.data.discount = discountArr;

		let plotArr = [];
		let i = 0;
		for (; i < points.length - 2; i++) {
			plotArr.push(points[i]);
			plotArr.push([points[i + 1][0] - 3600000, points[i][1]]);
		}
		plotArr.push(points[i], points[i + 1]);
		response.data.points = plotArr;

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

function drawChart() {
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

	const title = isBundle ? bgResponse.bundleTitle : itemName;

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
		const itadImgUrl = chrome.runtime.getURL('../images/isthereanydeal_icon.svg');
		const hltbImgUrl = chrome.runtime.getURL('../images/howlongtobeat_icon.png');

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

			const itemType = isMusic ? 'soundtrack' : isDlc ? 'DLC' : 'game';
			const itadLabel = addLabel(`View the ${itemType} on IsThereAnyDeal`).align({
				align: 'right',
				x: isMusic ? -230 : isDlc ? -205 : -215,
				y: 5
			});
			addImgUrl(addImg(itadImgUrl, itadLabel, -85), bgResponse.itadUrl);

			if (bgResponse.hltbUrl == 'https://howlongtobeat.com/') {
				const cantConnect = bgResponse.error && bgResponse.error[1] == 0;
				const errorMessage = cantConnect ?
					"Can't connect to HowLongToBeat" :
					"Can't find the game on HowLongToBeat";
				const hltbLabel = addLabel(errorMessage).align({
					align: 'right',
					x: cantConnect ? -173 : -193,
					y: 5
				});
				addImg(hltbImgUrl, hltbLabel, -55).css({
					opacity: 0.3
				});
			} else {
				const hltbLabel = addLabel('View the game on HowLongToBeat').align({
					align: 'right',
					x: -183,
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

		plotOptions: {
			series: {
				findNearestPointBy: 'xy',
			}
		},

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
			// xDateFormat: langSetting.dateFormat,
			formatter: function() {
				// console.log(this.points[0].point.index);
				let htmlStr = `<span style="font-size:90%">${Highcharts.dateFormat(langSetting.dateFormat, this.x)}</span>`;
				const point = this.points[0].point;
				const price = priceSetting.currency[0] + point.y + priceSetting.currency[1];
				htmlStr += `<br/>${chrome.i18n.getMessage('linePrefix')}<b>${price}</b><br/>`;
				if (bgResponse.data.discount[point.index] == 0) {
					htmlStr += chrome.i18n.getMessage('noDiscount');
				} else if (bgResponse.data.discount[point.index] != 100) {
					htmlStr += `${chrome.i18n.getMessage('discountPrefix')}<b>${bgResponse.data.discount[point.index]}%</b>`;
				} else {
					htmlStr += chrome.i18n.getMessage('freeItem');
				}
				return htmlStr;
			}
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
	if (isBundle) {
		modal('display_bundle_modal',
			chrome.i18n.getMessage('bundleHeader'),
			chrome.i18n.getMessage('bundleText', itemName),
			false);
	}
	// console.log(chart);
	console.timeEnd('t');
}

Promise.all([getData, getSetting])
	.then(drawChart)
	.catch(error => {
		if (error == 'timeout') {
			modal('no_response_from_background_modal',
				'Background Error',
				'Sorry, something went wrong when fetching the price data.',
				'Background Error');
		}
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