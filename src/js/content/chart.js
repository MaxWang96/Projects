'use strict';

function drawChart(results) {
  const {
    info,
    chartData,
  } = results[0];
  const {
    simp,
    animation,
    range,
  } = results[1];

  setupData(chartData.data, info.targetOption, range);
  const showOriginal = (range === 'all' && chartData.data.origin);

  const title = (bundle === 'app' || bundle === 'appSub') ? chartData.bundleTitle : info.itemName;
  const data = showOriginal ? chartData.originalData : chartData.data.points;
  if (showOriginal) showOriginalModal();

  const {
    sysLang,
  } = info;
  let lang;
  if (sysLang.startsWith('zh')) lang = locale.CN;
  else if (sysLang.startsWith('en')) lang = locale.US;
  else lang = locale.EU1;

  const setting = {
    chart: results[1].options,
    price: localePrice[info.region],
    lang,
  };
  const globalSetting = {
    lang: setting.lang.lang,
    time: {
      timezoneOffset: new Date().getTimezoneOffset(),
      useUTC: false,
    },
  };
  Object.assign(globalSetting, setting.chart);
  Highcharts.setOptions(globalSetting);
  const text = setting.lang.buttonText;
  const rangeButtons = setRangeButtons(range, text);

  const chartOptions = {
    chart: {
      backgroundColor: 'rgba( 0, 0, 0, 0.2 )',
      events: {
        load() {
          if (setting.lang.siteButton
            && bundle !== 'bundle'
            && bundle !== 'sub') addButtons(this, chartData);
        },
      },
      style: {
        fontFamily: '"Motiva Sans", sans-serif',
      },
      animation,
    },

    title: {
      text: title + chrome.i18n.getMessage('priceHistory'),
      style: {
        color: '#FFFFFF',
      },
    },

    series: [{
      name: chrome.i18n.getMessage('lineName'),
      color: '#67c1f5',
      step: true,
      data,
    }],

    plotOptions: {
      series: {
        findNearestPointBy: 'xy',
        animation,
      },
    },

    xAxis: {
      ordinal: false,
      labels: {
        style: {
          color: '#acb2b8',
          fontSize: '12px',
        },
      },
      lineColor: '#626366',
      tickColor: '#626366',
      crosshair: false,
      endOnTick: true,
      tickPixelInterval: 200,
      dateTimeLabelFormats: setting.lang.dateTimeLabelFormats,
    },

    yAxis: {
      gridLineColor: '#626366',
      gridLineWidth: 0.5,
      labels: {
        x: 3,
        style: {
          color: '#acb2b8',
          fontSize: '12px',
        },
        formatter() {
          return setting.price.currency[0] + Math.round(this.value) + setting.price.currency[
            1];
        },
      },
      offset: 30,
      tickLength: 30,
    },

    tooltip: {
      backgroundColor: 'rgba( 23, 26, 33, 0.9 )',
      style: {
        color: '#b8b6b4',
      },
      split: false,
      shared: true,
      useHTML: true,
      borderColor: '#171a21',
      formatter() {
        const {
          point,
        } = this.points[0];
        const date = Highcharts.dateFormat(setting.lang.dateFormat, this.x);
        const price = setting.price.formatPrice(point.y);
        const discount = chartData.data.discount[point.index];
        let htmlStr = `<span style="font-size:90%">${date}</span>`;
        htmlStr += `<br/>${chrome.i18n.getMessage('linePrefix')}<b>${price}</b><br/>`;
        if (!showOriginal) {
          if (chartData.data.discount[point.index] === 0) {
            htmlStr += chrome.i18n.getMessage('noDiscount');
          } else if (chartData.data.discount[point.index] !== 100) {
            htmlStr += `${chrome.i18n.getMessage('discountPrefix')}<b>${discount}%</b>`;
          } else {
            htmlStr += chrome.i18n.getMessage('freeItem');
          }
        }
        return htmlStr;
      },
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
        dateTimeLabelFormats: setting.lang.navigatorDateFormats,
      },
      yAxis: {
        min: chartData.data.priceRange[0] - (chartData.data.priceRange[1]
          - chartData.data.priceRange[0]) * 0.6,
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
        fill: 'rgba( 103, 193, 245, 0.2 )',
        cursor: 'pointer',
        style: {
          color: '#67c1f5',
        },
        states: {
          select: {
            fill: 'rgb(84, 165, 212)',
            style: {
              color: '#ffffff',
            },
          },
        },
      },
      inputStyle: {
        backgroundColor: '#18222e',
        color: '#acb2b8',
        cursor: 'text',
      },
      inputDateFormat: setting.lang.inputDateFormat,
      inputEditDateFormat: setting.lang.inputEditDateFormat,
      inputDateParser: setting.lang.inputDateParser,
      inputBoxWidth: setting.lang.inputBoxWidth,
      labelStyle: {
        color: '#acb2b8',
      },
      selected: 1,
      buttons: rangeButtons,
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

  let height;
  const tmp = userChart.height;
  if (bundle === 'bundle' || bundle === 'sub') {
    if (simp) height = tmp.bundleSimp;
    else height = tmp.bundleFull;
  } else {
    if (simp) height = tmp.appSimp;
    else height = tmp.appFull;
  }
  insertChart(height);

  const chart = Highcharts.stockChart('chart_container', chartOptions);
  if (simp) {
    chart.update({
      rangeSelector: {
        enabled: false,
      },
    }, true, false, false);
  }
  chart.rangeData = {
    fullData: chartData.data.fullData,
    dateFormat: setting.lang.dateFormat,
    formatPrice: setting.price.formatPrice,
    buttonText: text,
  };
  if (chartData.data.origin) chart.rangeData.originalData = chartData.originalData;

  if (bundle === 'app') bundleModal(info.itemName);
  else if (bundle === 'appSub') subModal(info.itemName);

  chrome.storage.onChanged.addListener((change) => {
    if (change.hasOwnProperty('appSimp') || change.hasOwnProperty('bundleSimp')) updateSimp(change);
    else if (change.hasOwnProperty('animation')) updateAnimation(change);
    else if (change.hasOwnProperty('range')) updateRange(change);
  });
}

// get the price history and other data, user setting, and then draw the chart
function makeChart() {
  const getData = new Promise(dataRequest);
  const getSetting = new Promise(settingRequest);
  Promise.all([getData, getSetting])
    .then(drawChart)
    .catch((e) => {
      if (e === 'timeout') timeoutModal();
      else if (e === 'cantConnect') cantConnectModal();
      else if (e === 'wrongName') dataModal();
      else if (e.message !== 'chart error') throw e;
    });
}
