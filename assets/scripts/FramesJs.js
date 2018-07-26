var ms = require('ms');
cc.Class({
    extends: cc.Component,

    properties: {
        //所有怪物的小头像数组
        aMonsterPortrait: {
            default: [],
            type: [cc.SpriteFrame],
        },
        //所有怪物的大头像数组
        bMonsterPortrait: {
            default: [],
            type: [cc.SpriteFrame],
        },
        //种族图标
        race: {
            default: [],
            type: [cc.SpriteFrame],
        },
        //移动类型图标
        moveType: {
            default: [],
            type: [cc.SpriteFrame],
        },
        //攻击类型图标
        attackType: {
            default: [],
            type: [cc.SpriteFrame],
        },
        //攻击属性图标
        attackProperty: {
            default: [],
            type: [cc.SpriteFrame],
        },
        //战斗模式图标
        fightModeIcon: {
            default: [],
            type: [cc.SpriteFrame],
        },
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
