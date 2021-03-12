'use strict';

function findRegion() {
  let region = document.getElementsByClassName('game_page_background')[0]
    .getElementsByTagName('script')[0]
    .innerText
    .match(/[A-Z]{2}/)[0];
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
  document.getElementById('game_area_purchase')
    .insertAdjacentHTML('afterEnd', `
    <div class="steam_price_chart">
        <div id="chart_container" style="height: ${height}; min-width: 310px"></div>
    </div>
    `);
}
