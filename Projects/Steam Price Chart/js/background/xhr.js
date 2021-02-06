'use strict';

function requests(message, sender, sendResponse) {
	const cantConnect = setTimeout(() => {
		response.error = [itadReady, hltbReady];
		sendResponse(response);
	}, 9000);

	let name = message.name,
		itadReady = 0,
		hltbReady = 0,
		receivedReg = 0,
		receivedAlt = 0;
	const response = {
		hltbUrl: 'https://howlongtobeat.com/'
	};

	itad();
	hltb();
	return true;


	function itad() {
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
	}

	function hltb() {
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
	}

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

	function request(name) {
		// console.time('a');
		const xhr = new XMLHttpRequest;
		const url = `https://isthereanydeal.com/game/${name}/history/${message.storeRegion}/?shop%5B%5D=steam&generate=Select+Stores`;
		xhr.open('GET', url);
		xhr.onload = function(data) {
			itadReady = 1;
			let dataArr = JSON.parse(this.response.match(/"Steam","data":(\[\[.+?\]\])/)[1]);
			dataArr = duplicate(dataArr);
			response.data = abnormal(dataArr);
			response.itadUrl = `https://isthereanydeal.com/game/${name}/info/${message.storeRegion}`;
			if (message.bundle) {
				response.bundleTitle = this.response.match(/<h1 id='gameTitle'>.+?>(.+?)</)[1];
			}
			tryRespond();
		}
		xhr.send();
	}

	function tryRespond() {
		if (itadReady && hltbReady) {
			clearTimeout(cantConnect);
			sendResponse(response);
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
	const tmpArr = [],
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

function hltbRequest(gameName, onloadFunc) {
	const name = gameName.replace('’', "'").replace(/[^\w\s:'-]/gi, '');
	const xhr = new XMLHttpRequest;
	const url = 'https://howlongtobeat.com/search_results.php';
	const params = `queryString=${name}&t=games&sorthead=popular&sortd='Normal Order'`;
	xhr.open('POST', url, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = onloadFunc;
	xhr.send(params);
}