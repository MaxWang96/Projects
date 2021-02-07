'use strict';

function dataRequest(resolve, reject) {
	const noResponse = setTimeout(() => {
		reject('timeout');
	}, 10000);
	chrome.runtime.sendMessage(message, function(response) {
		clearTimeout(noResponse);

		if (response.error && response.error[0] == 0) {
			modal("cant_connect_to_itad_modal",
				"Can't Connect to ITAD",
				"Sorry, Steam Price Chart fail to connect to IsThereAnyDeal.com to get the price history data.",
				"Can't Connect: ITAD");
		}

		const points = response.data.points;

		response.data.discount = calculateDiscount(points);
		response.data.points = addIntermediatePoints(points);

		bgResponse = response;
		resolve();
	});
}

function settingRequest(resolve, reject) {
	chrome.storage.sync.get('simplified', function(value) {
		chartSetting = value.simplified ? userChart.simp : userChart.full;
		resolve();;
	});
}