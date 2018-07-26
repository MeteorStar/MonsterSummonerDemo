var ms = require('ms');
//怪物主要数据和控制的脚本
var AllUnitData = require('AllUnitData');
var fightData = require('fightData');
cc.Class({
    extends: cc.Component,

    properties: {
        //怪物召唤完成的登场动画
        debutAnim: {
            default: null,
            type: cc.Prefab
        },
        //怪物攻击弹道的预制体
        bullet: {
            default: null,
            type: cc.Prefab
        },
        //被暴击和回血的label显示
        critRecvory: {
            default: null,
            type: cc.Prefab
        },
        //怪物动画组件取得
        anim: {
            default: null,
            type: cc.Animation
        },

        //怪物是否被选中，选中的会显示血条
        _isSelected: false,
        isSelected: {
            get () {
                return this._isSelected;
            },
            set (value) {
                if (value !== this._isSelected) {
                    this._isSelected = value;
                    switch (this._isSelected){
                        case true:
                            this.hpNode.opacity = 255;
                            this.showHpInfo();
                            break;
                        case false:
                            this.hpNode.opacity = 0;
                            this.showHpInfo();
                            break;
                    } 
                }
            },
            visible: false,
        },
        //怪物的当前血量，血量变化的时候会显示血条持续2秒,2秒时间渐隐
        _currentHp: 0,
        currentHp: {
            get () {
                return this._currentHp;
            },
            set (value) {
                if(value !== this._currentHp){
                    //血值范围0-this.maxHp
                    this._currentHp = cc.clampf(value, 0, this.maxHp);
                    if(this.hpNode){
                        this.hpNode.opacity = 255;
                        this.showHpInfo();
                    }
                    //如果monsterHp打开，同时更新这里的信息
                    if(this.UiJs.monsterHp.active && this.isSelected){
                        this.UiJs.monsterHpJs.hpNum.string = Math.ceil(this.currentHp) + '/' + Math.ceil(this.maxHp);
                        this.UiJs.monsterHpJs.hpProgress.progress = this.currentHp / this.maxHp;
                    }
                    //如果hp为0就死了
                    if(this._currentHp <= 0){
                        //从被选中列表删除
                        var self = this;
                        if(this.team === ms.Team.Team0){
                            fightData.selfSelected = fightData.selfSelected.filter(function(unitDataControl){
                                return (unitDataControl && unitDataControl.monsterID !== self.monsterID);
                            });
                            fightData.selfGroup[self.group - 1] = fightData.selfGroup[self.group - 1].filter(function(unitDataControl){
                                return (unitDataControl && unitDataControl.monsterID !== self.monsterID);
                            });
                            fightData.selfAllMonster = fightData.selfAllMonster.filter(function(unitDataControl){
                                return (unitDataControl && unitDataControl.monsterID !== self.monsterID);
                            });
                        }else{
                            fightData.otherAllMonster = fightData.otherAllMonster.filter(function(unitDataControl){
                                return (unitDataControl && unitDataControl.monsterID !== self.monsterID);
                            });
                        }
                        //播放死亡动画
                        if(this.anim.currentClip.name.indexOf('move') > -1){
                            this.animState += 16;
                        }else if(this.anim.currentClip.name.indexOf('attack') > -1){
                            this.animState += 8;
                        }
                        this.unitAction.enabled = false;
                        this.unitAttack.enabled = false;
                        this.unitCollision.enabled = false;
                        this.unitPreventOverlap.enabled = false;
                        this.unitPreventOverlap.getComponent(cc.CircleCollider).enabled = false;
                        this.node.zIndex--;
                        this.hpNode.opacity = 0;
                        this.getComponents(cc.CircleCollider).forEach(function(collider){
                            collider.enabled = false;
                        });
                        this.getComponent(cc.Button).enabled = false;
                        var self = this;
                        this.node.runAction(cc.sequence(cc.fadeOut(2), cc.callFunc(function(){self.node.destroy();})));
                    }
                }
            },
            visible: false,
        },
        //根据怪物的当前状态(move, attack, die)更新动画播放(move0-move7，attack0-attack7，die0-die7)
        _animState: ms.MonsterAnimState.move0,
        animState: {
            get () {
                return this._animState;
            },
            set (value) {
                if(value !== this._animState){
                    this._animState = value;
                    //死亡动画不能跟其他同时播放
                    if(this._animState >= ms.MonsterAnimState.die0 && this._animState <= ms.MonsterAnimState.die7){
                        this.anim.play(ms.MonsterAnimState[this._animState]);
                    }else{//攻击,移动,动画用playAdditive播放，跟其他动画可以同时播放,
                        this.anim.playAdditive(ms.MonsterAnimState[this._animState]);
                    }
                }else{
                    //攻击动画可以多次播放
                    if(this._animState >= ms.MonsterAnimState.attack0 && this._animState <= ms.MonsterAnimState.attack7){
                        this.anim.playAdditive(ms.MonsterAnimState[this._animState]);
                    }
                }
            },
            visible: false,
        }
    },

    //怪物编号(1-9)，类型(Master,Summoner)，分组(1-8),所属队伍(Team0为玩家，其他为敌人)，map战场节点，UiJs画面控制总脚本
    init (num, unitType, group, team, map, UiJs) {

        //给怪物附上ID
        fightData.monsterID++;
        this.monsterID = fightData.monsterID;

        this.group = group;
        this.team = team;
        this.map = map;
        this.unitType = unitType;
        //脚本本地化
        this.UiJs = UiJs;


        
        //定义并初始化怪物的各种基本属性(从怪物数据配置表取得的数据，18个数据)，并对某些数据进行随机扰动
        this.num = AllUnitData[num].num;
        this.mp = AllUnitData[num].mp;
        this.summon = AllUnitData[num].summon;
        this.name = AllUnitData[num].name;
        this.lv = AllUnitData[num].lv;
        this.race = AllUnitData[num].race;
        this.moveType = AllUnitData[num].moveType;
        this.attackType = AllUnitData[num].attackType;
        this.attackProperty = AllUnitData[num].attackProperty;
        this.magicPhysic = AllUnitData[num].magicPhysic;
        //随机波动数据
        this.physicDamage = AllUnitData[num].physicDamage * ms.randomNormal();
        this.magicDamage = AllUnitData[num].magicDamage * ms.randomNormal();
        this.hp = AllUnitData[num].hp * ms.randomNormal();
        this.skill = AllUnitData[num].skill * ms.randomNormal();
        this.attack = AllUnitData[num].attack * ms.randomNormal();
        this.speed = AllUnitData[num].speed * ms.randomNormal();
        this.range = AllUnitData[num].range * ms.randomNormal();
        this.move = AllUnitData[num].move * ms.randomNormal();

        //技能冷却计时
        this.skillTime = 0;

        if(this.team === ms.Team.Team0){
            //将怪物信息传入对应的分组
            fightData.selfGroup[group - 1].push(this);
            //怪物信息保存至所有怪物数组
            fightData.selfAllMonster.push(this);
        }else{
            fightData.otherAllMonster.push(this);
        }
        //被攻击的碰撞节点分组
        this.node.group = ms.Team[team];
        

        //根据unitType和team决定光环的显隐和颜色
        this.halo = this.node.getChildByName('halo');
        if(this.unitType === ms.UnitType.Summoner){
            this.halo.active = true;
            //召唤士单位，有肉有输出
            this.hp += ms.summonerExtraHp;
            this.attack *= ms.summonerSubtractionAttack;
            this.move += 3;
            if(this.team === ms.Team.Team0){
                this.halo.color = cc.Color.WHITE;
                this.node.getChildByName('body').color = cc.Color.WHITE;
            } else {
                this.halo.color = cc.Color.RED;
                this.node.getChildByName('body').color = cc.Color.RED;
            }
        } else {
            this.halo.active = false;
            if(this.team === ms.Team.Team0){
                this.node.getChildByName('body').color = cc.Color.WHITE;
            } else {
                this.node.getChildByName('body').color = cc.Color.RED;
            }
        }

        //根据射程调整碰撞组件半径
        this.getComponent(cc.CircleCollider).radius = ms.rangeBase + ms.rangeRate * this.range;
        //根据speed值得到每次攻击的时间间隔
        this.attackInterval = ms.speedRate / this.speed;
        //根据move值得到移动速度
        this.moveSpeed = ms.moveBase + ms.moveRate * this.move;
        
        //hp相关
        this.maxHp = this.hp;
        this.currentHp = this.hp;
        //3个会显示的标志
        this.hpNode = this.node.getChildByName('maxHp');
        this.hpProgressBar = this.hpNode.getComponent(cc.ProgressBar);
        this.hpNum = this.hpNode.getChildByName('hpNum').getComponent(cc.Label);

        //取得其他3个脚本并初始化
        this.unitAction = this.getComponent('unitAction');
        this.unitAction.init(this);
        this.unitAttack = this.getComponent('unitAttack');
        this.unitAttack.init(this);
        this.unitCollision = this.getComponent('unitCollision');
        this.unitCollision.init(this);
        //防重叠控制脚本
        this.unitPreventOverlap = this.node.getChildByName('body').getComponent('unitPreventOverlap');

        //对于怪物的行为，玩家操作移动~强制攻击敌方某个单位>受伤害反击>自动锁敌
        //选中己方单位时，再点击敌方单位，ForcedAttack加一个，中断先前移动,去攻击敌方单位，重新移动时，ForcedAttack置空
        //被敌人单位攻击到，CounterAttack加一个
        //敌方单位进入自动追踪范围，AutomaticAttack加一个
        //敌人单位死亡，3数组自动移除相关单位

        //强制攻击单位顺序会变化，攻击顺序从最后一个往前攻击
        this.forcedAttack = [];
        //反击，单位顺序不变，攻击顺序从第一个往后攻击
        this.counterAttack = [];
        //自动追击，单位顺序不变，攻击顺序从第一个往后攻击
        this.automaticAttack = [];

        //怪物是否在移动
        this.isMoving = false;
        //玩家控制移动状态
        this.isControlMove = false;
        //怪物是否在攻击
        this.isAttacking = false;
        //怪物的当前攻击状态
        this.attackState = ms.AttackState.None;


        //播放怪物的出场动画
        var debutAnim = cc.instantiate(this.debutAnim);
        debutAnim.parent = this.map;
        debutAnim.setPosition(this.node.position);
        debutAnim.getComponent('debutAnimJs').init(this.node);
        //为怪物加上24个动画
        ms.makeClipsToAnimation(this.num, this.anim);
        //关闭怪物节点，动画完成后再激活
        this.node.active = false;
    },

    //显示怪物信息
    thisMonsterSelected () {
        var self = this;
        //己方单位被选中selected状态变为true
        if(self.team === ms.Team.Team0){
            //选中列表置空
            fightData.selfSelected.forEach(function (unitDataControl) {
                unitDataControl.isSelected = false;
            });
            fightData.selfSelected = [];
            self.isSelected = true;
            fightData.selfSelected.push(self);
        }else{//敌方单位被选中就是被强制攻击
            fightData.selfSelected.forEach(function(unitDataControl){
                unitDataControl.isMoving = true;
                unitDataControl.isAttacking = false;
                unitDataControl.isControlMove = false;
                unitDataControl.attackState = ms.AttackState.ForcedAttack;
                //过滤3数组
                unitDataControl.forcedAttack = unitDataControl.forcedAttack.filter(function(data){
                    return data.monsterID !== self.monsterID;
                });
                unitDataControl.forcedAttack.push(self);
            });
        } 
        //显示对应的面板
        this.UiJs.monsterSelected(this.team, this);

        //显示当前选中怪物的所有属性信息，己方还可以控制
        this.monsterData = {
            race: self.race,
            lv: self.lv,
            monsterName: self.name,
            moveType: self.moveType,
            attackType: self.attackType,
            attackProperty: self.attackProperty,
            magicPhysic: self.magicPhysic,
            physicLevelNum: self.physicDamage,
            magicLevelNum: self.magicDamage,
            attack: self.attack,
            speed: self.speed,
            range: self.range,
            move: self.move,
            currentHp: self.currentHp,
            maxHp: self.maxHp,
            num: self.num,
            skill: self.skill,
            skillTime: self.skillTime,  
        };
        //显示信息
        this.UiJs.showMonsterInfo(this.monsterData);
    },

    //显示怪物自身所带血条的信息
    showHpInfo () {
        this.hpProgressBar.progress = this.currentHp / this.maxHp;
        this.hpNum.string = Math.ceil(this.currentHp) + '/' + Math.ceil(this.maxHp);
    },

    update: function (dt) {
        //技能进度条的更新
        this.skillTime += dt;
        this.skillTime = cc.clampf(this.skillTime, 0, this.skill);
        //实时更新技能进度条
        if(this.skill != 0 && this.UiJs.monsterHp.active && this.isSelected){
            this.UiJs.monsterHpJs.skillProgress.progress = this.skillTime / this.skill;
        }
        //不让怪物跑出地图
        ms.unThroughWalls(this.node, this.map);

        //没被选中的怪物血条变化会显现1秒，1秒左右渐隐
        if(!this.isSelected && this.hpNode.opacity > 0){
            this.hpNode.opacity -= 255 * dt;
        }
    },
});
