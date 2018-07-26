var ms = require('ms');
var FramesJs = require('FramesJs');
var fightData = require('fightData');
var GameJs = require('GameJs');
cc.Class({
    extends: cc.Component,

    properties: {
        //取得怪物所有头像脚本
        FramesJs: {
            default: null,
            type: FramesJs
        },
        //取得游戏主逻辑脚本，用于生成怪物
        GameJs: {
            default: null,
            type: GameJs
        },
        //怪物头像
        monsterPortrait: {
            default: null,
            type: cc.Sprite
        },
        //召唤数量
        summonNum: {
            default: null,
            type: cc.Label
        },
        //选择的分组
        groupNum: {
            default: null,
            type: cc.Label
        },
        //取得怪物列表父节点
        monsterListContent: {
            default: null,
            type: cc.Node
        },
        //怪物列表的头像预制体
        monsterListPortrait: {
            default: null,
            type: cc.Prefab
        },
    },

    // use this for initialization
    init (num, summonStationDataControl) {
        this.num = num;
        this.team = summonStationDataControl.team;
        this.position = summonStationDataControl.node.position;
        this.summonStationDataControl = summonStationDataControl;
        //召唤数量,范围:1-10个
        this.summonNumber = 1;
        //分组编号,范围:1-8组
        this.groupNumber = 1;
        //ui界面显示
        this.monsterPortrait.spriteFrame = this.FramesJs.bMonsterPortrait[num - 1];
        this.summonNum.string = this.summonNumber;
        this.groupNum.string = this.groupNumber;
        //显示怪物头像列表
        this.createMonsterPortrait(this.groupNumber);
    },

    //根据怪物编号生成对应的头像节点并加入怪物列表里面
    createMonsterPortrait (groupNumber) {
        this.monsterListContent.removeAllChildren();
        for(var i = 0; i < fightData.selfGroup[groupNumber -1].length; i++){
            var monsterNum = fightData.selfGroup[groupNumber -1][i].num;
            var monsterPortrait = cc.instantiate(this.monsterListPortrait);
            monsterPortrait.getComponent(cc.Sprite).spriteFrame = this.FramesJs.bMonsterPortrait[monsterNum - 1];
            monsterPortrait.parent = this.monsterListContent;
        }
    },

    //怪物数量增加按钮响应
    increase () {
        this.summonNumber++;
        this.summonNumber = cc.clampf(this.summonNumber, ms.minSummonNum, ms.maxSummonNum);
        this.summonNum.string = this.summonNumber;
    },

    //怪物数量减少按钮响应
    reduce () {
        this.summonNumber--;
        this.summonNumber = cc.clampf(this.summonNumber, ms.minSummonNum, ms.maxSummonNum);
        this.summonNum.string = this.summonNumber;
    },

    //上一分组按钮响应
    up () {
        this.groupNumber--;
        this.groupNumber = cc.clampf(this.groupNumber, ms.minGroupNum, ms.maxGroupNum);
        this.groupNum.string = this.groupNumber;
        //显示怪物头像列表
        this.createMonsterPortrait(this.groupNumber);
    },

    //下一分组按钮响应
    down () {
        this.groupNumber++;
        this.groupNumber = cc.clampf(this.groupNumber, ms.minGroupNum, ms.maxGroupNum);
        this.groupNum.string = this.groupNumber;
        //显示怪物头像列表
        this.createMonsterPortrait(this.groupNumber);
    },

    //响应确定按钮
    ok () {
        //开始召唤怪物
        this.GameJs.generateMonster(this.num, ms.UnitType.Master, this.groupNumber, this.summonNumber, this.team, this.position);
        //改变召唤台的状态
        this.summonStationDataControl.summonStationState = ms.SummonStationState.Summoning;
        
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
