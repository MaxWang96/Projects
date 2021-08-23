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

$('.dropdown').click(function () {
  $(this).attr('tabindex', 1).focus();
  $(this).toggleClass('active');
  $(this).find('.dropdown-menu').slideToggle(300);
});
$('.dropdown').focusout(function () {
  $(this).removeClass('active');
  $(this).find('.dropdown-menu').slideUp(300);
});
$('.dropdown .dropdown-menu li').click(function () {
  $(this).parents('.dropdown').find('span').text($(this).text());
  $(this).parents('.dropdown').find('input').attr('value', $(this).attr('id'));
});

$('.dropdown-menu li').click(function () {
  var input = '<strong>' + $(this).parents('.dropdown').find('input').val() + '</strong>',
    msg = '<span class="msg">Hidden input value: ';
  $('.msg').html(msg + input + '</span>');
});
