var ms = require('ms');
cc.Class({
    extends: cc.Component,

    properties: {

        bgmusic: {
            default: null,
            url: cc.AudioClip
        },
       
    },

    
    onLoad: function () {
        //恢复场景
        cc.director.resume();

        cc.audioEngine.playMusic(this.bgmusic, true);

    },

    newBegin: function(){
        cc.director.loadScene('fighting', function(){cc.director.resume();});
        cc.audioEngine.end();
    },

   
    // update: function (dt) {

    // },
});
