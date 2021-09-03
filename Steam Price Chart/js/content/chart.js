'use strict';

function setRangeButtons(range, text) {
  const defaultButtons = [{
    type: 'month',
    count: 1,
    text: text[0],
  }, {
    type: 'month',
    count: 3,
    text: text[1],
  }, {
    type: 'month',
    count: 6,
    text: text[2],
  }, {
    type: 'year',
    count: 1,
    text: text[3],
  }, {
    type: 'year',
    count: 3,
    text: text[4],
  }, {
    type: 'all',
    text: text[5],
  }];
  if (range === '1y') {
    defaultButtons.splice(-2);
    defaultButtons[3].type = 'all';
  } else if (range === '3y') {
    defaultButtons.pop();
    defaultButtons[4].type = 'all';
  }
  return defaultButtons;
}

function addEvents(obj, label) {
  return obj
    .on('mouseover', () => {
      label.css({
        display: 'inline',
      });
    })
    .on('mouseout', () => {
      label.css({
        display: 'none',
      });
    });
}

function addImg(chart, image, label, xAlign) {
  return addEvents(chart.renderer.image(image, 0, 0, 20, 20), label)
    .align({
      align: 'right',
      x: xAlign,
      y: 10,
    }, false, 'chart')
    .add();
}

function addImgUrl(imgObj, url) {
  imgObj
    .css({
      cursor: 'pointer',
    })
    .on('click', () => {
      window.open(url, '_blank');
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

function setAlign(xAlign) {
  return {
    align: 'right',
    x: xAlign,
    y: 5,
  };
}

function addItadButton(chart, url) {
  const itadImgUrl = chrome.runtime.getURL('../images/isthereanydeal_icon.svg');
  const isDlc = document.getElementsByClassName('game_area_dlc_bubble').length !== 0;
  const isMusic = document.getElementsByClassName('game_area_soundtrack_bubble').length !== 0;

  let itemType;
  let offset;
  if (isMusic)[itemType, offset] = ['soundtrack', -230];
  else if (isDlc)[itemType, offset] = ['DLC', -205];
  else if (bundle === 'app')[itemType, offset] = ['bundle', -220];
  else if (bundle === 'appSub')[itemType, offset] = ['package', -230];
  else [itemType, offset] = ['game', -215];

  const itadLabel = addLabel(chart, `View the ${itemType} on IsThereAnyDeal`).align(setAlign(offset));
  addImgUrl(addImg(chart, itadImgUrl, itadLabel, -85), url);
}

function addHltbButton(chart, data) {
  const cha = chart;
  const hltbImgUrl = chrome.runtime.getURL('../images/howlongtobeat_icon.png');
  if (!data.hasOwnProperty('hltbUrl')) {
    let hltbImg;
    if (data.hltbReady) {
      const hltbLabel = addLabel(cha, "Can't find the game on HowLongToBeat").align(setAlign(-190));
      hltbImg = addImg(cha, hltbImgUrl, hltbLabel, -55).css({
        opacity: 0.2,
      });
    } else {
      const hltbLabel = addLabel(cha, "Looking for the game's link...").align(setAlign(-167));
      hltbImg = addImg(cha, hltbImgUrl, hltbLabel, -55).css({
        opacity: 0.5,
      });
      cha.hltbLabel = hltbLabel;
      cha.hltbImg = hltbImg;
    }
    addImgUrl(hltbImg, 'https://howlongtobeat.com/');
  } else {
    const hltbLabel = addLabel(chart, 'View the game on HowLongToBeat').align(setAlign(-183));
    addImgUrl(addImg(chart, hltbImgUrl, hltbLabel, -55), data.hltbUrl);
  }
}

function addButtons(chart, data) {
  addItadButton(chart, data.itadUrl);
  addHltbButton(chart, data);
}

function drawChart(results) {
  const {
    info,
    chartData,
  } = results[0];
  const {
    simp,
    range,
  } = results[1];
  const original = setupData(chartData.data, info.firstPurchaseOption, range);

  const title = (bundle === 'app' || bundle === 'appSub') ? chartData.bundleTitle : info.itemName;
  const data = chartData.data.original ? chartData.originalData : chartData.data.points;

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
    },

    title: {
      text: title + chrome.i18n.getMessage('priceHistory'),
      style: {
        color: '#FFFFFF',
      },
    },

    series: [{
      name: chrome.i18n.getMessage('lineName'),
      data: data,
      color: '#67c1f5',
      step: true,
    }],

    plotOptions: {
      series: {
        findNearestPointBy: 'xy',
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
          return setting.price.currency[0] + Math.round(this.value) + setting.price.currency[1];
        },
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
      formatter() {
        const {
          point,
        } = this.points[0];
        let htmlStr = `<span style="font-size:90%">${Highcharts.dateFormat(setting.lang.dateFormat, this.x)}</span>`;
        htmlStr += `<br/>${chrome.i18n.getMessage('linePrefix')}<b>${setting.price.formatPrice(point.y)}</b><br/>`;
        if (!original) {
          if (chartData.data.discount[point.index] === 0) {
            htmlStr += chrome.i18n.getMessage('noDiscount');
          } else if (chartData.data.discount[point.index] !== 100) {
            htmlStr += `${chrome.i18n.getMessage('discountPrefix')}<b>${chartData.data.discount[point.index]}%</b>`;
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
        min: chartData.data.priceRange[0] - (chartData.data.priceRange[1] - chartData.data.priceRange[0]) * 0.6,
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
    });
  }
  chart.rangeData = {
    fullData: chartData.data.fullData,
    dateFormat: setting.lang.dateFormat,
    formatPrice: setting.price.formatPrice,
    buttonText: text,
  };

  if (bundle === 'app') bundleModal(info.itemName);
  else if (bundle === 'appSub') subModal(info.itemName);
}

function makeChart() {
  const getData = new Promise(dataRequest);
  const getSetting = new Promise(settingRequest);
  Promise.all([getData, getSetting])
    .then(drawChart)
    .catch((e) => {
      if (e === 'timeout') timeoutModal();
      else if (e === 'cantConnect') cantConnectModal();
      else if (e.message !== 'chart error') throw e;
    });
}

function redrawButton(text, align, opacity = 0.2, url = 'https://howlongtobeat.com/') {
  const chart = $('#chart_container').highcharts();
  chart.hltbLabel.destroy();
  const hltbLabel = addLabel(chart, text).align(setAlign(align));
  addEvents(chart.hltbImg, hltbLabel).css({
    opacity,
  });
  addImgUrl(chart.hltbImg, url);
}

function updateButton(msg) {
  if (msg === 'error') redrawButton("Can't connect to HowLongToBeat", -173);
  else if (msg === 'cantFind') redrawButton("Can't find the game on HowLongToBeat", -192);
  else redrawButton('View the game on HowLongToBeat', -183, 1, msg);
}

function updateSimp(request) {
  const container = $('#chart_container');
  const chart = container.highcharts();
  const tmp = userChart.height;
  const appPage = bundle !== 'bundle' && bundle !== 'sub';
  const simp = appPage ? request.appSimp : request.bundleSimp;
  if (simp) {
    const height = appPage ? tmp.appSimp : tmp.bundleSimp;
    container.css('height', height);
    chart.update({
      rangeSelector: {
        enabled: false,
      },
    }, false);
    Object.assign(userChart.simp.chart, {
      height,
    });
    chart.update(userChart.simp);
  } else {
    const height = appPage ? tmp.appFull : tmp.bundleFull;
    container.css('height', height);
    Object.assign(userChart.full.chart, {
      height,
    });
    chart.update(userChart.full);
    chart.update({
      chart: {
        animation: true,
      },
    });
  }
}

function updateRange(msg) {
  const chart = $('#chart_container').highcharts();
  const data = setRange(chart.rangeData.fullData, msg.range);
  if (chart.series[0].options.data[0][0] !== data[0][0][0]) {
    const priceRange = findMinMax(data[0]);
    const points = addIntermediatePoints(data[0]);
    const discount = data[1];
    const original = false;
    chart.update({
      tooltip: {
        formatter() {
          const {
            point,
          } = this.points[0];
          let htmlStr = `<span style="font-size:90%">${Highcharts.dateFormat(chart.rangeData.dateFormat, this.x)}</span>`;
          htmlStr += `<br/>${chrome.i18n.getMessage('linePrefix')}<b>${chart.rangeData.formatPrice(point.y)}</b><br/>`;
          if (!original) {
            if (discount[point.index] === 0) {
              htmlStr += chrome.i18n.getMessage('noDiscount');
            } else if (discount[point.index] !== 100) {
              htmlStr += `${chrome.i18n.getMessage('discountPrefix')}<b>${discount[point.index]}%</b>`;
            } else {
              htmlStr += chrome.i18n.getMessage('freeItem');
            }
          }
          return htmlStr;
        },
      },

      navigator: {
        yAxis: {
          min: priceRange[0] - (priceRange[1] - priceRange[0]) * 0.6,
        },
      },

      rangeSelector: {
        buttons: setRangeButtons(msg.range, chart.rangeData.buttonText),
      },
    }, true, false, false);
    chart.xAxis[0].setExtremes(points[points.length - 1][0] - 7776000000, points[points.length - 1][0]);
    chart.series[0].setData(points, true, false);
  } else {
    chart.update({
      rangeSelector: {
        buttons: setRangeButtons(msg.range, chart.rangeData.buttonText),
      },
    }, true, false, false);
  }
}