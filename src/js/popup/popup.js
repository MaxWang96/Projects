'use strict';

function langSetupHelper(elementsArr, msgArr) {
  const elements = elementsArr;
  for (let i = 0; i < elements.length; i += 1) {
    elements[i].textContent = chrome.i18n.getMessage(msgArr[i]);
  }
}

function langSetup() {
  langSetupHelper(document.getElementsByTagName('label'), ['range', 'simplify', 'animation']);
  langSetupHelper(document.getElementsByTagName('li'), ['1y', '3y', 'all']);
  // document.getElementById('feedback-btn').textContent = chrome.i18n.getMessage('feedback');
}

function setSimp(type) {
  const toggleSwitch = document.getElementById('simplify');
  const toSet = (type === 'app') ? {
    appSimp: toggleSwitch.checked,
  } : {
    bundleSimp: toggleSwitch.checked,
  };
  chrome.storage.sync.set(toSet);
}

function setup() {
  chrome.tabs.query({
    active: true,
    currentWindow: true,
  }, (tabs) => {
    const type = tabs[0].url.split('/')[3];
    const simpType = (type === 'app') ? 'appSimp' : 'bundleSimp';
    chrome.storage.sync.get([simpType, 'animation', 'range'], (value) => {
      document.getElementById('simplify').checked = value[simpType];
      document.getElementById('animation').checked = value.animation;
      setTimeout(() => {
        document.documentElement.style.setProperty('--transition-time', '.3s');
      }, 200);
      document.getElementsByTagName('span')[0].textContent = chrome.i18n.getMessage(value.range);
    });
    document.getElementById('simplify').addEventListener('change', setSimp.bind(null, type));
  });

  [...document.getElementsByClassName('expand')].forEach((el, i) => {
    const element = el;
    element.style.gridRow = i + 2;
    element.style.gridColumn = '1/3';
  });
  [...document.getElementsByClassName('switch')].forEach((el, i) => {
    const element = el;
    element.style.gridRow = i + 2;
  });
  if (window.navigator.languages[0].startsWith('zh')) {
    document.body.style['min-width'] = '130px';
    document.getElementsByClassName('dropdown')[0].style.width = '36px';
  } else {
    document.getElementsByClassName('dropdown')[0].style.width = '32px';
  }
  // document.getElementById('feedback-btn').onclick = () => {
  //   window.open(
  //     'https://chrome.google.com/webstore/detail/',
  //   );
  // };
  langSetup();

  document.getElementById('animation').addEventListener('change', () => {
    chrome.storage.sync.set({
      animation: document.getElementById('animation').checked,
    });
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
          chrome.storage.sync.set({
            [this.parentNode.id]: this.id,
          });
        }
      });
    });
  });
}

setup();
