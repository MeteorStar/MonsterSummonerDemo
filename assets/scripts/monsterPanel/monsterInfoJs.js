var ms = require('ms');
cc.Class({
    extends: cc.Component,

    properties: {

        race: {
            default: null,
            type: cc.Sprite
        },

        lv: {
            default: null,
            type: cc.Label
        },

        monsterName: {
            default: null,
            type: cc.Label
        },

        moveType: {
            default: null,
            type: cc.Sprite
        },

        attackType: {
            default: null,
            type: cc.Sprite
        },

        attackProperty: {
            default: null,
            type: cc.Sprite
        },

        magicPhysic: {
            default: null,
            type: cc.Label
        },

        attackLevelNum: {
            default: null,
            type: cc.Label
        },
        
        physicLevelNum: {
            default: null,
            type: cc.Label
        },
        
        magicLevelNum: {
            default: null,
            type: cc.Label
        },
        
        attack: {
            default: null,
            type: cc.Label
        },
        
        speed: {
            default: null,
            type: cc.Label
        },
        
        range: {
            default: null,
            type: cc.Label
        },
        
        move: {
            default: null,
            type: cc.Label
        },
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
