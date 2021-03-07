'use strict';

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
  const itemType = isMusic ? 'soundtrack' : isDlc ? 'DLC' : 'game';
  const itadLabel = addLabel(chart, `View the ${itemType} on IsThereAnyDeal`).align(setAlign(isMusic ? -230 : isDlc ? -205 : -215));

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
  } = results[1];
  const title = (bundle === 'app') ? chartData.bundleTitle : info.itemName;

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
  };
  const text = setting.lang.buttonText;

  const chartOptions = {
    chart: {
      backgroundColor: 'rgba( 0, 0, 0, 0.2 )',
      events: {
        load() {
          if (setting.lang.siteButton && bundle !== 'bundle') addButtons(this, chartData);
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
      data: chartData.data.points,
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
        if (chartData.data.discount[point.index] === 0) {
          htmlStr += chrome.i18n.getMessage('noDiscount');
        } else if (chartData.data.discount[point.index] !== 100) {
          htmlStr += `${chrome.i18n.getMessage('discountPrefix')}<b>${chartData.data.discount[point.index]}%</b>`;
        } else {
          htmlStr += chrome.i18n.getMessage('freeItem');
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
        min: chartData.data.range[0] - (chartData.data.range[1] - chartData.data.range[0]) * 0.6,
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
      },
      inputDateFormat: setting.lang.inputDateFormat,
      inputEditDateFormat: setting.lang.inputEditDateFormat,
      inputDateParser: setting.lang.inputDateParser,
      inputBoxWidth: setting.lang.inputBoxWidth,
      labelStyle: {
        color: '#acb2b8',
      },
      selected: 1,
      buttons: [{
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

  Object.assign(globalSetting, setting.chart);
  Highcharts.setOptions(globalSetting);

  let height;
  const tmp = userChart.height;
  if (bundle === 'bundle') {
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

  if (bundle === 'app') {
    bundleModal(info.itemName);
  }
}

function makeChart() {
  const getData = new Promise(dataRequest);
  const getSetting = new Promise(settingRequest);
  Promise.all([getData, getSetting])
    .then(drawChart)
    .catch((error) => {
      if (error === 'timeout') timeoutModal();
      else if (error === 'cantConnect') cantConnectModal();
      else throw error;
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

function updateButton(message) {
  if (message === 'error') redrawButton("Can't connect to HowLongToBeat", -173);
  else if (message === 'cantFind') redrawButton("Can't find the game on HowLongToBeat", -190);
  else redrawButton('View the game on HowLongToBeat', -183, 1, message);
}

function updateChart(request) {
  const container = $('#chart_container');
  const chart = container.highcharts();
  const tmp = userChart.height;
  if (request.simp) {
    const height = (bundle === 'bundle') ? tmp.bundleSimp : tmp.appSimp;
    container.css('height', height);
    chart.update({
      chart: {
        height,
      },
      rangeSelector: {
        enabled: false,
      },
    }, false);
    chart.update(userChart.simp);
  } else {
    const height = (bundle === 'bundle') ? tmp.bundleFull : tmp.appFull;
    container.css('height', height);
    chart.update({
      chart: {
        height,
      },
    }, false);
    chart.update(userChart.full);
    chart.update({
      chart: {
        animation: true,
      },
    });
  }
}
