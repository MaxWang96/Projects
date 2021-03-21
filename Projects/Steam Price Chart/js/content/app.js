'use strict';

function findRegion() {
  let region = JSON.parse(document.getElementById('application_config').getAttribute('data-config')).COUNTRY;
  if (eu1.includes(region)) region = 'EU1';
  if (!supportedRegion.includes(region)) regionModal(region);
  return region;
}

function findIdAndOption(purchaseArea, isDlc, isMusic, name) {
  let id = window.location.href.split('/')[4];
  let firstPurchaseOption;
  let i = 0;
  const wrappers = purchaseArea.getElementsByClassName('game_area_purchase_game_wrapper');
  if (isDlc || isMusic) {
    [firstPurchaseOption] = wrappers;
    if (firstPurchaseOption.classList.length === 3) bundle = 'app';
    else if (firstPurchaseOption.getElementsByClassName('package_contents').length === 1) bundle = 'appSub';
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
              bundle = 'appSub';
              [id] = option.getAttribute('id').match(/\d+/);
            }
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

function getName() {
  return document.getElementsByClassName('apphub_AppName')[0].textContent;
}

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
