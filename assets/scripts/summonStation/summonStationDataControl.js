var ms = require('ms');
var fightData = require('fightData');
cc.Class({
    extends: cc.Component,

    properties: {
        //召唤士头像
        summonerFrame: {
            default: null,
            type: cc.SpriteFrame
        },
        //下光环取得
        underHalo: {
            default: null,
            type: cc.Node
        },
        //上光环取得
        upHalo: {
            default: null,
            type: cc.Node
        },
        //被暴击的label显示
        critRecvory: {
            default: null,
            type: cc.Prefab
        },
        //召唤台的当前血量，
        _currentHp: 0,
        currentHp: {
            get () {
                return this._currentHp;
            },
            set (value) {
                if(value !== this._currentHp){
                    //如果被攻击掉血，召唤台会闪烁
                    if(value < this._currentHp){
                        this.node.runAction(cc.blink(0.2, 1));
                    }
                    //血值范围0-this.maxHp
                    this._currentHp = cc.clampf(value, 0, this.maxHp);
                    //如果stationHp打开，同时更新这里的信息
                    if(this.UiJs.stationHp && this.UiJs.stationHp.active){
                        this.UiJs.stationHpJs.hpNum.string = Math.ceil(this.currentHp) + '/' + Math.ceil(this.maxHp);
                        this.UiJs.stationHpJs.hpProgress.progress = this.currentHp / this.maxHp;
                    }
                    //召唤台没血了，游戏结束
                    if(this._currentHp <= 0){
                        this.gameOver();
                    }
                }
            },
            visible: false,
        },

    },

    //召唤台的分组，召唤台信息脚本,召唤台血量脚本取得
    init (team, UiJs) {

        //脚本本地化
        this.UiJs = UiJs;

        //取得召唤台的分组
        this.team = team;
        //被攻击的碰撞节点分组
        this.node.group = ms.Team[team];
        //召唤台状态标志
        this.summonStationState = ms.SummonStationState.Idle;
        
        //召唤台所有数据初始化,13个数据
        this.stationName = fightData.stationData.stationName;
        this.attackLevel = fightData.stationData.attackLevel;
        this.attackLevelNum = fightData.stationData.attackLevelNum;
        this.physicLevel = fightData.stationData.physicLevel;
        this.physicLevelNum = fightData.stationData.physicLevelNum;
        this.magicLevel = fightData.stationData.magicLevel;
        this.magicLevelNum = fightData.stationData.magicLevelNum;
        this.attack = fightData.stationData.attack;
        this.speed = fightData.stationData.speed;
        this.range = fightData.stationData.range;
        this.move = fightData.stationData.move;
        //敌方召唤台可以随机更多的hp
        if(this.team === ms.Team.Team0){
            this.maxHp = fightData.stationData.maxHp * ms.randomNormal();
            this.currentHp = this.maxHp;
        } else {
            this.maxHp = fightData.stationData.maxHp * ms.randomStrengthen();
            this.currentHp = this.maxHp;
            //敌方召唤台光环颜色随机
            this.underHalo.color = new cc.Color(255 * Math.random(), 255 * Math.random(), 255 * Math.random());
            this.upHalo.color = new cc.Color(255 * Math.random(), 255 * Math.random(), 255 * Math.random());
        }
      
        

        
    },

    //显示召唤台信息
    thisStationPress () {
        var self = this;
        //如果是敌方召唤台，则表示强制攻击召唤台，同时取消先前的控制移动
        if(this.team !== ms.Team.Team0){
            fightData.selfSelected.forEach(function(unitDataControl){
                unitDataControl.isMoving = true;
                unitDataControl.isAttacking = false;
                unitDataControl.isControlMove = false;
                unitDataControl.attackState = ms.AttackState.ForcedAttack;
                //数组过滤
                unitDataControl.forcedAttack = unitDataControl.forcedAttack.filter(function(data){
                    return data.stationName == undefined;
                });
                unitDataControl.forcedAttack.push(self);
            });
        }
        //显示对应的面板,传递当前信息
        this.UiJs.summonStationPress(this);

        //根据召唤台当前的属性信息更新对应的属性面板值
        this.summonStationData = {
            //属性信息
            stationName: self.stationName,
            attackLevel: self.attackLevel,
            attackLevelNum: self.attackLevelNum,
            physicLevel: self.physicLevel,
            physicLevelNum: self.physicLevelNum,
            magicLevel: self.magicLevel,
            magicLevelNum: self.magicLevelNum,
            attack: self.attack,
            speed: self.speed,
            range: self.range,
            move: self.move,
            //血量信息
            currentHp: self.currentHp,
            maxHp: self.maxHp,
            //召唤士头像
            summonerFrame: self.summonerFrame,
            //所属队伍
            team: self.team,
        };
        //显示信息
        this.UiJs.showStationInfo(this.summonStationData);
    },

    //被敌方攻击到掉血
    onCollisionEnter (other, self) {
        if(other.node.group === 'Bullet'){
            var unitDataControl = other.getComponent('bulletJs').unitDataControl;
            //被敌方弹道击中，计算掉血
            var damage = 0;
            if(unitDataControl.team !== this.team){
                if(unitDataControl.magicPhysic = ms.MagicPhysic.Magic){
                    damage = unitDataControl.attack * this.magicLevelNum * ms.randomNormal();
                }else{
                    damage = unitDataControl.attack * this.physicLevelNum * ms.randomNormal();
                }
                //是否被暴击
                if(Math.random() <= ms.critProbability){
                    damage *= ms.critTimes;
                    //播放暴击动画
                    this.critAnim(damage);
                }
                //计算掉血
                this.currentHp -= damage;
                if(other.node.isValid){
                    other.node.destroy();
                }
            }
        }
    },

    //暴击动画
    critAnim (damage) {
        var crit = cc.instantiate(this.critRecvory);
        crit.getComponent(cc.Label).string = Math.round(damage);
        crit.color = cc.Color.RED;
        crit.parent = this.UiJs.GameJs.map;
        crit.setPosition(this.node.position);
        crit.runAction(cc.sequence(cc.spawn(cc.moveBy(1, -20, 40), cc.scaleBy(1, 2)), cc.callFunc(function(){crit.destroy();})));
    },

    //游戏结束
    gameOver () {
        //游戏面板清除
        this.UiJs.initStationPanel();
        this.UiJs.initMonsterPanel();
        //gameOver节点获得
        var gameOverNode = this.UiJs.gameOver;
        //音效资源获得
        var AudioJs = this.UiJs.GameJs.AudioJs;
        //停止播放音乐
        cc.audioEngine.end();
        //玩家召唤台被打爆了，输了
        if(this.team === ms.Team.Team0){
            gameOverNode.getChildByName('gameResult').getComponent(cc.Label).string = 'Lose!';
            cc.audioEngine.playMusic(AudioJs.loseMusic, true);
        }else{
            gameOverNode.getChildByName('gameResult').getComponent(cc.Label).string = 'Win!';
            cc.audioEngine.playMusic(AudioJs.winMusic, true);
        }
        //面板显现
        gameOverNode.setPosition(cc.p(0, 0));
        cc.director.pause();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
