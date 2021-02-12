'use strict';

try {
	makeChart();
	chrome.runtime.onMessage.addListener(updateChart);
} catch {}