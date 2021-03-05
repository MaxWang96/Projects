'use strict';

function dataRequest(resolve, reject) {
  const noResponse = setTimeout(() => {
    reject('timeout');
  }, 3500);

  const info = findInfo();
  const message = {
    id: info.id,
    storeRegion: info.region.toLowerCase(),
    lang: info.sysLang,
    name: info.gameName,
    bundle: itemInfo.isBundle,
    notGame: info.notGame,
  };

  chrome.runtime.sendMessage(message, (response) => {
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

    const {
      points,
    } = response.data;
    try {
      response.data.discount = calculateDiscount(points, info.firstPurchaseOption);
    } catch (e) {
      return reject(e);
    }
    response.data.points = addIntermediatePoints(points);
    return resolve({
      chartData: response,
      info,
    });
  });
}

function settingRequest(resolve, reject) {
  chrome.storage.sync.get('simplified', (value) => {
    resolve(value.simplified ? userChart.simp : userChart.full);
  });
}
