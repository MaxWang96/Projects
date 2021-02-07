'use strict';

// console.time('t');
// check whether the store region is supported
let region = JSON.parse(document.getElementById('application_config').getAttribute('data-config')).COUNTRY;
const eu1 = ['AL', 'AD', 'AT', 'BE', 'FI', 'FR', 'DK', 'DE', 'IE', 'LI', 'LU', 'MK', 'NL', 'SE', 'CH'];
if (eu1.includes(region)) region = 'EU1';
if (!supportedRegion.includes(region)) {
	modal('not_supported_modal',
		chrome.i18n.getMessage('regionErrorHeader'),
		chrome.i18n.getMessage('regionErrorText', region),
		'Region not supported');
}

const purchaseArea = document.getElementById('game_area_purchase');
const isMusic = purchaseArea.getElementsByClassName('game_area_soundtrack_bubble').length != 0;
const isDlc = purchaseArea.getElementsByClassName('game_area_dlc_bubble').length != 0;
const itemName = document.getElementsByClassName('apphub_AppName')[0].textContent;
const gameName = (!isDlc && !isMusic) ?
	itemName :
	purchaseArea.getElementsByClassName('game_area_bubble')[0].querySelector('a').textContent;
//check for free game
if (purchaseArea.querySelector("div.game_area_purchase_game")
	.getAttribute('class') == 'game_area_purchase_game ') {
	modal('free_item_modal',
		chrome.i18n.getMessage('freeItemHeader'),
		chrome.i18n.getMessage('freeItemText', itemName),
		'This item is free, stopped drawing the chart');
}

//find the price to search for
let i = 0,
	isBundle = false,
	id,
	firstPurchaseOption;
const wrappers = purchaseArea.getElementsByClassName('game_area_purchase_game_wrapper');
while (true) {
	if (wrappers[i].classList.length == 1) {
		if (isMusic || wrappers[i].getElementsByClassName('music').length == 0) {
			const p = wrappers[i].querySelector('p');
			if (p == undefined || p.querySelector('a') == undefined) {
				firstPurchaseOption = wrappers[i];
				id = location.href.split('/')[4];
				break;
			}
		}
	} else if (wrappers[i].classList.length == 3) {
		firstPurchaseOption = wrappers[i];
		isBundle = true;
		id = firstPurchaseOption.getAttribute('data-ds-bundleid');
		break;
	}
	i++;
}

// console.time('t');
const sysLang = window.navigator.languages[0];
// console.log(sysLang);
const langSetting = (sysLang == 'zh-CN' || sysLang == 'zh-TW') ? locale['CN'] : (sysLang == 'en' || sysLang == 'en-US') ? locale['US'] : locale['EU1'];
const priceSetting = localePrice[region];

let chartSetting;

const message = {
	id: id,
	storeRegion: region.toLowerCase(),
	lang: sysLang,
	name: gameName,
	bundle: isBundle
}
let bgResponse;
let chart;

makeChart();

chrome.runtime.onMessage.addListener(updateChart);