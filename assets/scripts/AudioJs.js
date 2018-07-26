var ms = require('ms');
cc.Class({
    extends: cc.Component,

    properties: {
        //战斗背景音乐
        fightBGM: {
            default: null,
            url: cc.AudioClip,
        },
        //胜利的音效
        winMusic: {
            default: null,
            url: cc.AudioClip,
        },
         //失败的音效
         loseMusic: {
            default: null,
            url: cc.AudioClip,
        },
    },

});
