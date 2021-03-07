'use strict';

function findRegion() {
  let region = document.cookie.match(/steamCountry=(..)/)[1];
  if (eu1.includes(region)) region = 'EU1';
  if (!supportedRegion.includes(region)) regionModal(region);
  return region;
}

function findInfo() {
  const info = {
    region: findRegion(),
    sysLang: window.navigator.languages[0],
    id: window.location.href.split('/')[4],
    itemName: document.getElementsByClassName('pageheader')[0].textContent,
    firstPurchaseOption: document.getElementsByClassName('bundle')[0],
  };
  bundle = 'bundle';
  info.gameName = info.itemName;
  return info;
}

function insertChart(height) {
  document.getElementById('game_area_description')
    .insertAdjacentHTML('beforeBegin', `
    <div class="steam_price_chart">
        <div id="chart_container" style="height: ${height}; min-width: 310px"></div>
    </div>
    `);
}
