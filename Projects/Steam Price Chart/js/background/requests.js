'use strict';

function duplicate(arr) {
  const len = arr.length;
  const tmpArr = [];
  let i = 0;
  let tmpPrice = -1;
  let arrPrice;
  while (i < len - 2) {
    arrPrice = arr[i][1];
    if (arrPrice === null) {
      i += 1;
    } else if (arrPrice === arr[i + 1][1]) {
      if (tmpPrice !== arrPrice) {
        tmpArr.push(arr[i]);
        tmpPrice = arrPrice;
      }
      i += 2;
    } else {
      if (tmpPrice !== arrPrice) {
        tmpArr.push(arr[i]);
        tmpPrice = arrPrice;
      }
      i += 1;
    }
  }
  tmpArr.push(arr[i], arr[i + 1]);
  return tmpArr;
}

function abnormal(dataArr) {
  const arr = dataArr;
  const tmpArr = [arr[0]];
  let toCompare;
  let i = 1;
  let len = arr.length;
  let [min, max] = [arr[0][1], arr[0][1]];
  const lastPoint = arr[len - 1].slice();
  const [fourHours, fourtySixHours] = [14400000, 165600000];
  if (arr[len - 1][1] !== arr[len - 2][1]
    && arr[len - 1][0] - arr[len - 2][0] <= fourHours) {
    arr.splice(len - 2, 1);
    len -= 1;
  }
  arr[len - 1][0] += fourtySixHours;
  arr.push([arr[len - 1][0] + 172800000, arr[len - 1][1]]);

  function pushCur() {
    tmpArr.push(arr[i]);
    toCompare = arr[i][1];
    i += 1;
  }

  function condiPush(n) {
    if (arr[i - 1][1] !== arr[i + n][1]) {
      tmpArr.push(arr[i + n]);
      toCompare = arr[i + n][1];
    }
    i += n + 1;
  }

  while (i < len - 2) {
    if (arr[i + 1][0] - arr[i][0] <= fourHours) {
      if (arr[i][1] > arr[i + 1][1]
        && arr[i - 1][1] === arr[i + 1][1]
        && arr[i + 2][0] - arr[i + 1][0] <= 604800000) { // dead by daylight US
        i += 2;
      } else if (arr[i + 3][0] - arr[i + 2][0] <= fourHours) {
        tmpArr.push(arr[i]);
        toCompare = arr[i][1];
        i += 3;
      } else if (arr[i - 1][1] < arr[i + 1][1]) {
        i += 1;
      } else {
        i += 2;
      }
    } else if (arr[i + 1][0] - arr[i][0] <= fourtySixHours) {
      if (arr[i + 2][0] - arr[i + 1][0] <= fourHours) {
        if (arr[i - 1][1] === arr[i + 1][1]) {
          i += 2;
        } else {
          pushCur();
        }
      } else if (arr[i + 2][0] - arr[i + 1][0] <= fourtySixHours) {
        if (arr[i + 2][1] < arr[i + 1][1]) {
          condiPush(3);
        } else if (arr[i][1] === arr[i + 2][1]) {
          pushCur();
        } else {
          condiPush(1);
        }
      } else if (arr[i][1] > arr[i + 1][1]
        && arr[i][1] === arr[i + 2][1]
        && arr[i][1] < arr[i + 3][1]) { // darkest dungeon CN
        tmpArr.push(arr[i], arr[i + 3]);
        toCompare = arr[i][1];
        i += 4;
      } else {
        condiPush(1);
      }
    } else {
      pushCur();
    }
    if (toCompare > max) {
      max = toCompare;
    } else if (toCompare < min) {
      min = toCompare;
    }
  }
  tmpArr.push(arr[i]);
  if (i === len - 2) tmpArr.push(lastPoint);
  return {
    points: tmpArr,
    range: [min, max],
  };
}

