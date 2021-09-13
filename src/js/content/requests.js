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
      return reject(response.itadError);
    }

    if (!response.hltbReady) {
      chrome.runtime.onMessage.addListener((msg) => {
        if (msg.hltbError) {
          updateButton(msg.hltbError);
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
  chrome.storage.sync.get([simp, 'animation', 'range'], (value) => {
    resolve(value[simp] ? {
      simp: true,
      options: userChart.simp,
      animation: value.animation,
      range: value.range,
    } : {
      simp: false,
      options: userChart.full,
      animation: value.animation,
      range: value.range,
    });
  });
}
