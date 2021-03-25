'use strict';

function makePriceArr(arr, points) {
  const len = points.length;
  arr.push(points[0][1]);
  if (len === 2) {
    arr.push(points[1][1]);
  } else {
    let i = 1;
    for (; i < len - 2; i += 1) {
      if (points[i + 1][0] - points[i][0] <= 165600000
        || points[i + 1][1] === points[i][1]) {
        showOriginalModal();
      }
      arr.push(points[i][1]);
    }
    arr.push(points[i][1], points[i + 1][1]);
  }
}

function setupEnd(priceArr, firstPurchaseOption) {
  let price;
  let endDiscount = true;
  const arr = priceArr;
  const len = arr.length;
  const curPrice = arr[len - 1];
  const discount = firstPurchaseOption.getElementsByClassName('discount_block');
  if (bundle === 'app' || bundle === 'bundle') {
    price = discount[0].getAttribute('data-price-final') / 100;
    let max = price;
    const searchRange = len < 5 ? len - 1 : 4;
    for (let j = 0; j < searchRange; j += 1) {
      if (arr[len - j - 2] > max) max = arr[len - j - 2];
    }
    if (max === price) {
      arr[len - 1] = price / 2;
      arr.push(price);
      endDiscount = false;
    } else {
      arr[len - 1] = max;
    }
  } else if (discount.length !== 0) {
    price = discount[0].getAttribute('data-price-final') / 100;
    arr[len - 1] = parseFloat(discount[0]
      .getElementsByClassName('discount_original_price')[0]
      .textContent
      .match(/[\d.,]+/)[0]
      .replace(',', '.'));
  } else {
    price = firstPurchaseOption.getElementsByClassName('game_purchase_price')[0].getAttribute('data-price-final') / 100;
    arr[len - 1] = price / 2;
    arr.push(price);
    endDiscount = false;
  }
  if (price !== curPrice) dataModal();
  return endDiscount;
}

function setupBegin(arr, points) {
  let max = arr[0];
  let beginDiscount = false;
  if (arr.length === 2) {
    beginDiscount = true;
    max = arr[1];
  } else {
    for (let i = 1; i < 3; i += 1) {
      if (arr[i] > max) {
        beginDiscount = true;
        max = arr[i];
      }
    }
  }
  if (beginDiscount) {
    arr.unshift(max);
    points.unshift(0);
  }
  return beginDiscount;
}

function setup(points, priceArr, firstPurchaseOption) {
  makePriceArr(priceArr, points);
  const endDiscount = setupEnd(priceArr, firstPurchaseOption);
  const beginDiscount = setupBegin(priceArr, points);
  return [beginDiscount, endDiscount];
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
        } else if (first / cur <= 0.8) { // borderlands 2 psycho pack US
          base.fill(cur, i + 1, i + 6);
          i += 5;
        } else { // dead by daylight CN
          base.fill(first, i + 1, i + 5);
          base[i + 5] = cur;
          i += 5;
          priceIncrease.push(i);
        }
      } else if (second > third) { // double price decrease
        base[i + 1] = first;
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

function checkAbnormalHigh(pointsArr, priceArr, baseArr, priceIncrease) {
  const price = priceArr;
  const base = baseArr;
  let tmp;
  let i = priceIncrease.length - 1;

  function removeAbnormal(n) {
    let j = 0;
    let idx = tmp;
    const points = pointsArr;
    const toDelete = [];
    const correctBase = base[tmp - 1];
    if (i - 2 >= 0) {
      if (priceIncrease[i] - priceIncrease[i - 2] <= 10) showOriginalModal();
    }
    while (j < n) {
      if (price[idx] < correctBase) {
        idx += 1;
      } else {
        if (price[idx - 1] !== correctBase) {
          points[idx][1] = correctBase;
          price[idx] = correctBase;
          base[idx] = correctBase;
        } else {
          toDelete.push(idx);
        }
        if (price[idx + 1] === correctBase) {
          toDelete.push(idx + 1);
        }
        idx += 2;
        j += 1;
      }
    }
    for (let k = toDelete.length - 1; k >= 0; k -= 1) {
      const deleteIdx = toDelete[k];
      base.splice(deleteIdx, 1);
      price.splice(deleteIdx, 1);
      points.splice(deleteIdx, 1);
    }
  }

  for (; i >= 0; i -= 1) {
    tmp = priceIncrease[i];
    if (base[tmp] !== base[tmp + 1]) {
      removeAbnormal(1);
    } else if (base[tmp] !== base[tmp + 2]) {
      removeAbnormal(1);
      makeBase(price, base, priceIncrease, tmp);
    } else if (tmp < base.length - 4 && base[tmp] !== base[tmp + 4]) { // rainbow six US
      removeAbnormal(2);
      makeBase(price, base, priceIncrease, tmp);
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

function restorePriceArr(points, priceArr, base, discounts) {
  const arr = priceArr;
  if (discounts[0]) {
    points.shift();
    arr.shift();
    base.shift();
  }
  const len = arr.length;
  if (discounts[1]) {
    arr[len - 1] = arr[len - 2];
  } else {
    arr[len - 2] = arr[len - 3];
  }
}

function makeDiscountArr(points, priceArr, base) {
  const discountArr = [];
  let len = points.length;
  let i = 0;
  for (; i < len - 2; i += 1) {
    if (priceArr[i] === base[i]) {
      discountArr.push(0, 0);
    } else {
      if (points[i + 1][0] - points[i][0] >= 2592000000
        && i > 1) {
        if (priceArr[i] === 0) {
          points[i][1] = points[i + 1][1];
          points.splice(i + 1, 1);
          priceArr.splice(i + 1, 1);
          base.splice(i + 1, 1);
          len -= 1;
        } else {
          showOriginalModal();
        }
      }
      const curDiscount = Math.round((1 - priceArr[i] / base[i]) * 100);
      discountArr.push(curDiscount, curDiscount);
    }
  }
  discountArr.push(Math.round((1 - priceArr[i] / base[i]) * 100),
    Math.round((1 - priceArr[i + 1] / base[i + 1]) * 100));
  return discountArr;
}

function calculateDiscount(points, firstPurchaseOption) {
  if ((points[0][1] === 0
      && points[1][0] - points[0][0] >= 31536000000)
    || points[points.length - 1][1] !== points[points.length - 2][1]) {
    dataModal();
  }
  const priceArr = [];
  const discounts = setup(points, priceArr, firstPurchaseOption);
  const base = calculateBase(points, priceArr);
  restorePriceArr(points, priceArr, base, discounts);
  return makeDiscountArr(points, priceArr, base);
}

function personalPrice(pointsArr, firstPurchaseOption) {
  const userPrice = firstPurchaseOption.getElementsByClassName('your_price');
  if (userPrice.length) {
    const price = parseFloat(userPrice[0]
      .children[1]
      .textContent
      .match(/[\d.,]+/)[0]
      .replace(',', '.'));
    const points = pointsArr;
    const len = points.length;
    if (price !== points[len - 1][1]) {
      const pricePercent = price / points[len - 1][1];
      for (let i = 0; i < len; i += 1) {
        points[i][1] *= pricePercent;
      }
    }
  }
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
