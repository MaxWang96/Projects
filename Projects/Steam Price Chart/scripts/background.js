chrome.runtime.onMessage.addListener(
	(request, sender, sendResponse) => {
		const httpRequest = new XMLHttpRequest;
		let gameName = request.split('/')[5].replace(/_/g, '').toLowerCase();
		function romanize(num) {
			const key = ['', 'i','ii','iii','iv','v','vi','vii','viii','ix'];
    		return key[num] + '';
		}
		for (let i = 0; i < gameName.length; i++) {
			if (gameName[i] >= '1' && gameName[i] <= '9') {
				gameName = gameName.replace(gameName[i], romanize(+gameName[i]));
			}
		}
		const url = `https://isthereanydeal.com/game/${gameName}/history/`;
		httpRequest.open('GET', url);
		httpRequest.onload = function(data) {
			try {
				const dataArr = data.target.response.match(/"Steam","data":(\[\[.+?\]\])/)[1];
				// const testArr = JSON.parse(JSON.stringify(dataArr));
				// const dataArr = data.target.response.match(/data=\[\[(.+?)\]\]/)[1].split('],[').map(data => data.match(/[0-9.]+/g));
				sendResponse(dataArr);
			} catch (error) {}
		}
		httpRequest.send();
		return true;
	}
);