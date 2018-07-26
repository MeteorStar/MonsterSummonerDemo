var ms = require('ms');
var AllUnitData = require('AllUnitData');
var FramesJs = require('FramesJs');
var groupJs = require('groupJs');
cc.Class({
    extends: cc.Component,

    properties: {
        //取得怪物所有头像脚本
        FramesJs: {
            default: null,
            type: FramesJs
        },
        //取得确定后跳转的group界面的控制脚本
        groupJs: {
            default: null,
            type: groupJs
        },
        //所有怪物显示信息9个
        //怪物头像
        monsterPortrait: {
            default: null,
            type: cc.Sprite
        },
        //怪物名字
        monsterName: {
            default: null,
            type: cc.Label
        },
        //取得各种属性值label
        hpNum: {
            default: null,
            type: cc.Label
        },
        attackNum: {
            default: null,
            type: cc.Label
        },
        speedNum: {
            default: null,
            type: cc.Label
        },
        rangeNum: {
            default: null,
            type: cc.Label
        },
        moveNum: {
            default: null,
            type: cc.Label
        },
        summonNum: {
            default: null,
            type: cc.Label
        },
        mpNum: {
            default: null,
            type: cc.Label
        },

        
    },

    // use this for initialization
    onLoad () {
        //当前选中怪物的编号初始化4号怪，三头龙
        this.num = 4;
        //显示对应的信息
        this.showMonsterInfo(this.num);
    },

    //得到召唤台的信息
    selectedStationInfo (summonStationDataControl) {
       //数据本地化
       this.summonStationDataControl = summonStationDataControl;
    },

    //根据怪物的编号显示对应的信息9个
    showMonsterInfo (num) {
        this.monsterPortrait.spriteFrame = this.FramesJs.bMonsterPortrait[num - 1];
        this.monsterName.string = AllUnitData[num].name;
        this.hpNum.string = AllUnitData[num].hp;
        this.attackNum.string = AllUnitData[num].attack;
        this.speedNum.string = AllUnitData[num].speed;
        this.rangeNum.string = AllUnitData[num].range;
        this.moveNum.string = AllUnitData[num].move;
        this.summonNum.string = AllUnitData[num].summon;
        this.mpNum.string = AllUnitData[num].mp;
    },

    //响应上一个怪物按钮
    up () {
        this.num = (this.num -1) % ms.monsterTotalNum === 0 ? ms.monsterTotalNum : (this.num -1) % ms.monsterTotalNum;
        this.showMonsterInfo(this.num);
    },
    //响应下一个怪物按钮
    down () {
        this.num = this.num % ms.monsterTotalNum + 1;
        this.showMonsterInfo(this.num);
    },

    //响应确定按钮,传入选中的怪物编号
    ok () {
        this.groupJs.init(this.num, this.summonStationDataControl);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
