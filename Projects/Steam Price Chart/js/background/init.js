'use strict';

function init() {
  chrome.storage.sync.set({
    appSimp: false,
    bundleSimp: true,
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {
          urlMatches: 'store.steampowered.com/(app|bundle)',
        },
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()],
    }]);
  });
}
