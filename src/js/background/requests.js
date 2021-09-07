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
  let i = 1;
  let len = arr.length;
  const lastPoint = arr[len - 1].slice();
  const [fiveHours, fourtySixHours, oneMonth] = [18e6, 1656e5, 2592e6];
  let time0;
  let price0;
  let time1;
  let price1;
  let time2;
  let price2;
  let time1n;
  let price1n;
  if (arr[len - 1][1] !== arr[len - 2][1]
    && arr[len - 1][0] - arr[len - 2][0] <= fiveHours) {
    arr.splice(len - 2, 1);
    len -= 1;
  }
  arr[len - 1][0] += fourtySixHours;
  arr.push([arr[len - 1][0] + 1728e5, arr[len - 1][1]]);

  function pushCur() {
    tmpArr.push(arr[i]);
    i += 1;
  }

  function condiPush(n) {
    if (price1n !== arr[i + n][1]) tmpArr.push(arr[i + n]);
    i += n + 1;
  }

  function flip() {
    arr[i + 2][1] = price1;
    tmpArr.push(arr[i], arr[i + 2]);
    if (arr[i + 2][1] === arr[i + 3][1]) i += 4;
    else i += 3;
  }

  function badDiscount() {
    tmpArr.pop();
    tmpArr.push(arr[i + 1]);
    i += 2;
  }

  while (i < len - 2) {
    [time0, price0] = arr[i];
    [time1, price1] = arr[i + 1];
    [time2, price2] = arr[i + 2];
    [time1n, price1n] = arr[i - 1];
    if (time1 - time0 <= fiveHours) {
      if (price0 > price1
        && price1n === price1
        && time2 - time1 <= 6048e5) { // dead by daylight US
        i += 2;
      } else if (arr[i + 3][0] - time2 <= fiveHours) {
        if (time2 - time1 <= fiveHours) {
          i += 4;
        } else {
          tmpArr.push(arr[i]);
          i += 3;
        }
      } else if (arr[i + 3][0] - time2 >= oneMonth
        && i < len - 4
        && price1 > price2
        && (arr[i + 3][1] > price2
          || arr[i + 4][1] > price2)) { // hitman blood money requiem pack US
        flip();
      } else if (time1 - time0 <= 72e5
        && price0 > price1n
        && time0 - time1n >= oneMonth) { // dead by daylight CN; machinarium soundtrack art book CN
        badDiscount();
      } else if (price1n !== price1) { // shadow of the tomb raider US; hunt: showdown US CN
        i += 1;
      } else if (i + 3 === len
        && price1 !== price2) { // Dead Cells: The Bad Seed US
        tmpArr.push(arr[i]);
        i += 2;
      } else {
        i += 2;
      }
    } else if (time1 - time0 <= fourtySixHours) {
      if (time2 - time1 <= fiveHours) {
        if (price1n === price1) {
          i += 2;
        } else if (price1 > price2
          && price0 < price1
          && price1n < price0) { // dmc EU
          i += 2;
        } else {
          pushCur();
        }
      } else if (time2 - time1 <= fourtySixHours) {
        if (price1 > price2) {
          if (price1n === price1) { // undertale US
            i += 2;
          } else if (price0 < price1 && price1n < price0) { // dmc US
            i += 2;
          } else {
            condiPush(3);
          }
        } else if (price0 === price2) {
          pushCur();
        } else {
          condiPush(1);
        }
      } else if (price0 > price1
        && i > 1
        && time0 - time1n >= oneMonth
        && arr[i - 2][1] === price0
        && arr[i - 2][1] > price1n) { // borderlands 2 season pass CN
        badDiscount();
      } else if (arr[i + 3][0] - time2 >= oneMonth
        && i < len - 4
        && price1 > price2
        && (arr[i + 3][1] > price2
          || arr[i + 4][1] > price2)) { // borderlands 2 season pass CN
        flip();
      } else if (price0 > price1
        && price0 === price2
        && price0 < arr[i + 3][1]) { // darkest dungeon CN
        tmpArr.push(arr[i], arr[i + 3]);
        i += 4;
      } else {
        condiPush(1);
      }
    } else {
      pushCur();
    }
  }
  tmpArr.push(arr[i]);
  if (i === len - 2) tmpArr.push(lastPoint);
  return {
    points: tmpArr,
  };
}

