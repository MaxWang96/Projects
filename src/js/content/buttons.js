'use strict';

function setRangeButtons(range, text) {
  const defaultButtons = [{
    type: 'month',
    count: 1,
    text: text[0],
  }, {
    type: 'month',
    count: 3,
    text: text[1],
  }, {
    type: 'month',
    count: 6,
    text: text[2],
  }, {
    type: 'year',
    count: 1,
    text: text[3],
  }, {
    type: 'year',
    count: 3,
    text: text[4],
  }, {
    type: 'all',
    text: text[5],
  }];
  if (range === '1y') {
    defaultButtons.splice(-2);
    defaultButtons[3].type = 'all';
  } else if (range === '3y') {
    defaultButtons.pop();
    defaultButtons[4].type = 'all';
  }
  return defaultButtons;
}

// add events to toggle the visibility of the url buttons
function addEvents(obj, label) {
  return obj
    .on('mouseover', () => {
      label.css({
        display: 'inline',
      });
    })
    .on('mouseout', () => {
      label.css({
        display: 'none',
      });
    });
}

function addImg(chart, image, label, xAlign) {
  return addEvents(chart.renderer.image(image, 0, 0, 20, 20), label)
    .align({
      align: 'right',
      x: xAlign,
      y: 10,
    }, false, 'chart')
    .add();
}

function addImgUrl(imgObj, url) {
  imgObj
    .css({
      cursor: 'pointer',
    })
    .on('click', () => {
      window.open(url, '_blank');
    });
}

function addLabel(chart, text) {
  return chart.renderer.label(text, 0, 0, 'callout', 910, 15)
    .attr({
      fill: '#377096',
      r: 5,
      padding: 8,
      zIndex: 8,
    })
    .css({
      color: '#d9dadd',
      fontSize: '12px',
      width: '120px',
      display: 'none',
    })
    .shadow(true)
    .add();
}

function setAlign(xAlign) {
  return {
    align: 'right',
    x: xAlign,
    y: 5,
  };
}

function addItadButton(chart, url) {
  const itadImgUrl = chrome.runtime.getURL('../images/isthereanydeal_icon.svg');
  const isDlc = document.getElementsByClassName('game_area_dlc_bubble').length !== 0;
  const isMusic = document.getElementsByClassName('game_area_soundtrack_bubble').length !== 0;

  let itemType;
  let offset;
  if (isMusic)[itemType, offset] = ['soundtrack', -230];
  else if (isDlc)[itemType, offset] = ['DLC', -205];
  else if (bundle === 'app')[itemType, offset] = ['bundle', -220];
  else if (bundle === 'appSub')[itemType, offset] = ['package', -230];
  else [itemType, offset] = ['game', -215];

  const itadLabel = addLabel(chart, `View the ${itemType} on IsThereAnyDeal`).align(setAlign(offset));
  addImgUrl(addImg(chart, itadImgUrl, itadLabel, -85), url);
}

function addHltbButton(chart, data) {
  const cha = chart;
  const hltbImgUrl = chrome.runtime.getURL('../images/howlongtobeat_icon.png');
  if (!data.hasOwnProperty('hltbUrl')) {
    let hltbImg;
    if (data.hltbReady) {
      const hltbLabel = addLabel(cha, "Can't find the game on HowLongToBeat").align(setAlign(-190));
      hltbImg = addImg(cha, hltbImgUrl, hltbLabel, -55).css({
        opacity: 0.2,
      });
    } else {
      const hltbLabel = addLabel(cha, "Looking for the game's link...").align(setAlign(-167));
      hltbImg = addImg(cha, hltbImgUrl, hltbLabel, -55).css({
        opacity: 0.5,
      });
      cha.hltbLabel = hltbLabel;
      cha.hltbImg = hltbImg;
    }
    addImgUrl(hltbImg, 'https://howlongtobeat.com/');
  } else {
    const hltbLabel = addLabel(chart, 'View the game on HowLongToBeat').align(setAlign(-183));
    addImgUrl(addImg(chart, hltbImgUrl, hltbLabel, -55), data.hltbUrl);
  }
}

function addButtons(chart, data) {
  addItadButton(chart, data.itadUrl);
  addHltbButton(chart, data);
}
