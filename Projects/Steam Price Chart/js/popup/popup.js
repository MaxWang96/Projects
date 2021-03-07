'use strict';

const swit = document.getElementsByClassName('js-switch')[0];

chrome.tabs.query({
  active: true,
  currentWindow: true,
}, (tabs) => {
  const type = tabs[0].url.split('/')[3];
  const key = (type === 'app') ? 'appSimplified' : 'bundleSimplified';
  chrome.storage.sync.get(key, (value) => {
    swit.checked = value[key];
    const initSpeed = swit.checked ? '0s' : '0.4s';
    const init = new Switchery(swit, {
      size: 'small',
      color: '#377096',
      speed: initSpeed,
    });
    if (swit.checked) init.options.speed = '0.4s';
  });
});

const lang = window.navigator.languages[0];
document.body.style['min-width'] = lang.startsWith('zh') ? '120px' : '150px';
document.getElementsByTagName('label')[0].innerText = chrome.i18n.getMessage('simplify');
document.getElementById('feedback-btn').innerText = chrome.i18n.getMessage('feedback');
document.getElementById('feedback-btn').onclick = () => {
  window.open('https://chrome.google.com/webstore/detail/stayfocusd/laankejkbhbdhmipfmgcngdelahlfoji/support');
};

function saveOptions(type) {
  if (type === 'app') {
    chrome.storage.sync.set({
      appSimplified: swit.checked,
    });
  } else {
    chrome.storage.sync.set({
      bundleSimplified: swit.checked,
    });
  }
}

function changeChart(id) {
  chrome.tabs.sendMessage(id, {
    simp: swit.checked,
  });
}

function funcs() {
  chrome.tabs.query({
    active: true,
    currentWindow: true,
  }, (tabs) => {
    const type = tabs[0].url.split('/')[3];
    saveOptions(type);
    changeChart(tabs[0].id);
  });
}

document.addEventListener('change', funcs);
