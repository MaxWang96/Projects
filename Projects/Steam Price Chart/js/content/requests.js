'use strict';

function dataRequest(resolve, reject) {
	const noResponse = setTimeout(() => {
		reject('timeout');
	}, 10000);

	const info = findInfo();
	const message = {
		id: info.id,
		storeRegion: info.region.toLowerCase(),
		lang: info.sysLang,
		name: info.gameName,
		bundle: itemInfo.isBundle
	}

	chrome.runtime.sendMessage(message, function(response) {
		clearTimeout(noResponse);

		if (response.error && response.error[0] == 0) {
			cantConnectModal();
		}

		const points = response.data.points;

		response.data.discount = calculateDiscount(points, info.firstPurchaseOption);
		response.data.points = addIntermediatePoints(points);
		resolve({
			chartData: response,
			info: info
		});
	});
}

function settingRequest(resolve, reject) {
	chrome.storage.sync.get('simplified', function(value) {
		resolve(value.simplified ? userChart.simp : userChart.full);
	});
}