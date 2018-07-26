var ms = require('ms');
cc.Class({
    extends: cc.Component,

    init (unitDataControl) {
        //脚本本地化
        this.unitDataControl = unitDataControl;
        this.bullet = this.unitDataControl.bullet;

        this.timer = 0;
        //敌方三头龙每隔一段时间就自动释放技能
        if(this.unitDataControl.team !== ms.Team.Team0){
            if(this.unitDataControl.skill > 0){
                this.schedule(function(){
                    this.releaseSkill(this.unitDataControl);
                }.bind(this), this.unitDataControl.skill + 2);
            }
        }
    },

    onCollisionStay (other, self) {
        //攻击组件，可以攻击了
        if(self.tag === 1){
            //敌方是召唤台
            var summonStationDataControl = other.getComponent('summonStationDataControl');
            if(summonStationDataControl){
                if(this.unitDataControl.attackState === ms.AttackState.ForcedAttack){
                    //强制攻击目标
                    var length = this.unitDataControl.forcedAttack.length;
                    var target = this.unitDataControl.forcedAttack[this.unitDataControl.forcedAttack.length - 1];
                    if(length > 0){
                        if(target.stationName !== undefined && target.stationName){//找到了强制攻击的目标，停下来开始攻击
                            this.unitDataControl.isAttacking = true;
                            this.unitDataControl.isMoving = false;
                            this.targetPosition = other.node.position;
                        }
                    }
                }else if(this.unitDataControl.attackState === ms.AttackState.CounterAttack){
                    //反击目标
                    var length = this.unitDataControl.counterAttack.length;
                    var target = this.unitDataControl.counterAttack[0];
                    if(length > 0){
                        if(target.stationName !== undefined && target.stationName){//找到了反击的目标，停下来开始攻击
                            this.unitDataControl.isAttacking = true;
                            this.unitDataControl.isMoving = false;
                            this.targetPosition = other.node.position;
                        }
                    }
                }else if(this.unitDataControl.attackState === ms.AttackState.AutomaticAttack){
                    //自动攻击目标
                    var length = this.unitDataControl.automaticAttack.length;
                    var target = this.unitDataControl.automaticAttack[0];
                    if(length > 0){
                        if(target.stationName !== undefined && target.stationName){//找到了自动攻击的目标，停下来开始攻击
                            this.unitDataControl.isAttacking = true;
                            this.unitDataControl.isMoving = false;
                            this.targetPosition = other.node.position;
                        }
                    }
                }
            }else{//敌方是怪物(排除子弹)
                var unitDataControl = other.getComponent('unitDataControl');
                //敌方是怪物
                if(unitDataControl && other.tag === 0){
                    if(this.unitDataControl.attackState === ms.AttackState.ForcedAttack){
                        //强制攻击目标
                        var length = this.unitDataControl.forcedAttack.length;
                        var target = this.unitDataControl.forcedAttack[this.unitDataControl.forcedAttack.length - 1];
                        if(length > 0){
                            if(target.monsterID === unitDataControl.monsterID){//找到了强制攻击的目标，停下来开始攻击
                                this.unitDataControl.isAttacking = true;
                                this.unitDataControl.isMoving = false;
                                this.targetPosition = other.node.position;
                            }
                        }
                    }else if(this.unitDataControl.attackState === ms.AttackState.CounterAttack){
                        //反击目标
                        var length = this.unitDataControl.counterAttack.length;
                        var target = this.unitDataControl.counterAttack[0];
                        if(length > 0){
                            if(target.monsterID === unitDataControl.monsterID){//找到了反击的目标，停下来开始攻击
                                if(!this.unitDataControl.isControlMove){
                                    this.unitDataControl.isAttacking = true;
                                    this.unitDataControl.isMoving = false;
                                    this.targetPosition = other.node.position;
                                }
                            }
                        }
                    }else if(this.unitDataControl.attackState === ms.AttackState.AutomaticAttack){
                        //自动攻击目标
                        var length = this.unitDataControl.automaticAttack.length;
                        var target = this.unitDataControl.automaticAttack[0];
                        if(length > 0){
                            if(target.monsterID === unitDataControl.monsterID){//找到了自动攻击的目标，停下来开始攻击
                                if(!this.unitDataControl.isControlMove){
                                    this.unitDataControl.isAttacking = true;
                                    this.unitDataControl.isMoving = false;
                                    this.targetPosition = other.node.position;
                                }
                            }
                        }
                    }
                }
            }
        } 
    },

    //碰撞结束 敌方脱离攻击范围
    onCollisionExit (other, self) {
        if(self.tag === 1){
            //敌方是召唤台
            var summonStationDataControl = other.getComponent('summonStationDataControl');
            if(summonStationDataControl){
                this.unitDataControl.isAttacking = false;
                this.unitDataControl.isMoving = true;
            }else{
                var unitDataControl = other.getComponent('unitDataControl');
                //敌方是怪物
                if(unitDataControl && other.tag === 0){
                    this.unitDataControl.isAttacking = false;
                    this.unitDataControl.isMoving = true;
                }
            }
        }
    },

    //发动攻击,向目标位置发射攻击弹道
    attack (unitDataControl, targetPosition) {
        var bullet = cc.instantiate(this.bullet);
        bullet.parent = this.unitDataControl.map;
        bullet.setPosition(unitDataControl.node.position);
        bullet.getComponent('bulletJs').init(unitDataControl, targetPosition);
        bullet.zIndex = unitDataControl.node.zIndex - 1; 
    },

    //三头龙还可以释放技能
    releaseSkill (unitDataControl) {
        //同时发射24颗子弹
        if( unitDataControl.name === '三头龙' && 
            unitDataControl.skillTime >= unitDataControl.skill &&
            unitDataControl.skill > 0){
            var p = unitDataControl.node.position;
            for(var i = 0; i < 36; i++){
                var position = cc.p(900 * Math.cos(i * 10) + p.x, 900 * Math.sin(i * 10) + p.y);
                this.attack(unitDataControl, position);
            }
            //重新开始计时
            unitDataControl.skillTime = 0;
        }
    },

    //根据攻击方向改变攻击动画和移动动画
    changeAttackAnim (direction) {
        //x轴正方向为初始方向，逆时针方向角度为正
        var deg = cc.radiansToDegrees(cc.pToAngle(direction));
        if (deg >= 67.5 && deg < 112.5) {
            if(this.unitDataControl.animState !== ms.MonsterAnimState.move0){
                this.unitDataControl.animState = ms.MonsterAnimState.move0;
            }
            this.unitDataControl.animState = ms.MonsterAnimState.attack0;
        } else if (deg >= 22.5 && deg < 67.5) {
            if(this.unitDataControl.animState !== ms.MonsterAnimState.move1){
                this.unitDataControl.animState = ms.MonsterAnimState.move1;
            }
            this.unitDataControl.animState = ms.MonsterAnimState.attack1;
        } else if (deg >= -22.5 && deg < 22.5) {
            if(this.unitDataControl.animState !== ms.MonsterAnimState.move2){
                this.unitDataControl.animState = ms.MonsterAnimState.move2;
            }
            this.unitDataControl.animState = ms.MonsterAnimState.attack2;
        } else if (deg >= -67.5 && deg < -22.5) {
            if(this.unitDataControl.animState !== ms.MonsterAnimState.move3){
                this.unitDataControl.animState = ms.MonsterAnimState.move3;
            }
            this.unitDataControl.animState = ms.MonsterAnimState.attack3;
        } else if (deg >= -112.5 && deg < -67.5) {
            if(this.unitDataControl.animState !== ms.MonsterAnimState.move4){
                this.unitDataControl.animState = ms.MonsterAnimState.move4;
            }
            this.unitDataControl.animState = ms.MonsterAnimState.attack4;
        } else if (deg >= -157.5 && deg < -112.5) {
            if(this.unitDataControl.animState !== ms.MonsterAnimState.move5){
                this.unitDataControl.animState = ms.MonsterAnimState.move5;
            }
            this.unitDataControl.animState = ms.MonsterAnimState.attack5;
        } else if (deg >= 157.5 || deg < -157.5) {
            if(this.unitDataControl.animState !== ms.MonsterAnimState.move6){
                this.unitDataControl.animState = ms.MonsterAnimState.move6;
            }
            this.unitDataControl.animState = ms.MonsterAnimState.attack6;
        } else if (deg >= 112.5 && deg < 157.5) {
            if(this.unitDataControl.animState !== ms.MonsterAnimState.move7){
                this.unitDataControl.animState = ms.MonsterAnimState.move7;
            }
            this.unitDataControl.animState = ms.MonsterAnimState.attack7;
        }
    },
    
    update: function (dt) {
        if(this.unitDataControl.isAttacking){
            this.timer += dt;
            if(this.timer >= this.unitDataControl.attackInterval){//到了攻击间隔时间可以开始攻击
                if(this.unitDataControl.name === '三头龙'){
                    this.attack(this.unitDataControl, cc.p(this.targetPosition.x, this.targetPosition.y + cc.randomMinus1To1() * 40));
                    this.attack(this.unitDataControl, cc.p(this.targetPosition.x, this.targetPosition.y + cc.randomMinus1To1() * 40));
                }
                this.attack(this.unitDataControl, this.targetPosition);
                //攻击方向
                this.attackDirection = cc.pNormalize(cc.pSub(this.targetPosition, this.node.position));
                //根据攻击方向改变攻击动画
                this.changeAttackAnim(this.attackDirection);
                this.timer = 0;
            }
        }
    },
});
