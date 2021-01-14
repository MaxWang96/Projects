'use strict';

chrome.runtime.onMessage.addListener(
	(message, sender, sendResponse) => {
		const splittedUrl = message.url.split('/');
		const id = splittedUrl[4];
		const name = splittedUrl[5];

		if (name[0] != '_') {
			sendUrl(name.replace(/(\b|_)the_/g, '').replace(/_/g, '').toLowerCase());
		}

		// console.time('t');
		const idRequest = new XMLHttpRequest;
		idRequest.open('GET', `https://api.isthereanydeal.com/v02/game/plain/?key=2a0a6baa1713e7be64e451ab1b863b988ce63455&shop=steam&game_id=app%2F${id}`);
		idRequest.onload = function() {
			const gameName = this.response.match(/"plain":"(.+?)"/)[1];
			request(gameName);	
		}
		idRequest.send();

		const hltbRequest = new XMLHttpRequest;
		const url = 'https://howlongtobeat.com/search_results.php';
		const params = 'queryString=Hades&t=games&sorthead=popular&sortd=Normalorder';
		hltbRequest.open('POST', url, true);
		hltbRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		hltbRequest.onload = function() {
			console.log(this.response);
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
			const xhr = new XMLHttpRequest;
			const url = `https://isthereanydeal.com/game/${name}/history/${message.country}`;
			xhr.open('GET', url);
			// xhr.timeout = 10;
			// xhr.ontimeout = function() {alert('cat!!')};
			xhr.onload = function(data) {
				try {
					// console.time('t');
					const region = this.response.match(/<strong>\s*(.+?)\s*<\/strong>/)[1].toLowerCase();
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
					sendResponse({data: dataArr, link: url.replace('/history/','/info/')});
				} catch (error) {}
			}
			xhr.send();

			// console.time('t');
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