var ms = require('ms');
cc.Class({
    extends: cc.Component,

    properties: {
        stationName: {
            default: null,
            type: cc.Label
        },

        iconInfo: {
            default: null,
            type:cc.Node
        },

        attackLevel: {
            default: null,
            type: cc.Label
        },

        attackLevelNum: {
            default: null,
            type: cc.Label
        },

        physicLevel: {
            default: null,
            type: cc.Label
        },
        
        physicLevelNum: {
            default: null,
            type: cc.Label
        },
        
        magicLevel: {
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

        summoningInfo: {
            default: null,
            type: cc.Label
        },

        summoningPortrait: {
            default: null,
            type: cc.Sprite
        },

        summoningProgress: {
            default: null,
            type: cc.ProgressBar
        },
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
