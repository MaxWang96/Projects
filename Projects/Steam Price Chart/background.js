'use strict';

chrome.runtime.onMessage.addListener(
	(message, sender, sendResponse) => {
		const splittedUrl = message.url.split('/');
		const id = splittedUrl[4];
		let itadReady = 0,
			hltbReady = 0;
		const response = {
			hltbUrl: 'https://howlongtobeat.com/'
		};
		// let a, b;

		console.time('t');
		const idRequest = new XMLHttpRequest;
		idRequest.open('GET', `https://api.isthereanydeal.com/v02/game/plain/?key=2a0a6baa1713e7be64e451ab1b863b988ce63455&shop=steam&game_id=app%2F${id}`);
		idRequest.onload = function() {
			const gameName = this.response.match(/"plain":"(.+?)"/)[1];
			request(gameName);
		}
		idRequest.send();

		const hltbRequest = new XMLHttpRequest;
		const url = 'https://howlongtobeat.com/search_results.php';
		const name = message.name.replace(/[^\w\s]/gi, '');
		const params = `queryString=${name}&t=games`;
		hltbRequest.open('POST', url, true);
		hltbRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		hltbRequest.onload = function() {
			// console.log(this.response);
			const getId = this.response.match(/href="(.+?)"/);
			if (getId != null) {
				response.hltbUrl = 'http://howlongtobeat.com/' + this.response.match(/href="(.+?)"/)[1];
			}
			hltbReady = 1;
			tryRespond();
		}
		hltbRequest.send(params);

		return true;

		function romanize(num) {
			const key = ['', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix'];
			return key[num] + '';
		}

		function sendUrl(name) {
			for (let i = 0; i < name.length; i++) {
				if (name[i] >= '1' && name[i] <= '9') {
					name = name.replace(name[i], romanize(+name[i]));
				}
			}
			request(name);
		}

		function request(name) {
			// console.time('a');
			const xhr = new XMLHttpRequest;
			const url = `https://isthereanydeal.com/game/${name}/history/${message.country}/?shop%5B%5D=steam&generate=Select+Stores`;
			xhr.open('GET', url);
			// xhr.timeout = 10;
			// xhr.ontimeout = function() {alert('cat!!')};
			xhr.onload = function(data) {
				try {
					// console.time('t');
					itadReady = 1;
					// console.timeEnd('a');
					// console.timeEnd('t');
					const dataArr = JSON.parse(this.response.match(/"Steam","data":(\[\[.+?\]\])/)[1]);
					// console.time('t');
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
					}
					// console.timeEnd('t');
					// console.timeEnd('a');
					response.data = dataArr;
					response.itadUrl = `https://isthereanydeal.com/game/${name}/info/${message.country}`;
					tryRespond();
				} catch (error) {}
			}
			xhr.send();

			// console.time('t');
		}

		function tryRespond() {
			if (itadReady && hltbReady) {
				sendResponse(response);
				console.timeEnd('t');
			}
		}
	}
);

// chrome.runtime.onInstalled.addListener(function() {
// 	chrome.storage.sync.set({
// 		region: 'us',
// 	});
// 	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
// 		chrome.declarativeContent.onPageChanged.addRules([{
// 			conditions: [new chrome.declarativeContent.PageStateMatcher({
// 				pageUrl: {
// 					urlContains: 'store.steampowered.com/app'
// 				},
// 			})],
// 			actions: [new chrome.declarativeContent.ShowPageAction()]
// 		}]);
// 	});
// });