'use strict';

chrome.runtime.onMessage.addListener(
	(message, sender, sendResponse) => {
		const cantConnect = setTimeout(() => {
			response.error = [itadReady, hltbReady];
			sendResponse(response);
		}, 9000);

		let name = message.name;
		let itadReady = 0,
			hltbReady = 0,
			receivedReg = 0,
			receivedAlt = 0;
		const response = {
			hltbUrl: 'https://howlongtobeat.com/'
		};

		// console.log(sender.tab.url);
		// console.time('t');

		// XHR to IsThereAnyDeal
		if (!message.bundle) {
			const idRequest = new XMLHttpRequest;
			idRequest.open('GET', `https://api.isthereanydeal.com/v02/game/plain/?key=2a0a6baa1713e7be64e451ab1b863b988ce63455&shop=steam&game_id=app%2F${message.id}`);
			idRequest.onload = function() {
				const gameName = this.response.match(/"plain":"(.+?)"/)[1];
				request(gameName);
			}
			idRequest.send();
		} else {
			const idRequest = new XMLHttpRequest;
			idRequest.open('HEAD', `https://isthereanydeal.com/steam/bundle/${message.id}/`);
			idRequest.onload = function() {
				const bundleName = this.responseURL.split('/')[4];
				request(bundleName);
			}
			idRequest.send();
		}

		// XHR to HowLongToBeat
		if (!message.lang.startsWith('zh')) {
			if (message.lang.startsWith('en') || message.bundle) {
				sendHltbRequest();
			} else {
				const enNameRequest = new XMLHttpRequest;
				enNameRequest.open('GET', `https://steamspy.com/api.php?request=appdetails&appid=${message.id}`);
				enNameRequest.onload = function() {
					name = this.response.match(/"name":"(.+?)"/)[1];
					sendHltbRequest();
				}
				enNameRequest.send();
			}
		} else hltbReady = 1;

		return true;


		function sendHltbRequest() {
			hltbRequest(name, function() {
				receivedReg = 1;
				const getId = this.response.match(/href="(.+?)"/);
				if (getId != null) {
					response.hltbUrl = 'http://howlongtobeat.com/' + getId[1];
					hltbReady = 1;
				}
				if (receivedAlt) hltbReady = 1;
				tryRespond();
			});

			if (name.includes('Edition')) {
				const colonIdx = name.lastIndexOf(':'),
					dashIdx = name.lastIndexOf('-');
				if (colonIdx < dashIdx) altRequest(dashIdx);
				else if (colonIdx > dashIdx) altRequest(colonIdx);
				else {
					const spaceIdx = name.lastIndexOf(' ', name.lastIndexOf(' ') - 1);
					altRequest(spaceIdx);
				}
			} else receivedAlt = 1;
		}

		function altRequest(idx) {
			hltbRequest(name.slice(0, idx), function() {
				receivedAlt = 1;
				const getId = this.response.match(/href="(.+?)"/);
				if (getId != null) {
					response.hltbUrl = 'http://howlongtobeat.com/' + getId[1];
					if (receivedReg) hltbReady = 1;
				}
				tryRespond();
			})
		}


	}
);

chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({
		simplified: false,
	});
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([{
			conditions: [new chrome.declarativeContent.PageStateMatcher({
				pageUrl: {
					urlContains: 'store.steampowered.com/app'
				},
			})],
			actions: [new chrome.declarativeContent.ShowPageAction()]
		}]);
	});
});