'use strict';

const supportedRegion = ['US', 'CN', 'EU1'];

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