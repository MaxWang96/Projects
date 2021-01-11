chrome.runtime.onMessage.addListener(
	(request, sender, sendResponse) => {
		let gameName = request.url.split('/')[5].replace(/_/g, '').toLowerCase();

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

		if (request.cookie) {
			// const cookieRequest = new XMLHttpRequest;
			// cookieRequest.open('GET', `https://isthereanydeal.com/legal/cookies/${request.region}/?set`);
			// cookieRequest.onload = sendRequest;
			// cookieRequest.send();
			cookieRequest();
		} else {
			dataRequest();
		}
		return true;

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
					// const region = 
					// console.log(data.target);
					// console.time('t');
					const region = data.target.response.match(/<strong>\s*(.+?)\s*<\/strong>/)[1].toLowerCase();
					// console.timeEnd('t');
					if (region != request.region) {
						cookieRequest();
					} else {
						const dataArr = data.target.response.match(/"Steam","data":(\[\[.+?\]\])/)[1];
						console.log(dataArr.length);
						console.log(JSON.parse(dataArr));
						for (let j = 0; j < dataArr.length; j++) {
							if (dataArr[j][1] == null) {
								dataArr.splice(j, 1);
								console.log(dataArr);
							}
							console.log(dataArr);
						}
						console.log(dataArr);
						sendResponse(dataArr);
					}
				} catch (error) {}
			}
			xhr.send();
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