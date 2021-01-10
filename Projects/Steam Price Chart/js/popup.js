// const regionUser = chrome.storage.sync.get('region');
// document.body.insertAdjacentHTML('afterbegin', `
// 	Region: <select id="region" selected=>
//         <option value="US">US</option>
//         <option value="CN">CN</option>
//     </select>
//     `);

chrome.storage.sync.get('region', function(value) {
	const regionArr = ['US', 'CN'];
	console.log(value.region);
	let regionUser = value.region;
	let idx = 0;
	for (let i = 0; i < regionArr.length; i++) {
		if (regionArr[i] == regionUser) {
			idx = i;
		}
	}
	document.getElementsByTagName('option')[idx].setAttribute('selected', true);
});


// function getRegion(value) {
// 	regionUser = value.region;
// }

const regionOpt = document.getElementById('region');

function save_options() {
	const regionVal = regionOpt.value;
	console.log('hello');
	chrome.storage.sync.set({
		region: regionVal
	}, function() {
		const status = document.getElementById('status');
		status.textContent = 'Options saved.';
		setTimeout(() => {
			status.textContent = '';
		}, 1000);
	});
}

document.addEventListener('change', save_options);