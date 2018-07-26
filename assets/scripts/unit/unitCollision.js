var ms = require('ms');
//被子弹击中掉血，碰撞检测
cc.Class({
    extends: cc.Component,

    init (unitDataControl) {
        //脚本本地化
        this.unitDataControl = unitDataControl;

        this.critRecvory = this.unitDataControl.critRecvory;

    },

    //碰撞开始，分弹道,  召唤台，怪物(不同team)，弹道
    onCollisionEnter (other, self) {
        //被弹道击中
        if(other.node.group === 'Bullet'){
            if(self.tag === 0){
                //获得弹道信息
                var unitDataControl = other.getComponent('bulletJs').unitDataControl;
                //被敌方弹道击中，计算掉血
                if(unitDataControl.team !== this.unitDataControl.team){//被敌方弹道击中，计算掉血
                    //如果没记录，则将敌方怪物放入反击数组
                    var isExist = this.unitDataControl.counterAttack.some(function(data){
                        return data.monsterID === unitDataControl.monsterID;
                    });
                    if(!isExist){
                        this.unitDataControl.counterAttack.push(unitDataControl);
                    } 
                    if(this.unitDataControl.attackState === ms.AttackState.None ||
                       this.unitDataControl.attackState === ms.AttackState.AutomaticAttack){
                        this.unitDataControl.attackState = ms.AttackState.CounterAttack;
                        this.unitDataControl.isMoving = true;
                        this.unitDataControl.isAttacking = false;
                    }
                    //执行掉血逻辑
                    this.calculateDamage(unitDataControl);
                    //销毁弹道节点
                    if(other.node.isValid){
                        other.node.destroy();
                    } 
                }
            }
        }else{//敌方怪物或者召唤台放入对应数组，根据是否攻击来判断是否要移动
            //自动追踪检测到
            if(self.tag === 2){
                //敌方是召唤台
                var summonStationDataControl = other.getComponent('summonStationDataControl');
                if(summonStationDataControl){
                    //如果没在攻击，就开始移动去迎敌
                    if(!this.unitDataControl.isAttacking){
                        this.unitDataControl.isMoving = true;
                    }
                    //如果没记录，则将对方召唤台放入自动追击数组
                    var isExist = this.unitDataControl.automaticAttack.some(function(data){
                        return data.stationName !== undefined;
                    });
                    if(!isExist){
                        this.unitDataControl.automaticAttack.push(summonStationDataControl);
                    } 
                }else{//敌方是怪物
                    if(other.tag === 0){
                        var unitDataControl = other.getComponent('unitDataControl');
                        //如果没在攻击，就开始移动去迎敌
                        if(!this.unitDataControl.isAttacking){
                            this.unitDataControl.isMoving = true;
                        }
                        //如果没记录，则将敌方怪物放入自动追击数组
                        var isExist = this.unitDataControl.automaticAttack.some(function(data){
                            return data.monsterID === unitDataControl.monsterID;
                        });
                        if(!isExist){
                            this.unitDataControl.automaticAttack.push(unitDataControl);
                        } 
                    }
                }
            }
        }
    },

    //碰撞结束 对面怪物或者召唤台离开自动追踪范围
    onCollisionExit (other, self) {
        if(self.tag === 2){
            //敌方召唤台离开范围
            var summonStationDataControl = other.getComponent('summonStationDataControl');
            if(summonStationDataControl){
                //消除数组对应的记录
               
                this.unitDataControl.forcedAttack = this.unitDataControl.forcedAttack.filter(function(data){
                    return data.stationName == undefined;
                });
                this.unitDataControl.counterAttack = this.unitDataControl.counterAttack.filter(function(data){
                    return data.stationName == undefined;
                });
                this.unitDataControl.automaticAttack = this.unitDataControl.automaticAttack.filter(function(data){
                    return data.stationName == undefined;
                });
               
            }else{//敌方怪物离开范围  死亡或者走开
                var unitDataControl = other.getComponent('unitDataControl');
                if(unitDataControl && other.tag === 0){
                    //消除数组对应的记录
                    //是否死亡？？
                    this.unitDataControl.forcedAttack = this.unitDataControl.forcedAttack.filter(function(data){
                        return (data && data.node && data.monsterID !== unitDataControl.monsterID);
                    });
                    this.unitDataControl.counterAttack = this.unitDataControl.counterAttack.filter(function(data){
                        return (data && data.node && data.monsterID !== unitDataControl.monsterID);
                    });
                    this.unitDataControl.automaticAttack = this.unitDataControl.automaticAttack.filter(function(data){
                        return (data && data.node && data.monsterID !== unitDataControl.monsterID);
                    }); 

                    if(this.unitDataControl.forcedAttack.length > 0){
                        if(this.unitDataControl.forcedAttack[this.unitDataControl.forcedAttack.length - 1].node &&
                           this.unitDataControl.forcedAttack[this.unitDataControl.forcedAttack.length - 1].node.isValid){
                            this.unitDataControl.attackState = ms.AttackState.ForcedAttack;
                           }
                    }else if(this.unitDataControl.counterAttack.length > 0){
                        if(this.unitDataControl.counterAttack[0].node && this.unitDataControl.counterAttack[0].node.isValid){
                            this.unitDataControl.attackState = ms.AttackState.CounterAttack;
                        }
                    }else if(this.unitDataControl.automaticAttack.length > 0){
                        if(this.unitDataControl.automaticAttack[0].node && this.unitDataControl.automaticAttack[0].node.isValid){
                            this.unitDataControl.attackState = ms.AttackState.AutomaticAttack;
                        }
                    }else{
                        this.unitDataControl.attackState = ms.AttackState.None;
                        this.unitDataControl.isMoving = false;
                        this.unitDataControl.isAttacking = false;
                    } 
                }
            }
        }
    },

    //怪物对怪物的伤害计算逻辑
    calculateDamage (otherUnitData) {
        //最终伤害值
        var damage = 0;
        //影响伤害的因素
        var attack = otherUnitData.attack;
        var randomCoefficient = ms.randomNormal();
        var raceCoefficient = 0;
        var attackPropertyCoefficient = 0;
        var magicPhysicCoefficient = 0;
        var critCoefficient = 0;

        //种族克制系数判断
        switch (this.unitDataControl.race) {
            case ms.Race.Dragon:
                if(otherUnitData.race === ms.Race.Dragon){
                    raceCoefficient = 1;
                }else if(otherUnitData.race === ms.Race.Magic){
                    raceCoefficient = ms.raceRestraintedReduce;
                }else if(otherUnitData.race === ms.Race.Beast){
                    raceCoefficient = ms.raceRestraintAddition;
                }
                break;
            case ms.Race.Magic:
                if(otherUnitData.race === ms.Race.Dragon){
                    raceCoefficient = ms.raceRestraintAddition;
                }else if(otherUnitData.race === ms.Race.Magic){
                    raceCoefficient = 1;
                }else if(otherUnitData.race === ms.Race.Beast){
                    raceCoefficient = ms.raceRestraintedReduce;
                }
                break;
            case ms.Race.Beast:
                if(otherUnitData.race === ms.Race.Dragon){
                    raceCoefficient = ms.raceRestraintedReduce;
                }else if(otherUnitData.race === ms.Race.Magic){
                    raceCoefficient = ms.raceRestraintAddition;
                }else if(otherUnitData.race === ms.Race.Beast){
                    raceCoefficient = 1;
                }
                break;
        };

        //攻击属性克制判断
        switch (this.unitDataControl.attackProperty) {
            case ms.AttackProperty.Fire:
                if(otherUnitData.attackProperty === ms.AttackProperty.Fire){
                    attackPropertyCoefficient = ms.attackPropertyReduce;
                }else if(otherUnitData.attackProperty === ms.AttackProperty.Ice){
                    attackPropertyCoefficient = ms.attackPropertyAddition;
                }else{
                    attackPropertyCoefficient = 1;
                }
                break;
            case ms.AttackProperty.Ice:
                if(otherUnitData.attackProperty === ms.AttackProperty.Ice){
                    attackPropertyCoefficient = ms.attackPropertyReduce;
                }else if(otherUnitData.attackProperty === ms.AttackProperty.Fire){
                    attackPropertyCoefficient = ms.attackPropertyAddition;
                }else{
                    attackPropertyCoefficient = 1;
                }
                break;
            case ms.AttackProperty.Thunder:
                if(otherUnitData.attackProperty === ms.AttackProperty.Thunder){
                    attackPropertyCoefficient = ms.attackPropertyReduce;
                }else if(otherUnitData.attackProperty === ms.AttackProperty.Ground){
                    attackPropertyCoefficient = ms.attackPropertyAddition;
                }else{
                    attackPropertyCoefficient = 1;
                }
                break;
            case ms.AttackProperty.Ground:
                if(otherUnitData.attackProperty === ms.AttackProperty.Ground){
                    attackPropertyCoefficient = ms.attackPropertyReduce;
                }else if(otherUnitData.attackProperty === ms.AttackProperty.Thunder){
                    attackPropertyCoefficient = ms.attackPropertyAddition;
                }else{
                    attackPropertyCoefficient = 1;
                }
                break;
        };

        switch (this.unitDataControl.magicPhysic) {
            case ms.MagicPhysic.Magic:
                magicPhysicCoefficient = this.unitDataControl.magicDamage;
                break;
            case ms.MagicPhysic.Physic:
                magicPhysicCoefficient = this.unitDataControl.physicDamage;
                break;
        };

        //是否暴击
        if(Math.random() <= ms.critProbability){
            critCoefficient = ms.critTimes;
        }else{
            critCoefficient = 1;
        }

        //计算最终伤害
        damage = attack * randomCoefficient * raceCoefficient * attackPropertyCoefficient * magicPhysicCoefficient * critCoefficient;
        //计算掉血
        this.unitDataControl.currentHp -= damage;

        //暴击则播放动画
        if(critCoefficient > 1){
            this.critAnim(damage);
        }
    },

    //暴击动画
    critAnim (damage) {
        var crit = cc.instantiate(this.critRecvory);
        crit.getComponent(cc.Label).string = Math.round(damage);
        crit.color = cc.Color.RED;
        crit.parent = this.unitDataControl.map;
        crit.setPosition(this.node.position);
        crit.runAction(cc.sequence(cc.spawn(cc.moveBy(1, -20, 40), cc.scaleBy(1, 2)), cc.callFunc(function(){crit.destroy();})));
    },
    
});
