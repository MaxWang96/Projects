'use strict';

function makeChart() {
	const getData = new Promise(dataRequest);
	const getSetting = new Promise(settingRequest);
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
}

function drawChart() {
	const title = isBundle ? bgResponse.bundleTitle : itemName;
	const chartOptions = {
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
	};
	const addBttn = langSetting.siteButton ? addButtons : function(chart) {};

	insertChart();

	Highcharts.setOptions(langSetting.chartLang);
	Highcharts.setOptions(chartSetting);
	Highcharts.setOptions({
		lang: {
			decimalPoint: priceSetting.valueSymbol
		}
	});

	chart = Highcharts.stockChart('chart_container', chartOptions, addBttn);
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
	// console.timeEnd('t');
}

function insertChart() {
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
}

function addImg(chart, image, label, xAlign) {
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

function addLabel(chart, text) {
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

function addButtons(chart) {
	const itadImgUrl = chrome.runtime.getURL('../images/isthereanydeal_icon.svg');
	const hltbImgUrl = chrome.runtime.getURL('../images/howlongtobeat_icon.png');
	const itemType = isMusic ? 'soundtrack' : isDlc ? 'DLC' : 'game';
	const itadLabel = addLabel(chart, `View the ${itemType} on IsThereAnyDeal`).align({
		align: 'right',
		x: isMusic ? -230 : isDlc ? -205 : -215,
		y: 5
	});
	addImgUrl(addImg(chart, itadImgUrl, itadLabel, -85), bgResponse.itadUrl);

	if (bgResponse.hltbUrl == 'https://howlongtobeat.com/') {
		const cantConnect = bgResponse.error && bgResponse.error[1] == 0;
		const errorMessage = cantConnect ?
			"Can't connect to HowLongToBeat" :
			"Can't find the game on HowLongToBeat";
		const hltbLabel = addLabel(chart, errorMessage).align({
			align: 'right',
			x: cantConnect ? -173 : -193,
			y: 5
		});
		addImg(chart, hltbImgUrl, hltbLabel, -55).css({
			opacity: 0.3
		});
	} else {
		const hltbLabel = addLabel(chart, 'View the game on HowLongToBeat').align({
			align: 'right',
			x: -183,
			y: 5
		});
		addImgUrl(addImg(chart, hltbImgUrl, hltbLabel, -55), bgResponse.hltbUrl);
	}
}

function updateChart(request) {
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
}