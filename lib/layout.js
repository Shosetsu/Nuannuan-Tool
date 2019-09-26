/*Common Function*/
const updateHistory = () => {
	let data = localStorage["history"];
	data = !data ? [] : JSON.parse(data);

	data.unshift(screenId);
	data = data.filter((x, i, self) => self.indexOf(x) === i);
	localStorage["history"] = JSON.stringify(data.slice(0, 5));
}
const clearHistory = () => {
	delete localStorage["history"];
	navi_vm.tempHistoryData = "";
}
updateHistory();
/*Navi Bar*/
var navi_vm = null;
window.onload = () => {

	let navi_obj = document.createElement("div");
	navi_obj.setAttribute('class', 'navi-bar-box');
	let template = document.createElement('navi-bar');
	template.setAttribute('v-bind:history', 'historyData');
	navi_obj.appendChild(template);
	document.body.append(navi_obj);

	navi_vm = new Vue({
		el: '.navi-bar-box',
		components: {
			'navi-bar': {
				props: ['history'],
				template: `<div class='navi-bar'>
				<button onclick='openLink(\"../index.html\",null,false)'>Back to List</button><button v-for='bean in history' :onclick='"openLink(\\\""+bean.link+"\\\",null,false)"'>{{bean.label}}</button><button onclick='clearHistory()'>Clear History</button>
				</div>`
			}
		},
		data: function () {
			return {
				tempHistoryData: localStorage.history
			};
		},
		computed: {
			historyData: function () {
				if (!this.tempHistoryData) return {};
				let data = JSON.parse(this.tempHistoryData);
				let historylist = [];
				for (item of data) {
					let label = item.match(/\d+\.([a-zA-Z0-9]*)\//)[1];
					let history = {
						label: label ? label : '',
						link: item
					};
					historylist.push(history);
				}
				return historylist;
			}
		}
	});
}