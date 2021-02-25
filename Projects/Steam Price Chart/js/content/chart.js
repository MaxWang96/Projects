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
    if (data.hltbReady) {
      const hltbLabel = addLabel(cha, "Can't find the game on HowLongToBeat").align(setAlign(-190));
      addImg(cha, hltbImgUrl, hltbLabel, -55).css({
        opacity: 0.2,
      });
    } else {
      const hltbLabel = addLabel(cha, "Looking for the game's link...").align(setAlign(-167));
      const hltbImg = addImg(cha, hltbImgUrl, hltbLabel, -55).css({
        opacity: 0.5,
      });
      cha.hltbLabel = hltbLabel;
      cha.hltbImg = hltbImg;
    }
  } else {
    const hltbLabel = addLabel(chart, 'View the game on HowLongToBeat').align(setAlign(-183));
    addImgUrl(addImg(chart, hltbImgUrl, hltbLabel, -55), data.hltbUrl);
  }
}

function addButtons(chart, data) {
  addItadButton(chart, data.itadUrl);
  addHltbButton(chart, data);
}

function insertChart(height) {
  const elements = document.getElementsByClassName('page_content');
  const len = elements.length;
  let loc;
  for (let i = 0; i < len; i += 1) {
    if (elements[i].className === 'page_content') {
      loc = elements[i];
      break;
    }
  }
  loc.insertAdjacentHTML('afterbegin', `
    <div class="steam_price_chart">
        <div id="chart_container" style="height: ${height}; min-width: 310px"></div>
    </div>
    `);
}

function drawChart(results) {
  const {
    info,
    chartData,
  } = results[0];
  const title = itemInfo.isBundle ? chartData.bundleTitle : info.itemName;

  const {
    sysLang,
  } = info;
  let lang;
  if (sysLang === 'zh-CN' || sysLang === 'zh-TW') {
    lang = locale.CN;
  } else if (sysLang === 'en' || sysLang === 'en-US') {
    lang = locale.US;
  } else {
    lang = locale.EU1;
  }
  const setting = {
    chart: results[1],
    price: localePrice[info.region],
    lang,
  };
  const globalSetting = {
    lang: setting.lang.lang,
  };

  const chartOptions = {
    chart: {
      backgroundColor: 'rgba( 0, 0, 0, 0.2 )',
      events: {
        load() {
          if (setting.lang.siteButton) addButtons(this, chartData);
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
      tooltip: {
        valueDecimals: setting.price.valueDecimals,
        valuePrefix: setting.price.currency[0],
        valueSuffix: setting.price.currency[1],
      },
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
        let price = setting.price.currency[0] + point.y.toFixed(2) + setting.price.currency[1];
        price = price.replace('.', setting.price.valueSymbol);
        htmlStr += `<br/>${chrome.i18n.getMessage('linePrefix')}<b>${price}</b><br/>`;
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
        text: setting.lang.buttonText[0],
      }, {
        type: 'month',
        count: 3,
        text: setting.lang.buttonText[1],
      }, {
        type: 'month',
        count: 6,
        text: setting.lang.buttonText[2],
      }, {
        type: 'year',
        count: 1,
        text: setting.lang.buttonText[3],
      }, {
        type: 'year',
        count: 3,
        text: setting.lang.buttonText[4],
      }, {
        type: 'all',
        text: setting.lang.buttonText[5],
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

  insertChart(setting.chart.chart.height);

  const chart = Highcharts.stockChart('chart_container', chartOptions);
  if (setting.chart.chart.height === '350px') {
    chart.update({
      rangeSelector: {
        enabled: false,
      },
    });
  }

  if (itemInfo.isBundle) {
    bundleModal(info.itemName);
  }
}

function makeChart() {
  const getData = new Promise(dataRequest);
  const getSetting = new Promise(settingRequest);
  Promise.all([getData, getSetting])
    .then(drawChart)
    .catch((error) => {
      if (error === 'timeout') {
        timeoutModal();
      }
    });
}

function redrawButton(text, align, opacity = 0.2) {
  const chart = $('#chart_container').highcharts();
  chart.hltbLabel.destroy();
  const hltbLabel = addLabel(chart, text).align(setAlign(align));
  addEvents(chart.hltbImg, hltbLabel).css({
    opacity,
  });
}

function updateButton(message) {
  if (message === 'error') {
    redrawButton("Can't connect to HowLongToBeat", -173);
  } else if (message === 'cantFind') {
    redrawButton("Can't find the game on HowLongToBeat", -190);
  } else {
    redrawButton('View the game on HowLongToBeat', -183, 1);
    addImgUrl($('#chart_container').highcharts().hltbImg, message);
  }
}

function updateChart(request) {
  const container = $('#chart_container');
  const chart = container.highcharts();
  if (request.simplified) {
    container.css('height', '350px');
    chart.update({
      rangeSelector: {
        enabled: false,
      },
    }, false);
    chart.update(userChart.simp);
  } else {
    container.css('height', '400px');
    chart.update(userChart.full);
    chart.update({
      chart: {
        animation: true,
      },
    });
  }
}
