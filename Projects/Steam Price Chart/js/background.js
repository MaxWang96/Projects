chrome.runtime.onMessage.addListener(
	(request, sender, sendResponse) => {
		const splittedUrl = request.url.split('/');
		const namePart = splittedUrl[5];
		const specialName = ['The_Forest'];
		let gameName;

		if (specialName.includes(namePart)) {
			gameName = namePart.replace(/_/g, '').toLowerCase();
			sendUrl(gameName);
		} else {
			if (request.region == 'cn') {
				// console.time('a');
				const id = splittedUrl[4];
				fetch(`https://store.steampowered.com/api/appdetails?appids=${id}&l=en&filters=basic`).then(function(response) {
					response.text().then(function(text) {
						gameName = text.match(/"name":"(.+?)"/)[1].toLowerCase().replace(/\bthe\b/, '').replace(/[^a-z0-9]+/g, '');
						sendUrl(gameName);
						// console.timeEnd('a');
					})
				})
			} else {
				gameName = namePart.replace(/(\b|_)the_/, '').replace(/_/g, '').toLowerCase();
				sendUrl(gameName);
			}
		}
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
							for (let j = dataArr.length - 2; j >= 0; j--) {
								if (dataArr[j + 1][0] - dataArr[j][0] <= 7200000) {
									if (dataArr[j + 1][1] >= dataArr[j][1]) {
										dataArr.splice(j - 1, 2);
									} else {
										dataArr.splice(j, 1);
									}
								} else if (dataArr[j + 1][0] - dataArr[j][0] <= 10800000) {
									dataArr.splice(j, 1);
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