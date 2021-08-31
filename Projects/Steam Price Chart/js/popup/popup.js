'use strict';

const swit = document.getElementById('simplify');
let tab;

chrome.tabs.query({
  active: true,
  currentWindow: true,
}, (tabs) => {
  tab = tabs[0];
  const type = tab.url.split('/')[3];
  const simpType = (type === 'app') ? 'appSimp' : 'bundleSimp';
  chrome.storage.sync.get([simpType, 'range'], (value) => {
    swit.checked = value[simpType];
    setTimeout(() => {
      document.documentElement.style.setProperty('--transition-time', '.3s');
    }, 10);
    document.getElementsByTagName('span')[0].textContent = value.range;
  });
});

const lang = window.navigator.languages[0];
document.body.style['min-width'] = lang.startsWith('zh') ? '120px' : '150px';
document.getElementsByTagName('label')[0].textContent = chrome.i18n.getMessage('simplify');
document.getElementById('feedback-btn').textContent = chrome.i18n.getMessage('feedback');
document.getElementById('feedback-btn').onclick = () => {
  window.open('https://chrome.google.com/webstore/detail/stayfocusd/laankejkbhbdhmipfmgcngdelahlfoji/support');
};

function saveAndChange(setting, id) {
  chrome.storage.sync.set(setting);
  chrome.tabs.sendMessage(id, setting);
}

swit.addEventListener('change', () => {
  const type = tab.url.split('/')[3];
  const toSet = (type === 'app') ? {
    appSimp: swit.checked
  } : {
    bundleSimp: swit.checked
  };
  saveAndChange(toSet, tab.id);
});

[...document.getElementsByClassName('dropdown')].forEach((el) => {
  el.addEventListener('click', function dropdown1() {
    this.setAttribute('tabindex', 1);
    this.focus();
    this.classList.toggle('active');
    this.getElementsByClassName('dropdown-menu')[0].classList.toggle('open');
  });
  el.addEventListener('focusout', function dropdown2() {
    this.classList.remove('active');
    this.getElementsByClassName('dropdown-menu')[0].classList.remove('open');
  });
  [...el.getElementsByTagName('li')].forEach((item) => {
    item.addEventListener('click', function dropdown3() {
      const span = this.closest('.dropdown').getElementsByTagName('span')[0];
      if (span.textContent !== this.textContent) {
        span.textContent = this.textContent;
        saveAndChange({
          [this.parentNode.id]: this.textContent
        }, tab.id);
      }
    });
  });
});
