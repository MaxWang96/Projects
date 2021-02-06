'use strict';

function dataRequest() {
	const getData = new Promise((resolve, reject) => {
		// console.time('bg');
		const noResponse = setTimeout(() => {
			reject('timeout');
		}, 10000);
		chrome.runtime.sendMessage(message, function(response) {
			// console.timeEnd('bg');
			clearTimeout(noResponse);

			if (response.error && response.error[0] == 0) {
				modal("cant_connect_to_itad_modal",
					"Can't Connect to ITAD",
					"Sorry, Steam Price Chart fail to connect to IsThereAnyDeal.com to get the price history data.",
					"Can't Connect: ITAD");
			}

			const points = response.data.points;
			if (points[0][1] == 0 || points[points.length - 1][1] != points[points.length - 2][1]) {
				dataError(itemName);
			}

			let price;
			let priceArr = [];
			let isDiscount = true;
			for (let i = 0; i < points.length; i++) {
				priceArr.push(points[i][1]);
			}
			// let discountData = response.data.discount;
			const discount = firstPurchaseOption.getElementsByClassName('discount_block');
			if (isBundle) {
				price = discount[0].getElementsByClassName('discount_final_price')[0].textContent.match(/[\d.,]+/)[0].replace(',', '.');
				if (discount.length != 0) {
					const searchRange = priceArr.length < 5 ? priceArr.length - 1 : 4;
					let max = price,
						k;
					for (k = 0; k < searchRange; k++) {
						if (priceArr[priceArr.length - k - 2] > max) {
							max = priceArr[priceArr.length - k - 2];
						}
					}
					if (max != price) {
						priceArr[priceArr.length - 1] = max;
					} else {
						priceArr[priceArr.length - 1] = price / 2;
						priceArr.push(price);
						isDiscount = false;
					}
				} else {
					priceArr[priceArr.length - 1] = price / 2;
					priceArr.push(price);
					isDiscount = false;
				}
			} else {
				if (discount.length != 0) {
					price = discount[0].getElementsByClassName('discount_final_price')[0].textContent.match(/[\d.,]+/)[0].replace(',', '.');
					priceArr[priceArr.length - 1] = discount[0].getElementsByClassName('discount_original_price')[0].textContent.match(/[\d.,]+/)[0].replace(',', '.');
				} else {
					price = firstPurchaseOption.getElementsByClassName('game_purchase_price')[0].textContent.match(/[\d.,]+/)[0].replace(',', '.');
					priceArr[priceArr.length - 1] = price / 2;
					priceArr.push(price);
					isDiscount = false;
				}
			}

			if (price != response.data.points[response.data.points.length - 1][1]) {
				dataError(itemName);
			}

			let k,
				base = [],
				priceIncrease = [];

			if (priceArr[0] >= priceArr[1]) {
				base.push(priceArr[0]);
				k = 0;
			} else {
				base.push(priceArr[1], priceArr[1]);
				priceIncrease.push(1);
				k = 1;
			}
			while (k < priceArr.length - 2) {
				let curBase = priceArr[k];
				if (curBase < priceArr[k + 1]) {
					base.push(priceArr[k + 1]);
					priceIncrease.push(k + 1);
					k++;
				} else {
					if (curBase == priceArr[k + 2]) {
						base.push(curBase, curBase);
						k += 2;
					} else if (curBase > priceArr[k + 2]) {
						if (curBase == priceArr[k + 3]) {
							base.push(curBase, curBase, curBase);
							k += 3;
						} else if (curBase == priceArr[k + 4]) {
							base.push(curBase, curBase, curBase, curBase);
							k += 4;
						} else if (priceArr[k + 1] == priceArr[k + 3]) {
							base.push(priceArr[k + 1], priceArr[k + 1], priceArr[k + 1]);
							k += 3;
						} else if (priceArr[k + 1] < priceArr[k + 2]) { // E
							base.push(curBase, priceArr[k + 2]);
							k += 2;
						} else if (priceArr[k + 2] > priceArr[k + 3]) {
							base.push(curBase, priceArr[k + 2], priceArr[k + 2], priceArr[k + 2]);
							k += 4;
						} else if (priceArr[k + 2] < priceArr[k + 3]) {
							base.push(priceArr[k + 1]);
							k++;
						} else {
							modal('unknown_discount_type_modal',
								'Unknown Discount Error',
								'Sorry, something went wrong when calculating the discount. Please consider reporting the issue to help improve the extension.',
								'Unknown Discount Type');
						}
					} else {
						base.push(curBase, priceArr[k + 2]);
						k += 2;
					}
				}
			}

			// check abnormally high price
			for (let i = priceIncrease.length - 1; i >= 0; i--) {
				const tmp = priceIncrease[i];
				if (tmp < priceArr.length - 1 && base[tmp] != base[tmp + 1]) {
					base[tmp - 1] = base[tmp + 1];
					base.splice(priceIncrease[i], 2);
					priceArr.splice(priceIncrease[i], 2);
					points.splice(priceIncrease[i], 2);
				}
			}

			if (isDiscount) {
				priceArr[priceArr.length - 1] = priceArr[priceArr.length - 2];
			} else {
				priceArr[priceArr.length - 2] = priceArr[priceArr.length - 3];
			}

			let discountArr = [];
			let j = 0;
			for (; j < points.length - 2; j++) {
				const curDiscount = Math.round((1 - priceArr[j] / base[j]) * 100);
				discountArr.push(curDiscount, curDiscount);
			}
			discountArr.push(Math.round((1 - priceArr[j] / base[j]) * 100), Math.round((1 - priceArr[j + 1] / base[j + 1]) * 100));

			response.data.discount = discountArr;

			let plotArr = [];
			let i = 0;
			for (; i < points.length - 2; i++) {
				plotArr.push(points[i]);
				plotArr.push([points[i + 1][0] - 3600000, points[i][1]]);
			}
			plotArr.push(points[i], points[i + 1]);
			response.data.points = plotArr;

			bgResponse = response;
			resolve();
			// console.timeEnd('t');
			// console.timeEnd('chartTime');
		});
	});
	const getSetting = new Promise(function(resolve, reject) {
		chrome.storage.sync.get('simplified', function(value) {
			chartSetting = value.simplified ? userChart.simp : userChart.full;
			resolve();
		});
	});

	Promise.all([getData, getSetting])
		.then(drawChart)
		.catch(error => {
			if (error == 'timeout') {
				modal('no_response_from_background_modal',
					'Background Error',
					'Sorry, something went wrong when fetching the price data.',
					'Background Error');
			}
		});
}