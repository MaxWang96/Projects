'use strict';

try {
  makeChart();
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.hasOwnProperty('appSimp') || msg.hasOwnProperty('bundleSimp')) updateSimp(msg);
    else if (msg.hasOwnProperty('range')) updateRange(msg);
  });
} catch (e) {
  if (e.message !== 'chart error') throw e;
}
