'use strict';

function requests(message, sender, sendResponse) {
	const itadCantConnect = setTimeout(() => {
			response.itadError = true;
			sendResponse(response);
		}, 3000),
		hltbCantConnect = setTimeout(() => {
			chrome.tabs.sendMessage(sender.tab.id, {
				hltbError: true
			});
		}, 5000);

	let name = message.name,
		[itadSent, hltbReady, receivedReg, receivedAlt] = [0, 0, 0, 0];
	const response = {};

	itad();
	hltb();

	return true;


	function itad() {
		if (!message.bundle) {
			fetch(`https://api.isthereanydeal.com/v02/game/plain/?key=2a0a6baa1713e7be64e451ab1b863b988ce63455&shop=steam&game_id=app%2F${message.id}`)
				.then(response => response.text())
				.then(text => {
					const gameName = text.match(/"plain":"(.+?)"/)[1];
					sendItadRequest(gameName);
				});
		} else {
			fetch(`https://isthereanydeal.com/steam/bundle/${message.id}/`, {
					method: 'HEAD'
				})
				.then(response => {
					const bundleName = response.url.split('/')[4];
					sendItadRequest(bundleName);
				});
		}
	}

	function sendItadRequest(name) {
		fetch(`https://isthereanydeal.com/game/${name}/history/${message.storeRegion}/?shop%5B%5D=steam&generate=Select+Stores`)
			.then(response => response.text())
			.then(text => {
				clearTimeout(itadCantConnect);
				let dataArr = JSON.parse(text.match(/"Steam","data":(\[\[.+?\]\])/)[1]);
				dataArr = duplicate(dataArr);
				response.data = abnormal(dataArr);
				response.itadUrl = `https://isthereanydeal.com/game/${name}/info/${message.storeRegion}`;
				if (message.bundle) {
					response.bundleTitle = text.match(/<h1 id='gameTitle'>.+?>(.+?)</)[1];
				}
				response.hltbReady = hltbReady ? true : false;
				itadSent = 1;
				sendResponse(response);
			})
	}

	function hltb() {
		if (!message.lang.startsWith('zh')) {
			if (message.lang.startsWith('en') || message.bundle) {
				sendHltbRequest();
			} else {
				fetch(`https://steamspy.com/api.php?request=appdetails&appid=${message.id}`)
					.then(response => response.text())
					.then(text => {
						const findName = text.match(/"name":"(.+?)"/);
						if (findName == null) {
							hltbReady = 1;
							if (itadSent) {
								clearTimeout(hltbCantConnect);
								chrome.tabs.sendMessage(sender.tab.id, {
									hltbError: true
								});
							}
						} else {
							name = findName[1];
							sendHltbRequest();
						}
					})
			}
		} else hltbReady = 1;
	}

	function sendHltbRequest() {
		hltbRequest(name, data => {
			receivedReg = 1;
			const getId = data.match(/href="(.+?)"/);
			if (getId != null) {
				response.hltbUrl = 'http://howlongtobeat.com/' + getId[1];
				hltbReady = 1;
			}
			if (receivedAlt) {
				hltbReady = 1;
			}
			tryMessage();
		});

		if (name.includes('Edition')) {
			const colonIdx = name.lastIndexOf(':'),
				dashIdx = name.lastIndexOf('-');
			if (colonIdx < dashIdx) {
				altRequest(dashIdx);
			} else if (colonIdx > dashIdx) {
				altRequest(colonIdx);
			} else {
				const spaceIdx = name.lastIndexOf(' ', name.lastIndexOf(' ') - 1);
				altRequest(spaceIdx);
			}
		} else {
			receivedAlt = 1;
		}
	}

	function altRequest(idx) {
		hltbRequest(name.slice(0, idx), data => {
			receivedAlt = 1;
			const getId = data.match(/href="(.+?)"/);
			if (getId != null) {
				response.hltbUrl = 'http://howlongtobeat.com/' + getId[1];
			}
			if (receivedReg) {
				hltbReady = 1;
			}
			tryMessage();
		})
	}

	function hltbRequest(gameName, callback) {
		const nameSend = gameName.replace('’', "'").replace(/[^\w\s:'-]/gi, '');
		fetch('https://howlongtobeat.com/search_results.php', {
				method: 'POST',
				headers: {
					'Content-type': 'application/x-www-form-urlencoded'
				},
				body: `queryString=${nameSend}&t=games&sorthead=popular&sortd='Normal Order'`
			}).then(response => response.text())
			.then(text => callback(text));
	}

	function tryMessage() {
		if (itadSent && hltbReady) {
			clearTimeout(hltbCantConnect);
			const hltbMessage = response.hltbUrl ? {
				hltbUrl: response.hltbUrl
			} : {
				hltbCantFind: true
			};
			chrome.tabs.sendMessage(sender.tab.id, hltbMessage);
		}
	}
}

function duplicate(arr) {
	const len = arr.length,
		tmpArr = [];
	let i = 0;
	while (i < len - 2) {
		if (arr[i][1] == null) {
			i++;
			continue;
		}
		tmpArr.push(arr[i]);
		if (arr[i][1] == arr[i + 1][1]) {
			i++;
		}
		i++;
	}
	tmpArr.push(arr[i], arr[i + 1]);
	return tmpArr;
}

function abnormal(arr) {
	let i = 1,
		len = arr.length,
		toCompare, [min, max] = [arr[0][1], arr[0][1]];
	const tmpArr = [arr[0]],
		lastPoint = arr[len - 1].slice(),
		twoHours = 7200000,
		fourtySixHours = 165600000;
	if (arr[len - 1][1] != arr[len - 2][1] &&
		arr[len - 1][0] - arr[len - 2][0] <= twoHours) {
		arr.splice(len - 2, 1);
		len--;
	}
	arr[len - 1][0] += fourtySixHours;
	arr.push([arr[len - 1][0] + 172800000, arr[len - 1][1]]);;
	while (i < len - 2) {
		if (arr[i + 1][0] - arr[i][0] <= twoHours &&
			arr[i + 3][0] - arr[i + 2][0] <= twoHours) {
			tmpArr.push(arr[i], arr[i + 3]);
			toCompare = arr[i][1];
			i += 4;
		} else if (arr[i + 1][0] - arr[i][0] <= fourtySixHours) {
			if (arr[i + 2][0] - arr[i + 1][0] <= fourtySixHours &&
				arr[i + 2][1] < arr[i + 1][1]) {
				tmpArr.push(arr[i + 2]);
				toCompare = arr[i + 2][1];
				i += 3;
			} else {
				if (arr[i - 1][1] != arr[i + 1][1]) {
					tmpArr.push(arr[i + 1]);
					toCompare = arr[i + 1][1];
				}
				i += 2;
			}
		} else {
			tmpArr.push(arr[i]);
			toCompare = arr[i][1];
			i++;
		}
		if (toCompare > max) {
			max = toCompare;
		} else if (toCompare < min) {
			min = toCompare;
		}
	}
	tmpArr.push(arr[i]);
	if (i == len - 2) tmpArr.push(lastPoint);
	return {
		points: tmpArr,
		range: [min, max],
	};
}