const str2BigNumber = (str) => str ? BigNumber(str) : BigNumber(0);
const resizeWindow = () => {
    if (window.innerWidth >= window.innerHeight && window.innerWidth >= 1200) {
        if (window.innerWidth >= 1900) {
            window.document.body.classList = "big-wide";
        } else {
            window.document.body.classList = "wide";
        }
    } else {
        window.document.body.classList = "";
    }
};
window.onresize = resizeWindow;
resizeWindow();
/*Application*/
var vApp = new Vue({
    el: '#main-box',
    components: {
        'simulator-table': {
            props: ['input'],
            template: `		<table class="fight-simulator" :class="scoreClass"><tbody>
            <tr class="title"><th colspan="2">搭配计算面板名<input class="table-name" type="text" v-model="input.scoreType" list="scoreType" @blur="refresh()" /></th><td colspan="2">
            <button @click="deleteTable()">删除</button><button @click="compareThis()">添加到对比</button><button @click="newTable()">从此模板生成</button></td></tr>
			<tr><th>基础搭配之力：</th><td><input type="number" v-model="input.base" @blur="refresh()" /></td><th>搭配之力基础倍率：</th><td>300.00 %</td></tr>
			<tr><th>被动1加成倍率：</th><td><input type="number" v-model="input.passive1" step="0.1" class="percent" @blur="refresh()" />%</td><th>心之技能最终倍率：</th><td>{{percentAsForHeart.toFormat(2)}} %</td></tr>
			<tr><th>被动2加成倍率：</th><td><input type="number" v-model="input.passive2" step="0.1" class="percent" @blur="refresh()" />%</td><th>影之召唤最终倍率：</th><td>{{percentAsForShadow.toFormat(2)}} %</td></tr>
			<tr><th>被动3加成倍率：</th><td colspan="3"><input type="number" v-model="input.passive3" step="0.1" class="percent" @blur="refresh()" />%</td></tr>
			<tr><th>印象-心之技能倍率：</th><td><input type="number" v-model="input.imageHeart" step="0.1" class="percent" @blur="refresh()" />%</td><th>预测总倍率：</th><td class="result">{{allPercent.toFormat(2)}} %</td></tr>
			<tr><th>印象-影之召喚倍率：</th><td><input type="number" v-model="input.imageShadow" step="0.1" class="percent" @blur="refresh()" />%</td><th>预测总分：</th><td class="result">{{allPoint.toFormat(0)}}</td></tr>
			<tr><th>影之召唤倍率：</th><td><input type="number" v-model="input.shadow" step="1" class="percent" @blur="refresh()" />%</td><th>还原搭配之力：</th><td class="result3">{{allPoint.dividedBy("6").toFormat(0)}}</td></tr>
			<tr><th>20s心之技能提升倍率：</th><td><input type="number" v-model="input.twentyHeart" step="0.1" class="percent" @blur="refresh()" />%</td><th>还原三卡搭配之力：</th><td class="result3">{{allPoint.dividedBy("8").toFormat(0)}}</td></tr>
			<tr><th>10s心之技能提升倍率：</th><td><input type="number" v-model="input.tenHeart" step="0.1" class="percent" @blur="refresh()" />%</td><th></th><td></td></tr>
			<tr><th>大件魅力爆发期望：</th><td><input type="text" v-model="input.bigCriticalTimes" list="bigCirt" @blur="refresh()" /></td><th>补给后总分：</th><td>{{allPoint.times("1.1").toFormat(0)}}</td></tr>
			<tr><th>首饰魅力爆发期望：</th><td><input type="text" v-model="input.smallCriticalTimes" list="smallCirt" @blur="refresh()" /></td><th>补给后五次总分：</th><td class="result2">{{allPoint.times("5.5").toFormat(0)}}</td></tr>
            </tbody></table>`,
            computed: {
                scoreClass: function () {
                    let scoreType = this.input.scoreType;
                    if (!scoreType) return "";
                    if (scoreType.indexOf("典雅") != -1) return "dianya";
                    if (scoreType.indexOf("清新") != -1) return "qingxin";
                    if (scoreType.indexOf("甜美") != -1) return "tianmei";
                    if (scoreType.indexOf("帅气") != -1) return "shuaiqi";
                    if (scoreType.indexOf("性感") != -1) return "xinggan";
                    return "";
                },
                percentAsForHeart: function () { return this.$parent.calcPercentAsForHeart(this.input) },
                percentAsForShadow: function () { return this.$parent.calcPercentAsForShadow(this.input) },
                allPercent: function () { return this.$parent.calcAllPercent(this.input) },
                allPoint: function () { return this.$parent.calcAllPoint(this.input) }
            },
            mounted: function () {
                //this.refresh();
            },
            methods: {
                newTable: function () {
                    this.$parent.newTable(this.input);
                },
                deleteTable: function () {
                    this.$parent.deleteTable(this.input);
                },
                refresh: function () {
                    this.$parent.saveAllData();
                },
                compareThis: function () {
                    this.$parent.compareThis(this.input);
                }
            }
        }
    },
    data: function () {
        let tableData = getLocalSession("FightScoreTableSaveData", []);
        return {
            comparisonVsible: false,
            currentCompareFlag: false,
            currentCompareName: "",
            comparisonList: [],
            tableList: tableData,
            saveData: ""
        };
    },
    mounted: function () { },
    computed: {
        sortedComparisonList: function () {
            return this.comparisonList.sort(function (a, b) {
                return b.allPoint - a.allPoint;
            });
        }
    },
    methods: {
        newTable: function (info = {}) {
            this.tableList.push(
                Object.assign(Object.assign({}, info), { id: Math.floor(Math.random() * 10000000) })
            );
            this.saveAllData();
        },
        deleteTable: function (input) {
            let index = this.tableList.indexOf(input);
            this.tableList.splice(index, 1);
            this.saveAllData();
            index = this.comparisonList.indexOf(input);
            this.deleteCompare(index);
        },
        saveAllData: function () {
            localStorage.setItem("FightScoreTableSaveData", JSON.stringify(this.tableList));
        },
        compareThis: function (info) {
            if (this.comparisonList.indexOf(info) == -1) {
                this.currentCompareName = info.scoreType;
                this.currentCompareFlag = true;
                this.comparisonList.push(info);
                setTimeout('Vue.set(vApp,"currentCompareFlag",false)', 1500);
            }
        },
        deleteCompare: function (index) {
            this.comparisonList.splice(index, 1);
        },
        getSaveData: function () {
            let saveData = "";
            this.tableList.forEach((e, i) => {
                saveData = saveData + e.id + "\;" + e.scoreType + "\;" + e.base + "\;" + e.passive1 + "\;" + e.passive2 + "\;" + e.passive3 + "\;"
                    + e.imageHeart + "\;" + e.imageShadow + "\;" + e.shadow + "\;" + e.twentyHeart + "\;" + e.tenHeart + "\;"
                    + e.bigCriticalTimes + "\;" + e.smallCriticalTimes;
                if (i != this.tableList.length - 1) {
                    saveData = saveData + "|";
                }
            });

            this.saveData = LZString.compressToEncodedURIComponent(saveData.replace(/(undefined)/g,""));
            setTimeout("document.querySelector('#savedata').select()", 300);
        },
        loadSaveData: function () {
            try {
                let saveUnDataList = LZString.decompressFromEncodedURIComponent(this.saveData).replace(/(undefined)/g,"").split("|");
                let tableDataList = [];

                saveUnDataList.forEach((e) => {
                    let oneData = e.split("\;");
                    let tableData = {
                        id: oneData[0], scoreType: oneData[1], base: oneData[2], passive1: oneData[3], passive2: oneData[4], passive3: oneData[5],
                        imageHeart: oneData[6], imageShadow: oneData[7], shadow: oneData[8], twentyHeart: oneData[9], tenHeart: oneData[10],
                        bigCriticalTimes: oneData[11], smallCriticalTimes: oneData[12]
                    };
                    tableDataList.push(tableData);
                });

                this.tableList = tableDataList;
                this.saveData = "";
                this.saveAllData();
            } catch (error) {
                alert("无效数据，读取失败。")
            }
        },
        /* 计算方法 */
        str2BigNumber: str2BigNumber,
        calcPercentAsForHeart: function (input) {
            let base = str2BigNumber("70");
            let passive = str2BigNumber(input.passive1).plus(str2BigNumber(input.passive2)).plus(str2BigNumber(input.passive3));
            let critical = str2BigNumber(input.bigCriticalTimes).times("6.25").plus(str2BigNumber(input.smallCriticalTimes).times("3.25"));
            let image = str2BigNumber(input.imageHeart).times("0.01").plus(1);
            return (base.plus(passive).plus(critical)).times(image).times(3);
        },
        calcPercentAsForShadow: function (input) {
            let base = str2BigNumber(input.shadow);
            let proactive = str2BigNumber(input.twentyHeart).times("0.51").plus(str2BigNumber(input.tenHeart).times("0.38"));
            let image = str2BigNumber(input.imageShadow).times("0.01").plus(1);
            return (base.plus(proactive)).times(image).times(3);
        },
        calcAllPercent: function (input) {
            return this.calcPercentAsForHeart(input).plus(this.calcPercentAsForShadow(input)).plus(300);
        },
        calcAllPoint: function (input) {
            return str2BigNumber(input.base).times(this.calcAllPercent(input)).dividedBy(100);
        },
        calcComparePercent: function (input) {
            return this.calcAllPoint(input).dividedBy(this.calcAllPoint(this.comparisonList[0])).times(100);
        }
    }

});