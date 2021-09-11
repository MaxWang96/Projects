'use strict';

function init() {
  chrome.storage.sync.set({
    appSimp: false,
    bundleSimp: true,
    animation: false,
    range: '3y',
    diffDiscount: false,
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {
          urlMatches: 'store.steampowered.com/(app|sub|bundle)',
        },
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()],
    }]);
  });
}
