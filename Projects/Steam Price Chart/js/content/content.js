'use strict';

try {
  makeChart();
  chrome.runtime.onMessage.addListener((message) => {
    if (message.hasOwnProperty('simplified')) updateChart(message);
  });
} catch (e) {
  if (e.message !== 'chart error') throw e;
}
