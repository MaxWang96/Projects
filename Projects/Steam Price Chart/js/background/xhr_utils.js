function request(name) {
	// console.time('a');
	const xhr = new XMLHttpRequest;
	const url = `https://isthereanydeal.com/game/${name}/history/${message.storeRegion}/?shop%5B%5D=steam&generate=Select+Stores`;
	xhr.open('GET', url);
	xhr.onload = function(data) {
		// console.time('t');
		itadReady = 1;
		// console.timeEnd('a');
		// console.timeEnd('t');
		let dataArr = JSON.parse(this.response.match(/"Steam","data":(\[\[.+?\]\])/)[1]);
		// console.log(dataArr);
		// console.time('bg');
		dataArr = duplicate(dataArr);

		newArr = [], len = dataArr.length, i = 1;
		const lastPoint = dataArr[len - 1].slice(),
			twoHours = 7200000,
			fourtySixHours = 165600000;
		if (dataArr[len - 1][1] != dataArr[len - 2][1] &&
			dataArr[len - 1][0] - dataArr[len - 2][0] <= twoHours) {
			dataArr.splice(len - 2, 1);
			len--;
		}
		dataArr[len - 1][0] += fourtySixHours;
		dataArr.push([dataArr[len - 1][0] + 172800000, dataArr[len - 1][1]]);
		let toCompare, [min, max] = [dataArr[0][1], dataArr[0][1]];
		while (i < len - 2) {
			if (dataArr[i + 1][0] - dataArr[i][0] <= twoHours &&
				dataArr[i + 3][0] - dataArr[i + 2][0] <= twoHours) {
				newArr.push(dataArr[i], dataArr[i + 3]);
				toCompare = dataArr[i][1];
				i += 4;
			} else if (dataArr[i + 1][0] - dataArr[i][0] <= fourtySixHours) {
				if (dataArr[i + 2][0] - dataArr[i + 1][0] <= fourtySixHours &&
					dataArr[i + 2][1] < dataArr[i + 1][1]) {
					newArr.push(dataArr[i + 2]);
					toCompare = dataArr[i + 2][1];
					i += 3;
				} else {
					if (dataArr[i - 1][1] != dataArr[i + 1][1]) {
						newArr.push(dataArr[i + 1]);
						toCompare = dataArr[i + 1][1];
					}
					i += 2;
				}
			} else {
				newArr.push(dataArr[i]);
				toCompare = dataArr[i][1];
				i++;
			}
			if (toCompare > max) {
				max = toCompare;
			} else if (toCompare < min) {
				min = toCompare;
			}
		}

		newArr.push(dataArr[i]);
		if (i == len - 2) newArr.push(lastPoint);
		dataArr = newArr;

		// console.timeEnd('bg');
		// console.timeEnd('a');

		response.data = {
			points: dataArr,
			range: [min, max],
		};
		response.itadUrl = `https://isthereanydeal.com/game/${name}/info/${message.storeRegion}`;
		if (message.bundle) {
			response.bundleTitle = this.response.match(/<h1 id='gameTitle'>.+?>(.+?)</)[1];
			// console.log(response.bundleTitle);
		}
		tryRespond();
	}
	xhr.send();

	// console.time('t');
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

function tryRespond() {
	if (itadReady && hltbReady) {
		clearTimeout(cantConnect);
		sendResponse(response);
		// console.timeEnd('t');
	}
}