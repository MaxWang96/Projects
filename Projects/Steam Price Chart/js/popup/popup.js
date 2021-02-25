'use strict';

const swit = document.getElementsByClassName('js-switch')[0];

chrome.storage.sync.get('simplified', (value) => {
  swit.checked = value.simplified;
  const initSpeed = swit.checked ? '0s' : '0.4s';
  const init = new Switchery(swit, {
    size: 'small',
    color: '#377096',
    speed: initSpeed,
  });
  if (swit.checked) init.options.speed = '0.4s';
});

const lang = window.navigator.languages[0];
document.body.style['min-width'] = lang.startsWith('zh') ? '120px' : '150px';
document.getElementsByTagName('label')[0].innerText = chrome.i18n.getMessage('simplify');
document.getElementById('feedback-btn').innerText = chrome.i18n.getMessage('feedback');
document.getElementById('feedback-btn').onclick = () => {
  window.open('https://chrome.google.com/webstore/detail/stayfocusd/laankejkbhbdhmipfmgcngdelahlfoji/support');
};

function saveOptions() {
  chrome.storage.sync.set({
    simplified: swit.checked,
  });
}

function changeChart() {
  chrome.tabs.query({
    active: true,
    currentWindow: true,
  }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      simplified: swit.checked,
    });
  });
}

function funcs() {
  saveOptions();
  changeChart();
}

document.addEventListener('change', funcs);
