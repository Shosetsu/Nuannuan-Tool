const projectName = "Nuannuan-Tool";
const requireZero = (number, index = 2) => ("00" + number).slice(-index);
const getDom = (selector = 'html') => document.querySelector(selector);
const getDoms = (selector = 'html') => document.querySelectorAll(selector);
const screenId = function () {
	let href = document.location.href;
	//return href.substring(href.lastIndexOf(projectName)).replace(projectName,"..");
	return href;
}();
const appId = screenId.match(/\d+\.([a-zA-Z0-9]*)\//)[1];
const getSession = (key, defalut) => {
	let data = sessionStorage.getItem(key);
	if (!data) {
		let defalutData = eval(defalut);
		sessionStorage.setItem(key, JSON.stringify(defalutData))
		return defalutData;
	}
	return JSON.parse(data);
}
const getLocalSession = (key, defalut) => {
	let data = localStorage.getItem(key);
	if (!data) {
		let defalutData = eval(defalut);
		localStorage.setItem(key, JSON.stringify(defalutData))
		return defalutData;
	}
	return JSON.parse(data);
}
function getDate(date) {
	if (!date) date = new Date();
	return date.getFullYear() + "/" + requireZero(date.getMonth() + 1) + "/" + requireZero(date.getDate());
}

function getTime(date) {
	if (!date) date = new Date();
	return getDate(date) + " " + requireZero(date.getHours()) + ":" + requireZero(date.getMinutes()) + ":" + requireZero(date.getSeconds());
}
function getElapsedDate(date1, date2) {
	return Math.floor((date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24));
}

function sortObjectList(objectList, sortKey, sortConfig) {
	if (!objectList) return;
	if (!sortConfig) return objectList;
	if (sortKey) sortKey = "." + sortKey;

	let levels = [];
	let newObject = {};
	for (let key in objectList) {
		levels.push(eval("objectList." + key + sortKey));
	}
	sortArrayList(levels, sortConfig);
	levels.forEach(function (level) {
		for (let key in objectList) {
			if (level == objectList[key]["level"]) {
				newObject[key] = objectList[key];
				break;
			}
		}
	});
	return newObject;
}

function sortArrayList(arrayList, sortConfig) {
	if (sortConfig.toLowerCase() === "desc") {
		arrayList.sort(((a, b) => a < b));
	} else if (sortConfig.toLowerCase() === "asc") {
		arrayList.sort(((a, b) => a > b));
	}
	return arrayList;
}

function openLink(repositoryName, linkType, redirect = true) {
	if (typeof (repositoryName) !== "string") return;
	if (!redirect) {
		return document.location.href = repositoryName;
	} else {
		if (repositoryName.indexOf("\:\/\/") == -1)
			repositoryName = "http://" + repositoryName;
	}

	if (linkType && linkType.toLowerCase() === "github") {
		return window.open("https://github.com/Shosetsu/" + repositoryName, "github");
	} else if (typeof (repositoryName) === "string") {
		return window.open(repositoryName);
	}

}