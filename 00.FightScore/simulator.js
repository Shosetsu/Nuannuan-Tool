const str2BigNumber = (str) => str ? BigNumber(str) : BigNumber(0);

var vApp = new Vue({
    el: '#main-box',
    components: {
        'simulator-table': {
            props: ['input'],
            template: `		<table class="fight-simulator" :class="input.scoreType"><tbody><span style='display:none'>{{input.id}}</span>
            <tr class="title"><th colspan="4"><span>搭配计算面板名：<input class="table-name" type="text" v-model="input.scoreType" list="scoreType" @blur="saveAllData()" /></span>
            <button @click="deleteTable(input.id)">删除</button><button>添加到对比</button><button @click="newTable(input)">从此模板生成</button></th></tr>
			<tr><th>基础搭配之力：</th><td><input type="number" v-model="input.base" @blur="saveAllData()" /></td><th>搭配之力基础倍率：</th><td>300.00%</td></tr>
			<tr><th>被动1加成倍率：</th><td><input type="number" v-model="input.passive1" step="0.1" class="percent" @blur="saveAllData()" />%</td><th>心之技能最终倍率：</th><td>{{percentAsForHeart.toFormat(2)}}%</td></tr>
			<tr><th>被动2加成倍率：</th><td><input type="number" v-model="input.passive2" step="0.1" class="percent" @blur="saveAllData()" />%</td><th>影之召唤最终倍率：</th><td>{{percentAsForShadow.toFormat(2)}}%</td></tr>
			<tr><th>被动3加成倍率：</th><td colspan="3"><input type="number" v-model="input.passive3" step="0.1" class="percent" @blur="saveAllData()" />%</td></tr>
			<tr><th>印象-心之技能倍率：</th><td><input type="number" v-model="input.imageHeart" step="0.1" class="percent" @blur="saveAllData()" />%</td><th>预测总倍率：</th><td class="result">{{allPercent.toFormat(2)}}%</td></tr>
			<tr><th>印象-影之召喚倍率：</th><td><input type="number" v-model="input.imageShadow" step="0.1" class="percent" @blur="saveAllData()" />%</td><th>预测总分：</th><td class="result">{{allPoint.toFormat(0)}}</td></tr>
			<tr><th>影之召唤倍率：</th><td colspan="3"><input type="number" v-model="input.shadow" step="1" class="percent" @blur="saveAllData()" />%</td></tr>
			<tr><th>20s心之技能提升倍率：</th><td colspan="3"><input type="number" v-model="input.twentyHeart" step="0.1" class="percent" @blur="saveAllData()" />%</td></tr>
			<tr><th>10s心之技能提升倍率：</th><td><input type="number" v-model="input.tenHeart" step="0.1" class="percent" @blur="saveAllData()" />%</td><th>补给倍率：</th><td>110%</td></tr>
			<tr><th>大件魅力爆发次数（期望）：</th><td><input type="number" v-model="input.bigCriticalTimes" @blur="saveAllData()" /></td><th>补给后总分：</th><td>{{allPoint.times("1.1").toFormat(0)}}</td></tr>
			<tr><th>首饰魅力爆发次数（期望）：</th><td><input type="number" v-model="input.smallCriticalTimes" @blur="saveAllData()" /></td><th>补给后五次总分：</th><td class="result2">{{allPoint.times("5.5").toFormat(0)}}</td></tr>
            </tbody></table>`,
            computed: {
                percentAsForHeart: function () {
                    let base = str2BigNumber("70");
                    let passive = str2BigNumber(this.input.passive1).plus(str2BigNumber(this.input.passive2)).plus(str2BigNumber(this.input.passive3));
                    let critical = str2BigNumber(this.input.bigCriticalTimes).times("6.25").plus(str2BigNumber(this.input.smallCriticalTimes).times("3.25"));
                    let image = str2BigNumber(this.input.imageHeart).times("0.01").plus(1);
                    return (base.plus(passive).plus(critical)).times(image).times(3);
                },
                percentAsForShadow: function () {
                    let base = str2BigNumber(this.input.shadow);
                    let proactive = str2BigNumber(this.input.twentyHeart).times("0.51").plus(str2BigNumber(this.input.tenHeart).times("0.38"));
                    let image = str2BigNumber(this.input.imageShadow).times("0.01").plus(1);
                    return (base.plus(proactive)).times(image).times(3);
                },
                allPercent: function () {
                    return this.percentAsForHeart.plus(this.percentAsForShadow).plus(300);
                },
                allPoint: function () {
                    return str2BigNumber(this.input.base).times(this.allPercent).dividedBy(100);
                }
            },
            methods: {
                newTable: function (info = {}) {
                    this.$parent.newTable(info);
                },
                deleteTable: function (id) {
                    this.$parent.deleteTable(id);
                },
                saveAllData:function(){
                    this.$parent.saveAllData();
                }

            }
        }
    },
    data: function () {
        return {
            tableList:getLocalSession("FightScoreTableSaveData",[]) 
        };
    },
    methods: {
        newTable: function (info = {}) {
            this.tableList.push(Object.assign({ id: Math.floor(Math.random() * 10000000) }, info));
            this.saveAllData();
        },
        deleteTable: function (id) {
            this.tableList.some((v, i) => {
                if (v.id == id) {
                    this.tableList.splice(i, 1);
                    return true;
                }
                return false;
            })
            this.saveAllData();
        },
        saveAllData: function () {
            localStorage.setItem("FightScoreTableSaveData", JSON.stringify(this.tableList));
        }
    }

});
