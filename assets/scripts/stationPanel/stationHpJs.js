var ms = require('ms');
cc.Class({
    extends: cc.Component,

    properties: {

        hpNum: {
            default: null,
            type: cc.Label
        },

        summonerPortrait: {
            default: null,
            type: cc.Sprite
        },

        hpProgress: {
            default: null,
            type: cc.ProgressBar
        }



    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