function requests(msg, sender, sendResponse) {
  let {
    name,
  } = msg;
  const {
    bundle,
  } = msg;
  const button = !msg.lang.startsWith('zh')
    && bundle !== 'bundle'
    && bundle !== 'sub';
  const region = msg.storeRegion === 'EU1' ? 'FR' : msg.storeRegion;
  const resp = {};
  let [itadSent, hltbReady, regReceived, altReceived, altSuccess] = [0, 0, 0, 0, 0];
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
    fetch(`https://isthereanydeal.com/game/${itemName}/history/?country=${region}&shop%5B%5D=steam&generate=Select+Stores`)
      .then((response) => response.text())
      .then((text) => {
        clearTimeout(itadCantConnect);
        resp.originalData = JSON.parse(text.match(/"Steam","data":(\[\[.+?\]\])/)[1]);
        const dataArr = duplicate(resp.originalData);
        resp.data = abnormal(dataArr);
        if (button) resp.itadUrl = `https://isthereanydeal.com/game/${itemName}/info`;
        if (bundle === 'app' || bundle === 'appSub') {
          resp.bundleTitle = text.match(/<h1 id='gameTitle'>.+?>(.+?)</)[1];
        }
        resp.hltbReady = hltbReady;
        itadSent = 1;
        sendResponse(resp);
      });
  }

  function itad() {
    if (!bundle) {
      fetch(`https://api.isthereanydeal.com/v02/game/plain/?key=2a0a6baa1713e7be64e451ab1b863b988ce63455&shop=steam&game_id=app%2F${msg.id}`)
        .then((response) => response.text())
        .then((text) => {
          const gameName = text.match(/"plain":"(.+?)"/)[1];
          sendItadRequest(gameName);
        });
    } else {
      const type = (bundle === 'sub' || bundle === 'appSub') ? 'sub' : 'bundle';
      fetch(`https://isthereanydeal.com/steam/${type}/${msg.id}/`, {
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
    fetch('https://howlongtobeat.com/search_results.php', {
        method: 'POST',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
        },
        body: `queryString=${name}&t=games&sorthead=popular&sortd='Normal Order'`,
      })
      .then((response) => response.text())
      .then((text) => callback(text));
  }

  function backupMethod() {
    name = name.slice(0, name.lastIndexOf(' '));
    hltbRequest((data) => {
      const getId = data.match(/href="(.+?)"/);
      if (getId !== null) {
        if (data.match(/title="(.+?)"/)[1].length === name.length) {
          resp.hltbUrl = `http://howlongtobeat.com/${getId[1]}`;
        }
        hltbReady = 1;
        tryMessage();
      } else {
        backupMethod();
      }
    });
  }

  function altRequest(idx) {
    name = name.slice(0, idx);
    hltbRequest((data) => {
      altReceived = 1;
      const getId = data.match(/href="(.+?)"/);
      if (getId !== null) {
        altSuccess = 1;
        resp.hltbUrl = `http://howlongtobeat.com/${getId[1]}`;
        if (regReceived) {
          hltbReady = 1;
          tryMessage();
        }
      } else if (regReceived && !hltbReady) {
        backupMethod();
      }
    });
  }

  function sendHltbRequest() {
    hltbRequest((data) => {
      regReceived = 1;
      const getId = data.match(/href="(.+?)"/);
      if (getId !== null) {
        resp.hltbUrl = `http://howlongtobeat.com/${getId[1]}`;
        hltbReady = 1;
        tryMessage();
      } else if (altSuccess) {
        hltbReady = 1;
        tryMessage();
      } else if (altReceived) {
        backupMethod();
      }
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
      altReceived = 1;
    }
  }

  function hltb() {
    if (button) {
      if (msg.lang.startsWith('en') || bundle || msg.notGame) {
        name = name.replace('’', "'").replace(/[^\w\s:',-]/gi, '');
        sendHltbRequest();
      } else {
        fetch(`https://steamspy.com/api.php?request=appdetails&appid=${msg.id}`)
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
              name = findName[1].replace('’', "'").replace(/[^\w\s:',-]/gi, '');
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