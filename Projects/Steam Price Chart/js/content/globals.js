'use strict';

const supportedRegion = ['US', 'CN', 'EU1'];

const eu1 = ['AL', 'AD', 'AT', 'BE', 'FI', 'FR', 'DK', 'DE', 'IE', 'LI', 'LU', 'MK', 'NL', 'SE', 'CH'];

class LocaleOptions {
  constructor(options = {}) {
    this.siteButton = options.hasOwnProperty('siteButton') ? options.siteButton : true;
    this.dateFormat = options.dateFormat || '%A, %b %e, %Y';
    this.inputDateFormat = options.inputDateFormat || '%b %e, %Y';
    this.inputEditDateFormat = options.inputEditDateFormat || '%m/%d/%Y';
    this.inputDateParser = options.inputDateParser || undefined;
    this.inputBoxWidth = options.inputBoxWidth || 90;
    this.buttonText = options.buttonText || ['1m', '3m', '6m', '1y', '3y', 'All'];
    this.dateTimeLabelFormats = options.dateTimeLabelFormats || {};
    this.navigatorDateFormats = options.navigatorDateFormats || {};
    this.lang = options.lang || {};
  }
}
const locale = {
  US: new LocaleOptions(),
  CN: new LocaleOptions({
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
    lang: {
      weekdays: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
      rangeSelectorZoom: '缩放',
      rangeSelectorFrom: '从',
      rangeSelectorTo: '到',
    },
  }),
  EU1: new LocaleOptions({
    dateFormat: '%e %b %Y',
    inputDateFormat: '%e %b %Y',
    inputEditDateFormat: '%d.%m.%Y',
    inputDateParser(value) {
      const values = value.split('.');
      return Date.UTC(
        parseInt(values[2], 10),
        parseInt(values[1] - 1, 10),
        parseInt(values[0], 10),
      );
    },
  }),
};

const localePrice = {
  US: {
    currency: ['$', ''],
    formatPrice(value) {
      return `$${value.toFixed(2)}`;
    },
  },
  CN: {
    currency: ['¥', ''],
    formatPrice(value) {
      return Number.isSafeInteger(value) ? `¥${value}` : `¥${value.toFixed(2)}`;
    },
  },
  EU1: {
    currency: ['', '€'],
    formatPrice(value) {
      const price = `${value.toFixed(2)}€`;
      return price.replace('.', ',');
    },
  },
};

const userChart = {
  full: {
    chart: {},

    navigator: {
      margin: 25,
    },

    scrollbar: {
      enabled: true,
    },

    tooltip: {
      animation: true,
    },

    rangeSelector: {
      enabled: true,
      selected: 1,
    },

    xAxis: {
      range: undefined,
    },
  },
  simp: {
    chart: {
      animation: false,
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
      enabled: false,
    },

    tooltip: {
      animation: false,
    },

    rangeSelector: {
      selected: 1,
    },

    xAxis: {
      range: 7776000000,
    },
  },
  height: {
    appSimp: '350px',
    appFull: '400px',
    bundleSimp: '300px',
    bundleFull: '350px',
  },
};
Object.freeze(userChart.full);
Object.freeze(userChart.simp);

let bundle = false;
