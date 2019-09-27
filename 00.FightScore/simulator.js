const str2BigNumber = (str) => str ? BigNumber(str) : BigNumber(0);

var vApp = new Vue({
    el: '#main-box',
    components: {
        'simulator-table': {
            props: ['input'],
            template: `		<table class="fight-simulator" :class="input.scoreType"><tbody>
            <tr class="title"><th colspan="2">搭配计算面板名：<input class="table-name" type="text" v-model="input.scoreType" list="scoreType" @blur="refresh()" /></th><td colspan="2">
            <button @click="deleteTable()">删除</button><button @click="compareThis()">添加到对比</button><button @click="newTable()">从此模板生成</button></td></tr>
			<tr><th>基础搭配之力：</th><td><input type="number" v-model="input.base" @blur="refresh()" /></td><th>搭配之力基础倍率：</th><td>300.00%</td></tr>
			<tr><th>被动1加成倍率：</th><td><input type="number" v-model="input.passive1" step="0.1" class="percent" @blur="refresh()" />%</td><th>心之技能最终倍率：</th><td>{{input.percentAsForHeart.toFormat(2)}}%</td></tr>
			<tr><th>被动2加成倍率：</th><td><input type="number" v-model="input.passive2" step="0.1" class="percent" @blur="refresh()" />%</td><th>影之召唤最终倍率：</th><td>{{input.percentAsForShadow.toFormat(2)}}%</td></tr>
			<tr><th>被动3加成倍率：</th><td colspan="3"><input type="number" v-model="input.passive3" step="0.1" class="percent" @blur="refresh()" />%</td></tr>
			<tr><th>印象-心之技能倍率：</th><td><input type="number" v-model="input.imageHeart" step="0.1" class="percent" @blur="refresh()" />%</td><th>预测总倍率：</th><td class="result">{{input.allPercent.toFormat(2)}}%</td></tr>
			<tr><th>印象-影之召喚倍率：</th><td><input type="number" v-model="input.imageShadow" step="0.1" class="percent" @blur="refresh()" />%</td><th>预测总分：</th><td class="result">{{input.allPoint.toFormat(0)}}</td></tr>
			<tr><th>影之召唤倍率：</th><td><input type="number" v-model="input.shadow" step="1" class="percent" @blur="refresh()" />%</td><th>还原搭配之力：</th><td class="result">{{input.allPoint.dividedBy("5.1").toFormat(0)}}</td></tr>
			<tr><th>20s心之技能提升倍率：</th><td colspan="3"><input type="number" v-model="input.twentyHeart" step="0.1" class="percent" @blur="refresh()" />%</td></tr>
			<tr><th>10s心之技能提升倍率：</th><td><input type="number" v-model="input.tenHeart" step="0.1" class="percent" @blur="refresh()" />%</td><th>补给倍率：</th><td>110.00%</td></tr>
			<tr><th>大件魅力爆发次数（期望）：</th><td><input type="number" v-model="input.bigCriticalTimes" @blur="refresh()" /></td><th>补给后总分：</th><td>{{input.allPoint.times("1.1").toFormat(0)}}</td></tr>
			<tr><th>首饰魅力爆发次数（期望）：</th><td><input type="number" v-model="input.smallCriticalTimes" @blur="refresh()" /></td><th>补给后五次总分：</th><td class="result2">{{input.allPoint.times("5.5").toFormat(0)}}</td></tr>
            </tbody></table>`,
            updated: function () {
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
                    this.input.percentAsForHeart = this.$parent.calcPercentAsForHeart(this.input);
                    this.input.percentAsForShadow = this.$parent.calcPercentAsForShadow(this.input);
                    this.input.allPercent = this.$parent.calcAllPercent(this.input);
                    this.input.allPoint = this.$parent.calcAllPoint(this.input);
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
        tableData.forEach((e) => {
            e.percentAsForHeart = this.calcPercentAsForHeart(e);
            e.percentAsForShadow = this.calcPercentAsForShadow(e);
            e.allPercent = this.calcAllPercent(e);
            e.allPoint = this.calcAllPoint(e);
        });
        return {
            comparisonVsible: false,
            currentCompareFlag: false,
            currentCompareName: "",
            comparisonList: [],
            tableList: tableData,
            saveData: ""
        };
    },
    mounted: function () {
    },
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
            this.saveData = LZString.compressToEncodedURIComponent(JSON.stringify(this.tableList));
            setTimeout("document.querySelector('#savedata').select()", 300);
        },
        loadSaveData: function () {
            try {
                let tableData = JSON.parse(LZString.decompressFromEncodedURIComponent(this.saveData));
                tableData.forEach((e) => {
                    e.percentAsForHeart = this.calcPercentAsForHeart(e);
                    e.percentAsForShadow = this.calcPercentAsForShadow(e);
                    e.allPercent = this.calcAllPercent(e);
                    e.allPoint = this.calcAllPoint(e);
                });
                this.tableList = tableData;
                this.saveData = "";
            } catch (error) {
                alert("无效数据，读取失败。")
            }
        },
        /* 计算方法 */
        str2BigNumber:str2BigNumber,
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
            return input.percentAsForHeart.plus(input.percentAsForShadow).plus(300);
        },
        calcAllPoint: function (input) {
            return str2BigNumber(input.base).times(input.allPercent).dividedBy(100);
        },
        calcComparePercent: function (input) {
            return input.allPoint.dividedBy(this.comparisonList[0].allPoint).times(100);
        }
    }

});
