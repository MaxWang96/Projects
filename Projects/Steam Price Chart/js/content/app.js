'use strict';

function findRegion() {
  let region = JSON.parse(document.getElementById('application_config').getAttribute('data-config')).COUNTRY;
  if (eu1.includes(region)) region = 'EU1';
  if (!supportedRegion.includes(region)) regionModal(region);
  return region;
}

function findIdAndOption(purchaseArea, isDlc, isMusic) {
  let id = window.location.href.split('/')[4];
  let firstPurchaseOption;
  let i = 0;
  const wrappers = purchaseArea.getElementsByClassName('game_area_purchase_game_wrapper');
  if (isDlc || isMusic) {
    [firstPurchaseOption] = wrappers;
    if (firstPurchaseOption.classList.length === 3) bundle = 'app';
  } else {
    for (;;) {
      const wrap = wrappers[i];
      if (wrap.classList.length === 1) {
        const option = wrap.getElementsByClassName('game_area_purchase_game')[0];
        if (!option.getElementsByTagName('h1')[0].textContent.includes('Soundtrack')) {
          const p = option.querySelector('p');
          if (p === null
            || p.querySelector('a') === null // portal 2
            || id === p.querySelector('a').href.split('/')[4]) {
            firstPurchaseOption = wrap;
            break;
          }
        }
      } else if (wrap.classList.length === 3) {
        if (wrap.getElementsByClassName('btn_disabled').length) {
          bundleOwnedModal();
        } else {
          firstPurchaseOption = wrap;
          bundle = 'app';
          id = firstPurchaseOption.getAttribute('data-ds-bundleid');
          break;
        }
      }
      i += 1;
    }
  }
  return {
    id,
    firstPurchaseOption,
  };
}

function findInfo() {
  const purchaseArea = document.getElementById('game_area_purchase');
  const isDlc = purchaseArea.getElementsByClassName('game_area_dlc_bubble').length !== 0;
  const isMusic = purchaseArea.getElementsByClassName('game_area_soundtrack_bubble').length !== 0;
  const info = {
    sysLang: window.navigator.languages[0],
    itemName: document.getElementsByClassName('apphub_AppName')[0].textContent,
    region: findRegion(),
    notGame: isDlc || isMusic,
  };

  if (purchaseArea.querySelector('div.game_area_purchase_game')
    .getAttribute('class') === 'game_area_purchase_game ') {
    freeItemModal(info.itemName);
  }

  info.gameName = (!isDlc && !isMusic)
    ? info.itemName
    : purchaseArea.getElementsByClassName('game_area_bubble')[0].querySelector('a').textContent;
  Object.assign(info, findIdAndOption(purchaseArea, isDlc, isMusic));
  return info;
}

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
  loc.insertAdjacentHTML('afterbegin', `
    <div class="steam_price_chart">
        <div id="chart_container" style="height: ${height}; min-width: 310px"></div>
    </div>
    `);
}
