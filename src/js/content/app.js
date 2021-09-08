'use strict';

function findRegion() {
  let region = JSON.parse(document.getElementById('application_config').getAttribute('data-config'))
    .COUNTRY;
  if (eu1.includes(region)) region = 'EU1';
  if (!supportedRegion.includes(region)) regionModal(region);
  return region;
}

// find the package with the lowest price when the item can only be purchased in a package
function findBestPackage(wrappers, startIdx) {
  const priceArr = [];
  for (let i = startIdx; i < wrappers.length; i += 1) {
    const price = wrappers[i].getElementsByClassName('game_purchase_action')[0]
      .querySelector('[data-price-final]').getAttribute('data-price-final');
    priceArr.push(parseInt(price, 10));
  }
  let [min, idx] = [priceArr[0], 0];
  for (let j = 1; j < priceArr.length; j += 1) {
    if (min > priceArr[j]) {
      min = priceArr[j];
      idx = j;
    }
  }
  return startIdx + idx;
}

function findIdAndOption(purchaseArea, isDlc, isMusic, name) {
  let id = window.location.href.split('/')[4];
  let targetOption;
  let i = 0;
  const wrappers = purchaseArea.getElementsByClassName('game_area_purchase_game_wrapper');
  if (isDlc || isMusic) {
    [targetOption] = wrappers;
    if (targetOption.classList.length === 3) {
      bundle = 'app';
      id = targetOption.getAttribute('data-ds-bundleid');
    } else if (targetOption.getElementsByClassName('package_contents').length === 1) {
      bundle = 'appSub';
      [id] = targetOption.getElementsByClassName('game_area_purchase_game')[0].getAttribute('id').match(
        /\d+/);
    }
  } else {
    for (;;) {
      const wrap = wrappers[i];
      if (wrap.classList.length === 1) {
        const option = wrap.getElementsByClassName('game_area_purchase_game')[0];
        const h1 = option.getElementsByTagName('h1')[0].textContent;
        if (!h1.includes('Soundtrack')) {
          const p = option.getElementsByTagName('p');
          if (p.length === 0
            || p[0].getElementsByTagName('a').length === 0
            || h1.startsWith(name)
            || h1.endsWith(name)) {
            if (option.getElementsByClassName('package_contents').length === 1) {
              const packageIdx = findBestPackage(wrappers, i);
              if (packageIdx === i) {
                bundle = 'appSub';
                [id] = option.getAttribute('id').match(/\d+/);
                targetOption = wrap;
                break;
              } else {
                i = packageIdx - 1;
              }
            } else {
              targetOption = wrap;
              break;
            }
          }
        }
      } else if (wrap.classList.length === 3) {
        if (wrap.getElementsByClassName('btn_disabled').length) {
          bundleOwnedModal();
        } else {
          const packageIdx = findBestPackage(wrappers, i);
          if (packageIdx === i) {
            targetOption = wrap;
            bundle = 'app';
            id = targetOption.getAttribute('data-ds-bundleid');
            break;
          } else {
            i = packageIdx - 1;
          }
        }
      }
      i += 1;
    }
  }
  return {
    id,
    targetOption,
  };
}

function getName() {
  return document.getElementsByClassName('apphub_AppName')[0].textContent;
}

//find info about the page: store region, item name & type, game name, browser language, purchase option & its id
function findInfo() {
  const purchaseArea = document.getElementById('game_area_purchase');
  const isDlc = purchaseArea.getElementsByClassName('game_area_dlc_bubble').length !== 0;
  const isMusic = purchaseArea.getElementsByClassName('game_area_soundtrack_bubble').length !== 0;
  const info = {
    region: findRegion(),
    itemName: getName(),
    sysLang: window.navigator.languages[0],
    notGame: isDlc || isMusic,
  };

  const firstOption = purchaseArea.querySelector('div.game_area_purchase_game');
  if (firstOption === null) throw new Error('chart error');
  else if (firstOption.getAttribute('class') === 'game_area_purchase_game ') {
    freeItemModal(info.itemName);
  }

  info.gameName = (!isDlc && !isMusic)
    ? info.itemName
    : purchaseArea.getElementsByClassName('game_area_bubble')[0].getElementsByTagName('a')[0].textContent;
  Object.assign(info, findIdAndOption(purchaseArea, isDlc, isMusic, info.itemName));
  return info;
}

// insert the chart into the Steam webpage
function insertChart(height) {
  const elements = document.getElementsByClassName('page_content');
  const len = elements.length;
  let loc;
  for (let i = 0; i < len; i += 1) {
    if (elements[i].className === 'page_content') {
      loc = elements[i];
      break;
    }
  }
  const insertContent =
    `
    <div class="steam_price_chart">
        <div id="chart_container" style="height: ${height}; min-width: 310px"></div>
    </div>
    `;
  loc.insertAdjacentHTML('afterbegin', insertContent);
}
