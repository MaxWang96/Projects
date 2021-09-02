'use strict';

function dataRequest(resolve, reject) {
  const noResponse = setTimeout(() => {
    reject('timeout');
  }, 3500);

  const info = findInfo();
  const msg = {
    id: info.id,
    storeRegion: info.region,
    lang: info.sysLang,
    name: info.gameName,
    notGame: info.notGame,
    bundle,
  };

  chrome.runtime.sendMessage(msg, (response) => {
    clearTimeout(noResponse);
    if (response.itadError) {
      return reject('cantConnect');
    }

    if (!response.hltbReady) {
      chrome.runtime.onMessage.addListener((msg) => {
        if (msg.hltbError) {
          updateButton('error');
        } else if (msg.hltbUrl) {
          updateButton(msg.hltbUrl);
        } else if (msg.hltbCantFind) {
          updateButton('cantFind');
        }
      });
    }

    return resolve({
      chartData: response,
      info,
    });
  });
}

function settingRequest(resolve, reject) {
  const simp = (bundle === 'bundle' || bundle === 'sub') ? 'bundleSimp' : 'appSimp';
  chrome.storage.sync.get([simp, 'range'], (value) => {
    resolve(value[simp] ? {
      simp: true,
      options: userChart.simp,
      range: value.range
    } : {
      simp: false,
      options: userChart.full,
      range: value.range
    });
  });
}