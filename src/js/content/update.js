'use strict';

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

function updateSimp(msg) {
  const container = $('#chart_container');
  const chart = container.highcharts();
  const tmp = userChart.height;
  const appPage = bundle !== 'bundle' && bundle !== 'sub';
  const simp = appPage ? msg.appSimp.newValue : msg.bundleSimp.newValue;
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
    chart.update(userChart.simp, true, false, false);
  } else {
    const height = appPage ? tmp.appFull : tmp.bundleFull;
    container.css('height', height);
    Object.assign(userChart.full.chart, {
      height,
    });
    chart.update(userChart.full, true, false, false);
  }
}

function updateAnimation(msg) {
  $('#chart_container').highcharts().update({
    chart: {
      animation: msg.animation.newValue,
    },
  });
}

function updateRange(msg) {
  const chart = $('#chart_container').highcharts();
  const data = setRange(chart.rangeData.fullData, msg.range.newValue);
  if (chart.series[0].options.data[0][0] !== data[0][0][0]) {
    const showOriginal = msg.range.newValue === 'all' && chart.rangeData.originalData;
    const results = minMaxAndAdd(data[0]);
    const discount = data[1];
    const priceRange = results[0];
    const points = showOriginal ? chart.rangeData.originalData : results[1];
    if (showOriginal) showOriginalModal();
    chart.update({
      tooltip: {
        formatter() {
          const {
            point,
          } = this.points[0];
          const date = Highcharts.dateFormat(chart.rangeData.dateFormat, this.x);
          const price = chart.rangeData.formatPrice(point.y);
          const curDiscount = discount[point.index];
          let htmlStr = `<span style="font-size:90%">${date}</span>`;
          htmlStr += `<br/>${chrome.i18n.getMessage('linePrefix')}<b>${price}</b><br/>`;
          if (!showOriginal) {
            if (discount[point.index] === 0) {
              htmlStr += chrome.i18n.getMessage('noDiscount');
            } else if (discount[point.index] !== 100) {
              htmlStr += `${chrome.i18n.getMessage('discountPrefix')}<b>${curDiscount}%</b>`;
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
        buttons: setRangeButtons(msg.range.newValue, chart.rangeData.buttonText),
      },
    }, true, false, false);
    chart.xAxis[0].setExtremes(points[points.length - 1][0] - 7776e6,
      points[points.length - 1][0]);
    chart.series[0].setData(points, true, false);
  } else {
    chart.update({
      rangeSelector: {
        buttons: setRangeButtons(msg.range.newValue, chart.rangeData.buttonText),
      },
    }, true, false, false);
  }
}
