var ms = require('ms');
var fightData = require('fightData');
cc.Class({
    extends: cc.Component,

    properties: {
    },

    //selectGroup按钮响应
    selectGroup () {
        var groupNum = fightData.selfSelected[0].group;
         //选中列表置空
        fightData.selfSelected.forEach(function (unitDataControl) {
            unitDataControl.isSelected = false;
        });
        fightData.selfSelected = [];
        //放入本组所有怪
        fightData.selfGroup[groupNum - 1].forEach(function (unitDataControl) {
            unitDataControl.isSelected = true;
            fightData.selfSelected.push(unitDataControl);
        });
    },

    //selectAll按钮响应
    selectAll () {
        var groupNum = fightData.selfSelected[0].group;
         //选中列表置空
        fightData.selfSelected.forEach(function (unitDataControl) {
            unitDataControl.isSelected = false;
        });
        fightData.selfSelected = [];
        //放入所有怪
        fightData.selfAllMonster.forEach(function (unitDataControl) {
            unitDataControl.isSelected = true;
            fightData.selfSelected.push(unitDataControl);
        });
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
