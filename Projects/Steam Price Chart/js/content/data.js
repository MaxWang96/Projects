'use strict';

function setup(points, priceArr, firstPurchaseOption) {
  let i = 0;
  let len = points.length;
  const arr = priceArr;
  const itemName = document.getElementsByClassName('apphub_AppName')[0].textContent;
  for (; i < len - 2; i += 1) {
    if (points[i + 1][0] - points[i][0] <= 14400000
      || points[i + 1][1] === points[i][1]) {
      dataModal(itemName);
    }
    arr.push(points[i][1]);
  }
  arr.push(points[i][1], points[i + 1][1]);

  let price;
  let isDiscount = true;
  const discount = firstPurchaseOption.getElementsByClassName('discount_block');
  len = priceArr.length;
  HTMLElement.prototype.findPrice = function (className) {
    return parseFloat(this.getElementsByClassName(className)[0]
      .textContent
      .match(/[\d.,]+/)[0]
      .replace(',', '.'));
  };

  if (itemInfo.isBundle) {
    price = discount[0].findPrice('discount_final_price');
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
    price = discount[0].findPrice('discount_final_price');
    arr[len - 1] = discount[0].findPrice('discount_original_price');
  } else {
    price = firstPurchaseOption.findPrice('game_purchase_price');
    arr[len - 1] = price / 2;
    arr.push(price);
    isDiscount = false;
  }

  if (price !== points[points.length - 1][1]) {
    dataModal(itemName);
  }

  return isDiscount;
}

function makeBase(priceArr, baseArr, priceIncrease, partial = false) {
  let i = partial ? partial - 1 : 0;
  const len = priceArr.length;
  const last = partial ? Math.min(partial + 4, len - 2) : len - 2;
  const base = baseArr;
  if (len === 2) base.fill(priceArr[1]);
  else [base[0]] = priceArr;

  while (i < last) {
    const [cur, first, second] = [priceArr[i], priceArr[i + 1], priceArr[i + 2]];
    if (cur < first) {
      base[i + 1] = first;
      i += 1;
      priceIncrease.push(i);
    } else if (cur === second) {
      base.fill(cur, i + 1, i + 3);
      i += 2;
    } else if (cur > second) {
      const third = priceArr[i + 3];
      if (cur === third) {
        base.fill(cur, i + 1, i + 4);
        i += 3;
      } else if (cur === priceArr[i + 4]) {
        base.fill(cur, i + 1, i + 5);
        i += 4;
      } else if (cur < third) {
        base.fill(cur, i + 1, i + 3);
        base[i + 3] = third;
        i += 3;
        priceIncrease.push(i);
      } else if (first < second) {
        base[i + 1] = cur;
        base[i + 2] = second;
        i += 2;
      } else if (first === third) {
        if (i >= priceArr.length - 5 || cur !== priceArr[i + 5]) {
          base.fill(first, i + 1, i + 4);
          i += 3;
        } else {
          base.fill(cur, i + 1, i + 6);
          i += 5;
        }
      } else if (second > third) {
        base[i + 1] = cur;
        base.fill(second, i + 2, i + 5);
        i += 4;
      } else {
        base[i + 1] = first;
        i += 1;
      }
    } else {
      base[i + 1] = cur;
      base[i + 2] = second;
      i += 2;
      priceIncrease.push(i);
    }
  }
}

function checkAbnormalHigh(points, priceArr, baseArr, priceIncrease) {
  const base = baseArr;
  let tmp;
  let i = priceIncrease.length - 1;

  function removeAbnormal(n) {
    base.splice(tmp, n);
    priceArr.splice(tmp, n);
    points.splice(tmp, n);
    priceIncrease.splice(i, 1);
  }

  for (; i >= 0; i -= 1) {
    tmp = priceIncrease[i];
    if (base[tmp] !== base[tmp + 1]) {
      removeAbnormal(2);
    } else if (base[tmp] !== base[tmp + 2]) {
      removeAbnormal(1);
      makeBase(priceArr, base, priceIncrease, tmp);
    } else if (tmp < base.length - 4 && base[tmp] !== base[tmp + 4]) {
      if (tmp >= 2) {
        removeAbnormal(3);
        makeBase(priceArr, base, priceIncrease, tmp);
      }
    }
  }
}

function setBeginBase(baseArr, price, idx) {
  const base = baseArr;
  for (let i = 0; i < idx; i += 1) {
    base[i] = price;
  }
}

function calculateBase(points, priceArr) {
  const base = Array(priceArr.length);
  const priceIncrease = [];
  makeBase(priceArr, base, priceIncrease);
  checkAbnormalHigh(points, priceArr, base, priceIncrease);
  const firstIncrease = priceIncrease[0];
  if (firstIncrease <= 3) setBeginBase(base, priceArr[firstIncrease], firstIncrease);
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
