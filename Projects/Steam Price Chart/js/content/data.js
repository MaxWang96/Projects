'use strict';

function calculateDiscount(points, firstPurchaseOption) {
	const itemName = document.getElementsByClassName('apphub_AppName')[0].textContent;
	if ((points[0][1] == 0 &&
		points[1][0] - points[0][0] > 31536000000) || 
		points[points.length - 1][1] != points[points.length - 2][1]) {
		dataModal(itemName);
	}

	const priceArr = [],
		isDiscount = setup(points, priceArr, firstPurchaseOption),
		base = calculateBase(points, priceArr);

	restorePriceArr(isDiscount, priceArr);

	return makeDiscountArr(points.length, priceArr, base)
}

function setup(points, priceArr, firstPurchaseOption) {
	for (let i = 0; i < points.length; i++) {
		priceArr.push(points[i][1]);
	}

	let price,
		isDiscount = true;
	const discount = firstPurchaseOption.getElementsByClassName('discount_block');
	if (itemInfo.isBundle) {
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

	const itemName = document.getElementsByClassName('apphub_AppName')[0].textContent;
	if (price != points[points.length - 1][1]) {
		dataModal(itemName);
	}

	return isDiscount;
}

function calculateBase(points, priceArr) {
	const base = [],
		priceIncrease = [];
	makeBase(priceArr, base, priceIncrease);
	checkAbnormalHigh(points, priceArr, base, priceIncrease);
	return base;
}

function makeBase(priceArr, base, priceIncrease) {
	let k;
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
}

function checkAbnormalHigh(points, priceArr, base, priceIncrease) {
	for (let i = priceIncrease.length - 1; i >= 0; i--) {
		const tmp = priceIncrease[i];
		if (tmp < priceArr.length - 1 && base[tmp] != base[tmp + 1]) {
			base[tmp - 1] = base[tmp + 1];
			base.splice(priceIncrease[i], 2);
			priceArr.splice(priceIncrease[i], 2);
			points.splice(priceIncrease[i], 2);
		}
	}
}

function restorePriceArr(isDiscount, priceArr) {
	const len = priceArr.length;
	if (isDiscount) {
		priceArr[priceArr.length - 1] = priceArr[priceArr.length - 2];
	} else {
		priceArr[priceArr.length - 2] = priceArr[priceArr.length - 3];
	}
}

function makeDiscountArr(len, priceArr, base) {
	const discountArr = [];
	let j = 0;
	for (; j < len - 2; j++) {
		const curDiscount = Math.round((1 - priceArr[j] / base[j]) * 100);
		discountArr.push(curDiscount, curDiscount);
	}
	discountArr.push(Math.round((1 - priceArr[j] / base[j]) * 100), Math.round((1 - priceArr[j + 1] / base[j + 1]) * 100));
	return discountArr;
}

function addIntermediatePoints(points) {
	const plotArr = [];
	let i = 0;
	for (; i < points.length - 2; i++) {
		plotArr.push(points[i]);
		plotArr.push([points[i + 1][0] - 3600000, points[i][1]]);
	}
	plotArr.push(points[i], points[i + 1]);
	return plotArr;
}