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

function makeBase(priceArr, baseArr, priceIncrease, partial = false) {
  let i;
  let last = priceArr.length - 2;
  const base = baseArr;

  function addBase(values) {
    const len = values.length;
    for (let j = 0; j < len; j += 1) {
      base[i + j + 1] = values[j];
    }
  }

  if (!partial) {
    if (priceArr[0] >= priceArr[1]) {
      if (priceArr[0] >= priceArr[2]) {
        [base[0]] = [priceArr[0]];
        i = 0;
      } else {
        [base[0], base[1], base[2]] = [priceArr[2], priceArr[2], priceArr[2]];
        priceIncrease.push(2);
        i = 2;
      }
    } else {
      [base[0], base[1]] = [priceArr[1], priceArr[1]];
      priceIncrease.push(1);
      i = 1;
    }
  } else {
    i = partial - 1;
    last = Math.min(partial + 4, last);
  }

  while (i < last) {
    const curBase = priceArr[i];
    if (curBase < priceArr[i + 1]) {
      addBase([priceArr[i + 1]]);
      priceIncrease.push(i + 1);
      i += 1;
    } else if (curBase === priceArr[i + 2]) {
      addBase([curBase, curBase]);
      i += 2;
    } else if (curBase > priceArr[i + 2]) {
      if (curBase === priceArr[i + 3]) {
        addBase([curBase, curBase, curBase]);
        i += 3;
      } else if (curBase === priceArr[i + 4]) {
        addBase([curBase, curBase, curBase, curBase]);
        i += 4;
      } else if (curBase < priceArr[i + 3]) {
        addBase([curBase, curBase, priceArr[i + 3]]);
        priceIncrease.push(i + 3);
        i += 3;
      } else if (priceArr[i + 1] < priceArr[i + 2]) {
        addBase([curBase, priceArr[i + 2]]);
        i += 2;
      } else if (priceArr[i + 1] === priceArr[i + 3]) {
        if (i >= priceArr.length - 5 || curBase !== priceArr[i + 5]) {
          addBase([priceArr[i + 1], priceArr[i + 1], priceArr[i + 1]]);
          i += 3;
        } else {
          addBase([curBase, curBase, curBase, curBase, curBase]);
          i += 5;
        }
      } else if (priceArr[i + 2] > priceArr[i + 3]) {
        addBase([curBase, priceArr[i + 2], priceArr[i + 2], priceArr[i + 2]]);
        i += 4;
      } else {
        addBase([priceArr[i + 1]]);
        i += 1;
      }
    } else {
      addBase([curBase, priceArr[i + 2]]);
      priceIncrease.push(i + 2);
      i += 2;
    }
  }
}

function checkAbnormalHigh(points, priceArr, baseArr, priceIncrease) {
  const base = baseArr;
  let tmp;

  function removeAbnormal(n) {
    base.splice(tmp, n);
    priceArr.splice(tmp, n);
    points.splice(tmp, n);
  }

  for (let i = priceIncrease.length - 1; i >= 0; i -= 1) {
    tmp = priceIncrease[i];
    if (base[tmp] !== base[tmp + 1]) {
      removeAbnormal(2);
    } else if (base[tmp] !== base[tmp + 2]) {
      removeAbnormal(1);
      makeBase(priceArr, base, priceIncrease, tmp);
    } else if (tmp < base.length - 4 && base[tmp] !== base[tmp + 4]) {
      removeAbnormal(3);
      makeBase(priceArr, base, priceIncrease, tmp);
    }
  }
}

function calculateBase(points, priceArr) {
  const base = Array(priceArr.length);
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
