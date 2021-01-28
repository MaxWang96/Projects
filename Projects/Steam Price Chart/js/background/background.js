'use strict';

chrome.runtime.onMessage.addListener(
	(message, sender, sendResponse) => {
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

		if (!message.lang.startsWith('zh')) {
			if (message.lang.startsWith('en') || message.bundle) {
				sendHltbRequest();
			} else {
				const enNameRequest = new XMLHttpRequest;
				enNameRequest.open('GET', `https://steamspy.com/api.php?request=appdetails&appid=${message.id}`);
				enNameRequest.onload = function() {
					name = this.response.match(/"name":"(.+?)"/)[1];
					// console.log(test);
					// console.log(name);
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

		function hltbRequest(gameName, onloadFunc) {
			const name = gameName.replace(/[^\w\s]/gi, '');
			const xhr = new XMLHttpRequest;
			const url = 'https://howlongtobeat.com/search_results.php';
			const params = `queryString=${name}&t=games&sorthead=popular&sortd='Normal Order'`;
			xhr.open('POST', url, true);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.onload = onloadFunc;
			xhr.send(params);
		}

		function request(name) {
			// console.time('a');
			const xhr = new XMLHttpRequest;
			const url = `https://isthereanydeal.com/game/${name}/history/${message.storeRegion}/?shop%5B%5D=steam&generate=Select+Stores`;
			xhr.open('GET', url);
			// xhr.timeout = 10;
			// xhr.ontimeout = function() {alert('cat!!')};
			// console.log(url);
			xhr.onload = function(data) {
				try {
					// console.time('t');
					itadReady = 1;
					// console.timeEnd('a');
					// console.timeEnd('t');
					const dataArr = JSON.parse(this.response.match(/"Steam","data":(\[\[.+?\]\])/)[1]);
					// console.log(dataArr);
					// console.time('t');

					let min = dataArr[dataArr.length - 2][1];
					let max = dataArr[dataArr.length - 2][1];
					const lastPoint = dataArr[dataArr.length - 1];
					for (let i = dataArr.length - 3; i >= 0; i--) {
						if (dataArr[i][1] == null) {
							dataArr.splice(i, 1);
						}
						if (dataArr[i + 1][1] == dataArr[i][1]) {
							dataArr.splice(i + 1, 1);
						}
					}
					for (let j = dataArr.length - 3; j >= 0; j--) {
						if (dataArr[j + 1][0] - dataArr[j][0] <= 7200000) {
							if (dataArr[j + 1][1] >= dataArr[j][1]) {
								dataArr.splice(j - 1, 2);
							} else {
								dataArr.splice(j, 1);
							}
						} else if (dataArr[j + 1][0] - dataArr[j][0] <= 86400000) {
							dataArr.splice(j, 1);
						}
						if (dataArr[j + 1][1] == dataArr[j][1]) {
							dataArr.splice(j + 1, 1);
						}
						if (dataArr[j][1] > max) {
							max = dataArr[j][1];
						} else if (dataArr[j][1] < min) {
							min = dataArr[j][1];
						}
					}
					if (lastPoint[0] != dataArr[dataArr.length - 1][0]) dataArr.push(lastPoint);
					// console.timeEnd('t');
					// console.timeEnd('a');

					response.data = {
						points: dataArr,
						range: [min, max]
					};
					response.itadUrl = `https://isthereanydeal.com/game/${name}/info/${message.storeRegion}`;
					if (message.bundle) {
						response.bundleTitle = this.response.match(/<h1 id='gameTitle'>.+?>(.+?)</)[1];
						// console.log(response.bundleTitle);
					}
					tryRespond();
				} catch (error) {}
			}
			xhr.send();

			// console.time('t');
		}

		function tryRespond() {
			if (itadReady && hltbReady) {
				sendResponse(response);
				// console.timeEnd('t');
			}
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