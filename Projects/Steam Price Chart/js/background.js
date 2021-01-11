chrome.runtime.onMessage.addListener(
	(request, sender, sendResponse) => {
		const splittedUrl = request.url.split('/');
		const namePart = splittedUrl[5];

		if (namePart[0] == '_') {
			const id = splittedUrl[4];
			const getName = new XMLHttpRequest;
			getName.open('GET', `https://store.steampowered.com/api/appdetails?appids=${id}`);
			getName.mozAnon = true;
			getName.onload = function(gameData) {
				const name = gameData.target.response.match(/"name":"(.+?)"/)[1];
				console.log(name);
			}
			getName.send();
		} else {
			let gameName = namePart.replace(/_/g, '').toLowerCase();

			function romanize(num) {
				const key = ['', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix'];
				return key[num] + '';
			}
			for (let i = 0; i < gameName.length; i++) {
				if (gameName[i] >= '1' && gameName[i] <= '9') {
					gameName = gameName.replace(gameName[i], romanize(+gameName[i]));
				}
			}
			const url = `https://isthereanydeal.com/game/${gameName}/history/`;
			requests(url);
			return true;
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
				xhr.onload = function(data) {
					try {
						// console.time('t');
						const region = data.target.response.match(/<strong>\s*(.+?)\s*<\/strong>/)[1].toLowerCase();
						// console.timeEnd('t');
						if (region != request.region) {
							cookieRequest();
						} else {
							const dataArr = JSON.parse(data.target.response.match(/"Steam","data":(\[\[.+?\]\])/)[1]);
							// console.time('t');
							for (let i = dataArr.length - 3; i >= 0; i--) {
								if (dataArr[i][1] == null) {
									dataArr.splice(i, 1);
								}
								if (dataArr[i + 1][1] == dataArr[i][1]) {
									dataArr.splice(i + 1, 1);
								}
							}
							for (let j = dataArr.length - 2; j >= 0; j--) {
								if (dataArr[j + 1][0] - dataArr[j][0] <= 7200000) {
									if (dataArr[j + 1][1] >= dataArr[j][1]) {
										dataArr.splice(j - 1, 2);
									} else {
										dataArr.splice(j, 1);
									}
								}
							}
							// console.timeEnd('t');
							// console.log(dataArr);
							sendResponse(JSON.stringify(dataArr));
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