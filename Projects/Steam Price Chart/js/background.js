// console.log(romaji.fromKana('セレクション'));

chrome.runtime.onMessage.addListener(
	(request, sender, sendResponse) => {
		const splittedUrl = request.url.split('/');
		const namePart = splittedUrl[5];
		const specialName = ['The_Forest', 'Tom_Clancys_Rainbow_Six_Siege'];
		let gameName;
		const id = splittedUrl[4];

		// if (namePart == specialName[0]) {
		// 	gameName = namePart.replace(/_/g, '').toLowerCase();
		// 	sendUrl(gameName);
		// } else if (namePart == specialName[1]) {
		// 	sendUrl('tomclancysrainbowsixsiegestarteredition');
		// } else {
		// 	if (request.lang == 'schinese') {
		// 		// console.time('a');
		// 		const id = splittedUrl[4];
		// 		fetch(`https://store.steampowered.com/api/appdetails?appids=${id}&l=en&filters=basic`).then(function(response) {
		// 			response.text().then(function(text) {
		// 				gameName = text.match(/"name":"(.+?)"/)[1].toLowerCase().replace(/\bthe\b/g, '').replace(/[^a-z0-9]+/g, '');
		// 				sendUrl(gameName);
		// 				// console.timeEnd('a');
		// 			})
		// 		})
		// 		const pinyinName = Pinyin.convertToPinyin(request.name).toLowerCase().replace(/\bthe\b/g, '').replace(/[^a-z0-9]+/g, '').replace(/v/g, 'u');
		// 		sendUrl(pinyinName);
		// 		testSearch();
		// 	} else {
		// 		gameName = namePart.replace(/(\b|_)the_/g, '').replace(/_/g, '').toLowerCase();
		// 		sendUrl(gameName);
		// 		// testSearch();
		// 	}
		// }
		// console.time('t');
		// const tq = new XMLHttpRequest;
		// tq.open('HEAD', `https://isthereanydeal.com/steam/app/${id}/`);
		// tq.onreadystatechange = function() {
		// 	if (tq.readyState == 2) {
		// 		// console.timeEnd('t');
		// 		// console.log('cat');
		// 		const url = this.responseURL.replace('/info/', '/history/');
		// 		requests(url);
		// 	}
		// };
		// tq.send();

		console.time('a');
		const tt = new XMLHttpRequest;
		tt.open('GET', `https://api.isthereanydeal.com/v02/game/plain/?key=2a0a6baa1713e7be64e451ab1b863b988ce63455&shop=steam&game_id=app%2F359550`);
		tt.onload = function() {
			console.timeEnd('a');
			console.log('cat');
		};
		tt.send();


		return true;

		function testSearch() {
			fetch(`https://isthereanydeal.com/search/?q=${request.cartName}`).then(function(response) {
				response.text().then(function(text) {
					const test = text.match(/'card__title' href='\/game\/(.+?)\/info\//)[1];
					sendUrl(test);
				})
			})
		}

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
			const url = `https://isthereanydeal.com/game/${name}/history/`;
			requests(url);
		}

		function requests(url) {
			if (request.cookie) {
				cookieRequest();
			} else {
				dataRequest();
			}

			function cookieRequest() {
				const cookieRequest = new XMLHttpRequest;
				cookieRequest.open('GET', `https://isthereanydeal.com/legal/cookies/${request.region}/?set`);
				cookieRequest.onload = dataRequest;
				cookieRequest.send();
			}

			function dataRequest() {
				const xhr = new XMLHttpRequest;
				xhr.open('GET', url);
				// xhr.timeout = 10;
				// xhr.ontimeout = function() {alert('cat!!')};
				xhr.onload = function(data) {
					try {
						// console.time('t');
						const region = this.response.match(/<strong>\s*(.+?)\s*<\/strong>/)[1].toLowerCase();
						// console.timeEnd('t');
						if (region != request.region) {
							cookieRequest();
						} else {
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
								} else if (dataArr[j + 1][0] - dataArr[j][0] <= 14400000) {
									dataArr.splice(j, 1);
								}
							}
							// console.timeEnd('t');
							// console.log(dataArr);
							sendResponse(dataArr);
						}
					} catch (error) {}
				}
				xhr.send();

				// console.time('t');
			}
		}
	}
);

chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({
		region: 'us',
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