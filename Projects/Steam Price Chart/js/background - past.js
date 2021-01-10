chrome.runtime.onMessage.addListener(
	(request, sender, sendResponse) => {
		const httpRequest = new XMLHttpRequest;
		const url = "https://www.steamprices.com/us/app/" + request.split('/')[4];
		httpRequest.open('GET', url);
		httpRequest.onload = function(data) {
			try {
				const dataArr = data.target.response.match(/data=\[\[(.+?)\]\]/)[1].split('],[').filter((data, idx) => idx % 2 == 0).map(data => data.match(/[0-9.]+/g));
				// const testArr = JSON.parse(JSON.stringify(dataArr));
				// const dataArr = data.target.response.match(/data=\[\[(.+?)\]\]/)[1].split('],[').map(data => data.match(/[0-9.]+/g));
				dataArr.forEach(data => data.forEach((data, idx, arr) => arr[idx] = +data));
				let startIdx;
				if (dataArr[0].length == 2) {
					startIdx = 1;
				} else {
					startIdx = 0;
				}
				for (; startIdx < dataArr.length; startIdx++) {
					if (dataArr[startIdx].length == 3) {
						dataArr[startIdx].splice(1, 1);
					} else if (dataArr[startIdx].length == 1) {
						dataArr.splice(startIdx, 1);
					}
				}
				sendResponse(dataArr);
			} catch (error) {}
		}
		httpRequest.send();
		return true;
	}
);