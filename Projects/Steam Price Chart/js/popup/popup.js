'use strict';

const swit = document.querySelector('.js-switch');

chrome.storage.sync.get('simplified', function(value) {
	swit.checked = value.simplified;
	let initSpeed = '0.4s';
	if (value.simplified) initSpeed = '0s';
	const init = new Switchery(swit, {
		size: 'small',
		color: '#377096',
		speed: initSpeed
	});
	if (value.simplified) init.options.speed = '0.4s';
});

document.querySelector('label').innerText = chrome.i18n.getMessage('simplify');

function funcs() {
	saveOptions();
	changeChart();
}

function saveOptions() {
	chrome.storage.sync.set({
		simplified: swit.checked
	});
}

function changeChart() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {simplified: swit.checked});
	});
}

document.addEventListener('change', funcs);