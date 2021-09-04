'use strict';

let tab;

function langSetup() {
  const labels = document.getElementsByTagName('label');
  labels[0].textContent = chrome.i18n.getMessage('simplify');
  labels[1].textContent = chrome.i18n.getMessage('range');
  const rangeItems = document.getElementsByTagName('li');
  rangeItems[0].textContent = chrome.i18n.getMessage('1y');
  rangeItems[1].textContent = chrome.i18n.getMessage('3y');
  rangeItems[2].textContent = chrome.i18n.getMessage('all');
  document.getElementById('feedback-btn').textContent = chrome.i18n.getMessage('feedback');
}

function saveAndChange(setting, id) {
  chrome.storage.sync.set(setting);
  chrome.tabs.sendMessage(id, setting);
}

function setSimp() {
  const toggleSwitch = document.getElementById('simplify');
  const type = tab.url.split('/')[3];
  const toSet = (type === 'app') ? {
    appSimp: toggleSwitch.checked,
  } : {
    bundleSimp: toggleSwitch.checked,
  };
  saveAndChange(toSet, tab.id);
}

function setup() {
  chrome.tabs.query({
    active: true,
    currentWindow: true,
  }, (tabs) => {
    [tab] = tabs;
    const type = tab.url.split('/')[3];
    const simpType = (type === 'app') ? 'appSimp' : 'bundleSimp';
    chrome.storage.sync.get([simpType, 'range'], (value) => {
      document.getElementById('simplify').checked = value[simpType];
      setTimeout(() => {
        document.documentElement.style.setProperty('--transition-time', '.3s');
      }, 200);
      document.getElementsByTagName('span')[0].textContent = chrome.i18n.getMessage(value.range);
    });
  });

  if (window.navigator.languages[0].startsWith('zh')) {
    document.body.style['min-width'] = '120px';
    document.getElementsByClassName('dropdown')[0].style.width = '36px';
  } else {
    document.getElementsByClassName('dropdown')[0].style.width = '32px';
  }
  document.getElementById('feedback-btn').onclick = () => {
    window.open('https://chrome.google.com/webstore/detail/stayfocusd/laankejkbhbdhmipfmgcngdelahlfoji/support');
  };
  langSetup();

  document.getElementById('simplify').addEventListener('change', setSimp);
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
            [this.parentNode.id]: this.id,
          }, tab.id);
        }
      });
    });
  });
}

setup();
