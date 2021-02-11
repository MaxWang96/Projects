'use strict';

makeChart();

chrome.runtime.onMessage.addListener(updateChart);