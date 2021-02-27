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
    const curBase = priceArr[k];
    if (curBase < priceArr[k + 1]) {
      base.push(priceArr[k + 1]);
      priceIncrease.push(k + 1);
      k += 1;
    } else if (curBase === priceArr[k + 2]) {
      base.push(curBase, curBase);
      k += 2;
    } else if (curBase > priceArr[k + 2]) {
      if (curBase === priceArr[k + 3]) {
        base.push(curBase, curBase, curBase);
        k += 3;
      } else if (curBase === priceArr[k + 4]) {
        base.push(curBase, curBase, curBase, curBase);
        k += 4;
      } else if (priceArr[k + 1] < priceArr[k + 2]) {
        if (curBase < priceArr[k + 3]) {
          base.push(curBase, curBase, priceArr[k + 3]);
          priceIncrease.push(k + 3);
          k += 3;
        } else {
          base.push(curBase, priceArr[k + 2]);
          k += 2;
        }
      } else if (priceArr[k + 1] === priceArr[k + 3]) {
        if (k >= priceArr.length - 5 || curBase !== priceArr[k + 5]) {
          base.push(priceArr[k + 1], priceArr[k + 1], priceArr[k + 1]);
          k += 3;
        } else {
          base.push(curBase, curBase, curBase, curBase, curBase);
          k += 5;
        }
      } else if (priceArr[k + 2] > priceArr[k + 3]) {
        base.push(curBase, priceArr[k + 2], priceArr[k + 2], priceArr[k + 2]);
        k += 4;
      } else if (priceArr[k + 2] < priceArr[k + 3]) {
        base.push(priceArr[k + 1]);
        k += 1;
      } else {
        unknownDiscountModal();
      }
    } else {
      base.push(curBase, priceArr[k + 2]);
      priceIncrease.push(k + 2);
      k += 2;
    }
  }
}

function checkAbnormalHigh(points, priceArr, baseArr, priceIncrease) {
  const base = baseArr;
  for (let i = priceIncrease.length - 1; i >= 0; i -= 1) {
    const tmp = priceIncrease[i];
    if (tmp < priceArr.length - 1 && base[tmp] !== base[tmp + 1]) {
      base[tmp - 1] = base[tmp + 1];
      base.splice(tmp, 2);
      priceArr.splice(tmp, 2);
      points.splice(tmp, 2);
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
