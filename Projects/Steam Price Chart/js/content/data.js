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
	const discount = firstPurchaseOption.getElementsByClassName('discount_block'),
		len = priceArr.length;
	HTMLElement.prototype.findPrice = function() {
		return this.textContent
			.match(/[\d.,]+/)[0]
			.replace(',', '.');
	}

	if (itemInfo.isBundle) {
		price = discount[0]
			.getElementsByClassName('discount_final_price')[0]
			.findPrice();
		let max = price;
		const searchRange = len < 5 ? len - 1 : 4;
		for (let j = 0; j < searchRange; j++) {
			if (priceArr[len - j - 2] > max) {
				max = priceArr[len - j - 2];
			}
		}
		if (max == price) {
			priceArr[len - 1] = price / 2;
			priceArr.push(price);
			isDiscount = false;
		} else {
			priceArr[len - 1] = max;
		}
	} else {
		if (discount.length != 0) {
			price = discount[0]
				.getElementsByClassName('discount_final_price')[0]
				.findPrice();
			priceArr[len - 1] = discount[0]
				.getElementsByClassName('discount_original_price')[0]
				.findPrice();
		} else {
			price = firstPurchaseOption
				.getElementsByClassName('game_purchase_price')[0]
				.findPrice();
			priceArr[len - 1] = price / 2;
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
				} else if (priceArr[k + 1] < priceArr[k + 2]) {
					base.push(curBase, priceArr[k + 2]);
					k += 2;
				} else if (priceArr[k + 2] > priceArr[k + 3]) {
					base.push(curBase, priceArr[k + 2], priceArr[k + 2], priceArr[k + 2]);
					k += 4;
				} else if (priceArr[k + 2] < priceArr[k + 3]) {
					base.push(priceArr[k + 1]);
					k++;
				} else { // in case there are cases not covered. Should never be called
					unknownDiscountModal();
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
		priceArr[len - 1] = priceArr[len - 2];
	} else {
		priceArr[len - 2] = priceArr[len - 3];
	}
}

function makeDiscountArr(len, priceArr, base) {
	const discountArr = [];
	let i = 0;
	for (; i < len - 2; i++) {
		const curDiscount = Math.round((1 - priceArr[i] / base[i]) * 100);
		discountArr.push(curDiscount, curDiscount);
	}
	discountArr.push(Math.round((1 - priceArr[i] / base[i]) * 100), Math.round((1 - priceArr[i + 1] / base[i + 1]) * 100));
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