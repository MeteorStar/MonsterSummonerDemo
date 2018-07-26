var ms = require('ms');
var fightData = require('fightData');
cc.Class({
    extends: cc.Component,

    properties: {
    },

    init (unitDataControl) {
        //脚本本地化
        this.unitDataControl = unitDataControl;

    },

    getTouchPosition (touchPosition) {
        this.moveToPosition = cc.p();
        this.moveToPosition.x = touchPosition.x + cc.randomMinus1To1() * ms.overlappingRadius * Math.ceil(Math.sqrt(fightData.selfSelected.length));
        this.moveToPosition.y = touchPosition.y + cc.randomMinus1To1() * ms.overlappingRadius * Math.ceil(Math.sqrt(fightData.selfSelected.length));
    },

    //根据移动方向改变移动动画
    changeMoveAnim (direction) {
        //x轴正方向为初始方向，逆时针方向角度为正
        var deg = cc.radiansToDegrees(cc.pToAngle(direction));
        if (deg >= 67.5 && deg < 112.5) {
            this.unitDataControl.animState = ms.MonsterAnimState.move0;
        } else if (deg >= 22.5 && deg < 67.5) {
            this.unitDataControl.animState = ms.MonsterAnimState.move1;
        } else if (deg >= -22.5 && deg < 22.5) {
            this.unitDataControl.animState = ms.MonsterAnimState.move2;
        } else if (deg >= -67.5 && deg < -22.5) {
            this.unitDataControl.animState = ms.MonsterAnimState.move3;
        } else if (deg >= -112.5 && deg < -67.5) {
            this.unitDataControl.animState = ms.MonsterAnimState.move4;
        } else if (deg >= -157.5 && deg < -112.5) {
            this.unitDataControl.animState = ms.MonsterAnimState.move5;
        } else if (deg >= 157.5 || deg < -157.5) {
            this.unitDataControl.animState = ms.MonsterAnimState.move6;
        } else if (deg >= 112.5 && deg < 157.5) {
            this.unitDataControl.animState = ms.MonsterAnimState.move7;
        }
    },

    updatePosition (dt) {
        //记录当前位置
        this.oldPosition = this.node.position;
        //根据当前位置和目的位置计算出移动方向
        this.direction = cc.pNormalize(cc.pSub(this.moveToPosition, this.oldPosition));
        //根据移动方向改变移动动画
        this.changeMoveAnim(this.direction);
        //根据hero移动速度，按移动方向算出hero的新位置
        var newPosition = cc.pAdd(this.oldPosition, cc.pMult(this.direction, this.unitDataControl.moveSpeed * dt));
        //根据新位置坐标实时更新hero的位置
        this.node.setPosition(newPosition);
    },

    update: function (dt) {
        //如果怪物为移动状态
        if(this.unitDataControl.isMoving){
            //控制怪物移动
            if(this.unitDataControl.isControlMove){
                this.updatePosition(dt);
                //到达目的地后附近后停止
                if( Math.abs(this.node.position.x - this.moveToPosition.x) <= this.unitDataControl.moveSpeed/20 && 
                    Math.abs(this.node.position.y - this.moveToPosition.y) <= this.unitDataControl.moveSpeed/20 ){
                    this.unitDataControl.isControlMove = false;
                }   
            }else if(this.unitDataControl.forcedAttack.length > 0){//有强制攻击目标,取数组最后一个目标的位置为目标位置
                if( this.unitDataControl.forcedAttack[this.unitDataControl.forcedAttack.length - 1].node &&
                    this.unitDataControl.forcedAttack[this.unitDataControl.forcedAttack.length - 1].node.isValid){
                    this.moveToPosition = this.unitDataControl.forcedAttack[this.unitDataControl.forcedAttack.length - 1].node.position;
                    this.unitDataControl.attackState = ms.AttackState.ForcedAttack;
                    this.updatePosition(dt);
                }
            }else if(this.unitDataControl.counterAttack.length > 0){//有反击目标,取数组第一个目标的位置为目标位置
                if(this.unitDataControl.counterAttack[0].node && this.unitDataControl.counterAttack[0].node.isValid){
                    this.moveToPosition = this.unitDataControl.counterAttack[0].node.position;
                    this.unitDataControl.attackState = ms.AttackState.CounterAttack;
                    this.updatePosition(dt);
                }
            }else if(this.unitDataControl.automaticAttack.length > 0){//有自动追击目标,取数组第一个目标的位置为目标位置
                if(this.unitDataControl.automaticAttack[0].node && this.unitDataControl.automaticAttack[0].node.isValid){
                    this.moveToPosition = this.unitDataControl.automaticAttack[0].node.position;
                    this.unitDataControl.attackState = ms.AttackState.AutomaticAttack;
                    this.updatePosition(dt);
                }
            } 
        }
    },


});
