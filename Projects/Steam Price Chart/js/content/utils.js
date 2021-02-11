'use strict';

function findInfo() {
	const purchaseArea = document.getElementById('game_area_purchase'),
		info = {
			sysLang: window.navigator.languages[0],
			itemName: document.getElementsByClassName('apphub_AppName')[0].textContent,
		},
		isDlc = purchaseArea.getElementsByClassName('game_area_dlc_bubble').length != 0,
		isMusic = purchaseArea.getElementsByClassName('game_area_soundtrack_bubble').length != 0;

	if (purchaseArea.querySelector("div.game_area_purchase_game")
		.getAttribute('class') == 'game_area_purchase_game ') {
		freeItemModal(info.itemName);
	}

	info.gameName = (!isDlc && !isMusic) ?
		info.itemName : purchaseArea.getElementsByClassName('game_area_bubble')[0].querySelector('a').textContent;
	info.region = findRegion();
	Object.assign(info, findIdAndOption(purchaseArea, isMusic));

	return info;
}

function findRegion() {
	let region = JSON.parse(document.getElementById('application_config').getAttribute('data-config')).COUNTRY;
	if (eu1.includes(region)) region = 'EU1';
	if (!supportedRegion.includes(region)) regionModal(region);
	return region;
}

function findIdAndOption(purchaseArea, isMusic) {
	let i = 0,
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
			itemInfo.isBundle = true;
			id = firstPurchaseOption.getAttribute('data-ds-bundleid');
			break;
		}
		i++;
	}
	return {
		id: id,
		firstPurchaseOption: firstPurchaseOption
	}
}