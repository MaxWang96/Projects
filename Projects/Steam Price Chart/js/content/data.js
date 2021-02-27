'use strict';

function setup(points, priceArr, firstPurchaseOption) {
  let i = 0;
  let len = points.length;
  const arr = priceArr;
  const itemName = document.getElementsByClassName('apphub_AppName')[0].textContent;
  for (; i < len - 2; i += 1) {
    if (points[i + 1][0] - points[i][0] <= 14400000) {
      dataModal(itemName);
    }
    arr.push(points[i][1]);
  }
  arr.push(points[i][1], points[i + 1][1]);

  let price;
  let isDiscount = true;
  const discount = firstPurchaseOption.getElementsByClassName('discount_block');
  len = priceArr.length;
  HTMLElement.prototype.findPrice = function () {
    return parseFloat(this.textContent
      .match(/[\d.,]+/)[0]
      .replace(',', '.'));
  };

  if (itemInfo.isBundle) {
    price = discount[0]
      .getElementsByClassName('discount_final_price')[0]
      .findPrice();
    let max = price;
    const searchRange = len < 5 ? len - 1 : 4;
    for (let j = 0; j < searchRange; j += 1) {
      if (arr[len - j - 2] > max) {
        max = arr[len - j - 2];
      }
    }
    if (max === price) {
      arr[len - 1] = price / 2;
      arr.push(price);
      isDiscount = false;
    } else {
      arr[len - 1] = max;
    }
  } else if (discount.length !== 0) {
    price = discount[0]
      .getElementsByClassName('discount_final_price')[0]
      .findPrice();
    arr[len - 1] = discount[0]
      .getElementsByClassName('discount_original_price')[0]
      .findPrice();
  } else {
    price = firstPurchaseOption
      .getElementsByClassName('game_purchase_price')[0]
      .findPrice();
    arr[len - 1] = price / 2;
    arr.push(price);
    isDiscount = false;
  }

  if (price !== points[points.length - 1][1]) {
    dataModal(itemName);
  }

  return isDiscount;
}

function makeBase(priceArr, base, priceIncrease, begin = false, end = false) {
  let i;
  let last = priceArr.length - 2;
  if (!begin) {
    if (priceArr[0] >= priceArr[1]) {
      base.push(priceArr[0]);
      i = 0;
    } else {
      base.push(priceArr[1], priceArr[1]);
      priceIncrease.push(1);
      i = 1;
    }
  } else {
    i = begin;
    last = Math.min(end, last);
  }
  while (i < last) {
    const curBase = priceArr[i];
    if (curBase < priceArr[i + 1]) {
      base.push(priceArr[i + 1]);
      priceIncrease.push(i + 1);
      i += 1;
    } else if (curBase === priceArr[i + 2]) {
      base.push(curBase, curBase);
      i += 2;
    } else if (curBase > priceArr[i + 2]) {
      if (curBase === priceArr[i + 3]) {
        base.push(curBase, curBase, curBase);
        i += 3;
      } else if (curBase === priceArr[i + 4]) {
        base.push(curBase, curBase, curBase, curBase);
        i += 4;
      } else if (curBase < priceArr[i + 3]) {
        base.push(curBase, curBase, priceArr[i + 3]);
        priceIncrease.push(i + 3);
        i += 3;
      } else if (priceArr[i + 1] < priceArr[i + 2]) {
        base.push(curBase, priceArr[i + 2]);
        i += 2;
      } else if (priceArr[i + 1] === priceArr[i + 3]) {
        if (i >= priceArr.length - 5 || curBase !== priceArr[i + 5]) {
          base.push(priceArr[i + 1], priceArr[i + 1], priceArr[i + 1]);
          i += 3;
        } else {
          base.push(curBase, curBase, curBase, curBase, curBase);
          i += 5;
        }
      } else if (priceArr[i + 2] > priceArr[i + 3]) {
        base.push(curBase, priceArr[i + 2], priceArr[i + 2], priceArr[i + 2]);
        i += 4;
      } else {
        base.push(priceArr[i + 1]);
        i += 1;
      }
    } else {
      base.push(curBase, priceArr[i + 2]);
      priceIncrease.push(i + 2);
      i += 2;
    }
  }
}

function checkAbnormalHigh(points, priceArr, baseArr, priceIncrease) {
  const base = baseArr;
  for (let i = priceIncrease.length - 1; i >= 0; i -= 1) {
    const tmp = priceIncrease[i];
    if (base[tmp] !== base[tmp + 1]) {
      base.splice(tmp, 2);
      priceArr.splice(tmp, 2);
      points.splice(tmp, 2);
    } else if (base[tmp] !== base[tmp + 2]) {
      base.splice(tmp, 1);
      priceArr.splice(tmp, 1);
      points.splice(tmp, 1);
      makeBase(priceArr, base, priceIncrease, tmp - 1, tmp + 4);
    }
  }
}

function calculateBase(points, priceArr) {
  const base = [];
  const priceIncrease = [];
  makeBase(priceArr, base, priceIncrease);
  checkAbnormalHigh(points, priceArr, base, priceIncrease);
  return base;
}

function restorePriceArr(isDiscount, priceArr) {
  const arr = priceArr;
  const len = arr.length;
  if (isDiscount) {
    arr[len - 1] = arr[len - 2];
  } else {
    arr[len - 2] = arr[len - 3];
  }
}

function makeDiscountArr(len, priceArr, base) {
  const discountArr = [];
  let i = 0;
  for (; i < len - 2; i += 1) {
    const curDiscount = Math.round((1 - priceArr[i] / base[i]) * 100);
    discountArr.push(curDiscount, curDiscount);
  }
  discountArr.push(Math.round((1 - priceArr[i] / base[i]) * 100),
    Math.round((1 - priceArr[i + 1] / base[i + 1]) * 100));
  return discountArr;
}

function addIntermediatePoints(points) {
  const plotArr = [];
  const len = points.length;
  let i = 0;
  for (; i < len - 2; i += 1) {
    plotArr.push(points[i]);
    plotArr.push([points[i + 1][0] - 3600000, points[i][1]]);
  }
  plotArr.push(points[i], points[i + 1]);
  return plotArr;
}

function calculateDiscount(points, firstPurchaseOption) {
  const itemName = document.getElementsByClassName('apphub_AppName')[0].textContent;
  if ((points[0][1] === 0
      && points[1][0] - points[0][0] > 31536000000)
    || points[points.length - 1][1] !== points[points.length - 2][1]) {
    dataModal(itemName);
  }

  const priceArr = [];
  const isDiscount = setup(points, priceArr, firstPurchaseOption);
  const base = calculateBase(points, priceArr);
  restorePriceArr(isDiscount, priceArr);

  return makeDiscountArr(points.length, priceArr, base);
}
