'use strict';

const swit = document.getElementById('simplify');

chrome.tabs.query({
  active: true,
  currentWindow: true,
}, (tabs) => {
  const type = tabs[0].url.split('/')[3];
  const key = (type === 'app') ? 'appSimp' : 'bundleSimp';
  chrome.storage.sync.get(key, (value) => {
    swit.checked = value[key];
    setTimeout(() => {
      document.documentElement.style.setProperty('--transition-time', '.3s');
    }, 10);
  });
});

const lang = window.navigator.languages[0];
document.body.style['min-width'] = lang.startsWith('zh') ? '120px' : '150px';
document.getElementsByTagName('label')[0].textContent = chrome.i18n.getMessage('simplify');
document.getElementById('feedback-btn').textContent = chrome.i18n.getMessage('feedback');
document.getElementById('feedback-btn').onclick = () => {
  window.open('https://chrome.google.com/webstore/detail/stayfocusd/laankejkbhbdhmipfmgcngdelahlfoji/support');
};

document.getElementById('range-selector').addEventListener('click', () => {

});

function saveOptions(type) {
  if (type === 'app') {
    chrome.storage.sync.set({
      appSimp: swit.checked,
    });
  } else {
    chrome.storage.sync.set({
      bundleSimp: swit.checked,
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
      this.closest('.dropdown').getElementsByTagName('span')[0].textContent = this.textContent;
      //   $(this).parents('.dropdown').find('input').attr('value', $(this).attr('id'));
      // dropdown.getElementsByTagName
    });
  });
  // $('.dropdown-menu li').click(function () {
  //   var input = '<strong>' + $(this).parents('.dropdown').find('input').val() + '</strong>',
  //     msg = '<span class="msg">Hidden input value: ';
  //   $('.msg').html(msg + input + '</span>');
  // });
});