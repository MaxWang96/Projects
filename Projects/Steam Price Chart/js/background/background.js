'use strict';

chrome.runtime.onMessage.addListener(requests);
chrome.runtime.onInstalled.addListener(init);