var ms = require('ms');
cc.Class({
    extends: cc.Component,

    properties: {
        bulletFrame: {
            default: [],
            type: [cc.SpriteFrame]
        }
    },

    init (unitDataControl, targetPosition) {
        //得到攻击方的数据
        this.unitDataControl = unitDataControl;
        this.targetPosition = targetPosition;

        //根据this.unitDataControl的信息改变弹道的状态
        this.getComponent(cc.Sprite).spriteFrame = this.bulletFrame[this.unitDataControl.attackProperty];
        //近战弹道为透明的
        if(this.unitDataControl.attackType === ms.AttackType.Direct){
            this.node.opacity = 0;
        }

        //弹道以一定速度移动到目标地点
        var moveAction = ms.moveToSpeed(this.node.position, this.targetPosition, this.unitDataControl.moveSpeed * ms.BulletTimesToMoveSpeed);
        this.node.runAction(cc.sequence(moveAction, cc.callFunc(this.finish, this)));
    },

    //子弹到达目的地后销毁
    finish () {
        this.node.destroy();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