function requests(message, sender, sendResponse) {
  let {
    name,
  } = message;
  let [itadSent, hltbReady, receivedReg, receivedAlt] = [0, 0, 0, 0];
  const resp = {};
  const itadCantConnect = setTimeout(() => {
    resp.itadError = true;
    sendResponse(resp);
  }, 3000);
  const hltbCantConnect = setTimeout(() => {
    chrome.tabs.sendMessage(sender.tab.id, {
      hltbError: true,
    });
  }, 5000);

  function sendItadRequest(itemName) {
    fetch(`https://isthereanydeal.com/game/${itemName}/history/${message.storeRegion}/?shop%5B%5D=steam&generate=Select+Stores`)
      .then((response) => response.text())
      .then((text) => {
        clearTimeout(itadCantConnect);
        let dataArr = JSON.parse(text.match(/"Steam","data":(\[\[.+?\]\])/)[1]);
        dataArr = duplicate(dataArr);
        resp.data = abnormal(dataArr);
        resp.itadUrl = `https://isthereanydeal.com/game/${itemName}/info`;
        if (message.bundle) {
          resp.bundleTitle = text.match(/<h1 id='gameTitle'>.+?>(.+?)</)[1];
        }
        resp.hltbReady = hltbReady;
        itadSent = 1;
        sendResponse(resp);
      });
  }

  function itad() {
    if (!message.bundle) {
      fetch(`https://api.isthereanydeal.com/v02/game/plain/?key=2a0a6baa1713e7be64e451ab1b863b988ce63455&shop=steam&game_id=app%2F${message.id}`)
        .then((response) => response.text())
        .then((text) => {
          const gameName = text.match(/"plain":"(.+?)"/)[1];
          sendItadRequest(gameName);
        });
    } else {
      fetch(`https://isthereanydeal.com/steam/bundle/${message.id}/`, {
          method: 'HEAD',
        })
        .then((response) => {
          const bundleName = response.url.split('/')[4];
          sendItadRequest(bundleName);
        });
    }
  }

  function tryMessage() {
    if (itadSent && hltbReady) {
      clearTimeout(hltbCantConnect);
      const hltbMessage = resp.hltbUrl ? {
        hltbUrl: resp.hltbUrl,
      } : {
        hltbCantFind: true,
      };
      chrome.tabs.sendMessage(sender.tab.id, hltbMessage);
    }
  }

  function hltbRequest(callback) {
    const nameSend = name.replace('’', "'")
      .replace(/[^\w\s:',-]/gi, '');
    fetch('https://howlongtobeat.com/search_results.php', {
        method: 'POST',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
        },
        body: `queryString=${nameSend}&t=games&sorthead=popular&sortd='Normal Order'`,
      })
      .then((response) => response.text())
      .then((text) => callback(text));
  }

  function altRequest(idx) {
    name = name.slice(0, idx);
    hltbRequest((data) => {
      receivedAlt = 1;
      const getId = data.match(/href="(.+?)"/);
      if (getId !== null) {
        resp.hltbUrl = `http://howlongtobeat.com/${getId[1]}`;
      }
      if (receivedReg) {
        hltbReady = 1;
      }
      tryMessage();
    });
  }

  function sendHltbRequest() {
    hltbRequest((data) => {
      receivedReg = 1;
      const getId = data.match(/href="(.+?)"/);
      if (getId !== null) {
        resp.hltbUrl = `http://howlongtobeat.com/${getId[1]}`;
        hltbReady = 1;
      }
      if (receivedAlt) {
        hltbReady = 1;
      }
      tryMessage();
    });

    if (name.includes('Edition')) {
      const colonIdx = name.lastIndexOf(':');
      const dashIdx = name.lastIndexOf('-');
      if (colonIdx < dashIdx) {
        altRequest(dashIdx);
      } else if (colonIdx > dashIdx) {
        altRequest(colonIdx);
      } else {
        const spaceIdx = name.lastIndexOf(' ', name.lastIndexOf(' ') - 1);
        altRequest(spaceIdx);
      }
    } else {
      receivedAlt = 1;
    }
  }

  function hltb() {
    if (!message.lang.startsWith('zh')) {
      if (message.lang.startsWith('en') || message.bundle || message.notGame) {
        sendHltbRequest();
      } else {
        fetch(`https://steamspy.com/api.php?request=appdetails&appid=${message.id}`)
          .then((response) => response.text())
          .then((text) => {
            const findName = text.match(/"name":"(.+?)"/);
            if (findName === null) {
              hltbReady = 1;
              if (itadSent) {
                clearTimeout(hltbCantConnect);
                chrome.tabs.sendMessage(sender.tab.id, {
                  hltbError: true,
                });
              }
            } else {
              name = findName[1];
              sendHltbRequest();
            }
          });
      }
    } else hltbReady = 1;
  }

  itad();
  hltb();
  return true;
}
