'use strict';

function dataRequest(resolve, reject) {
	const noResponse = setTimeout(() => {
		reject('timeout');
	}, 3000);

	const info = findInfo(),
		message = {
			id: info.id,
			storeRegion: info.region.toLowerCase(),
			lang: info.sysLang,
			name: info.gameName,
			bundle: itemInfo.isBundle
		};

	chrome.runtime.sendMessage(message, response => {
		clearTimeout(noResponse);
		if (response.itadError) {
			cantConnectModal();
		}

		if (!response.hltbReady) {
			chrome.runtime.onMessage.addListener(message => {
				if (message.hltbError) {
					updateButton('error');
				} else if (message.hltbUrl) {
					updateButton(message.hltbUrl);
				} else if (message.hltbCantFind) {
					updateButton('cantFind');
				}
			})
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
	chrome.storage.sync.get('simplified', value => {
		resolve(value.simplified ? userChart.simp : userChart.full);
	});
}