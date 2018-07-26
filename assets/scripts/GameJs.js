var ms = require('ms');
var fightData = require('fightData');
var AllUnitData = require('AllUnitData');
var AudioJs = require('AudioJs');
cc.Class({
    extends: cc.Component,

    properties: {
        Ui: {
            default: null,
            type: cc.Node
        },

        summonStation: {
            default: null,
            type: cc.Prefab
        },

        map: {
            default: null,
            type: cc.Node
        },

        unit: {
            default: null,
            type: cc.Prefab
        },

        AudioJs: {
            default: null,
            type: AudioJs,
        },


        
    },

    // use this for initialization
    onLoad: function () {
        //清理数据
        this.clearData();
        //恢复场景
        cc.director.resume();
        //播放背景音乐
        cc.audioEngine.playMusic(this.AudioJs.fightBGM, true);
        //对怪物数组进行初始化
        for(var i = 0; i < ms.maxGroupNum; i++){
            fightData.selfGroup.push([]);
        }

        //开启碰撞
        this.collisionManager = cc.director.getCollisionManager();
        this.collisionManager.enabled = true;
        //this.collisionManager.enabledDebugDraw = true;

        //UI界面初始化
        this.UiJs = this.Ui.getComponent('UiJs');
        this.UiJs.init(this);

        //初始化己方召唤台
        this.generateSummonStation(ms.Team.Team0, this.map, cc.p(-900, 0), this.UiJs);
        //初始化敌方方召唤台
        this.generateSummonStation(ms.Team.Team1, this.map, cc.p(900, 0), this.UiJs);

        //初始化操作战斗的模式
        this.fightMode = ms.FightMode.Normal;

        //召唤台是否开始召唤的标志
        this.startSummon = false;
        //召唤的进度
        this.summonProgress = 0;

        //监听map的触点位置，并命令每个被选中的单位移动
        //移动屏幕是切换视图，点击是控制怪物移动
        this.touchMoveNum = 0;
        this.map.on('touchstart', function(touch){
            this.touchMoveNum = 0;
        }, this);

        this.map.on('touchmove', function(touch){
            this.touchMoveNum++;
        }, this);

        this.map.on('touchend', function(touch){
            if(this.touchMoveNum <= 5){
                //多触摸以第一个触点为准
                var touches = touch.getTouches();
                var touchLocation = touches[0].getLocation();
                var touchPosition = this.map.convertToNodeSpaceAR(touchLocation);
                if(fightData.selfSelected){
                    fightData.selfSelected.forEach(function (unitDataControl) {
                        unitDataControl.unitAction.getTouchPosition(touchPosition);
                        unitDataControl.isMoving = true;
                        unitDataControl.isAttacking = false;
                        unitDataControl.unitAttack.timer = 0;
                        //控制移动，取消强制攻击
                        unitDataControl.isControlMove = true;
                        unitDataControl.attackState = ms.AttackState.None;
                        unitDataControl.forcedAttack = []; 
                    });
                } 
            }
        }, this);


        //this.generateMonster (2, 0, 2, 1, 0, cc.p(-600, 0));
        //this.generateMonster (3, 0, 3, 1, 1, cc.p(-200, 0));
        //this.generateMonster (4, 1, 4, 1, 1, cc.p(600, 0));
        //ai逻辑。每30秒产生一个怪
        this.schedule(function(){
            var num = ms.randomInt(1, 9);
            var boss = ms.randomInt(1, 9);
            if( Math.random() <= 0.3 ){
                this.summon1Monster(boss, 1, 1, ms.Team.Team1, this.map, cc.p(900, 0), this.UiJs);
            }
            this.summon1Monster(num, 0, 1, ms.Team.Team1, this.map, cc.p(900, 0), this.UiJs);
        }, 30);
        
        //80秒集体进攻
        this.schedule(function(){
            fightData.otherAllMonster.forEach(function (unitDataControl) {
                if(!unitDataControl.isMoving && !unitDataControl.isAttacking){
                    unitDataControl.unitAction.getTouchPosition(cc.p(-600, 0));
                    unitDataControl.isMoving = true;
                    unitDataControl.isAttacking = false;
                    unitDataControl.isControlMove = true;
                    unitDataControl.attackState = ms.AttackState.None;
                    unitDataControl.unitAttack.timer = 0;
                }
            });
        }, 120);

    },

    /**
     * 在战场map生成召唤台
     * @param {ms.Team} team 召唤台所属的队伍
     * @param {cc.Node} parentNode 召唤台节点所属的父节点，一般为this.map
     * @param {cc.Vec2} position 召唤台的位置，实际位置会在position附近随机
     * @param UiJs 传递ui界面管理的总脚本, this.UiJs
     */
    generateSummonStation (team, parentNode, position, UiJs) {
        var summonStation = cc.instantiate(this.summonStation);
        summonStation.parent = parentNode;
        summonStation.setPosition(position.x * ms.randomNormal(), position.y * ms.randomNormal());
        summonStation.getComponent('summonStationDataControl').init(team, UiJs);
    },

    /**
     * 确定召唤后在召唤台附近生成怪物(也可以用来生成召唤士，初始每方一个召唤士，召唤士死亡或者召唤台被打爆就输了)
     * @param {Int} num 怪物编号 (目前1-9)
     * @param {ms.UnitType} unitType 怪物的类型: Master(怪物), Summoner(召唤士)
     * @param {Int} group 怪物所属的分组 (目前1-8)
     * @param {Int} summonNum 召唤相同怪物的数量,没限制
     * @param {ms.Team} team 怪物所属的队伍
     * @param {cc.Vec2} position 召唤怪物的召唤台的位置，怪物实际位置会在position附近随机
     */
    generateMonster (num, unitType, group, summonNum, team, position) {
        //本地化参数
        this.num = num;
        this.unitType = unitType;
        this.group = group;
        this.summonNum = summonNum;
        this.team = team;
        this.position = position;

        this.summonTimer = 0;
        this.startSummon = true;
        this.summon = AllUnitData[num].summon;   
    },

    //召唤一个怪物的函数
    summon1Monster (num, unitType, group, team, map, position, UiJs) {
        var unit = cc.instantiate(this.unit);
        unit.parent = this.map;
        //随机在召唤台附近生成一个位置，怪物不能跟召唤台重叠
        var summonStationRect = ms.rect(position, ms.summonStationSelected, ms.summonStationSelected);
        this.monsterPosition = cc.p();
        for(var i = 0; i < 20; i++){
            var monsterPosition = cc.p(position.x + ms.summonedX * cc.randomMinus1To1(), position.y + ms.summonedY * cc.randomMinus1To1());
            var monsterRect = ms.rect(monsterPosition, ms.monsterSelected, ms.monsterSelected);
            if(!cc.rectIntersectsRect(summonStationRect, monsterRect)){
                this.monsterPosition = monsterPosition;
                break;
            }
            if(i >= 19){
                cc.error('没有空闲区域让怪物生成了');
            }
        }
        unit.setPosition(this.monsterPosition);
        unit.getComponent('unitDataControl').init(num, unitType, group, team, map, UiJs); 
    },

    //响应中断召唤确定按钮
    suspendSummon () {
        this.startSummon = false;
        this.summonTimer = 0;
        this.summonProgress = 0;
        this.UiJs.stationInfoJs.summoningProgress.progress = 0;
        this.UiJs.summonStationDataControl.summonStationState = ms.SummonStationState.Idle;
    },

     //重新开始游戏
     restart () {
        cc.director.loadScene('fighting', function(){cc.director.resume();});
        cc.director.resume();
        this.clearData();
    },

    //退出游戏
    exit () {
        cc.director.loadScene('Home', function(){cc.director.resume();});
        cc.director.resume();
        this.clearData();
    },

    //清理数据
    clearData () {
        //数据初始化
        fightData.monsterID = 0;
        fightData.selfGroup = [];
        fightData.selfAllMonster = [];
        fightData.otherAllMonster = [];
        fightData.selfSelected = [];
    },

    update (dt) {
        //如果开始召唤
        if(this.startSummon){
            this.summonTimer += dt;
            this.summonProgress = this.summonTimer / this.summon;
            //召唤进度实时更新
            this.UiJs.stationInfoJs.summoningProgress.progress = this.summonProgress;
            if(this.summonTimer >= this.summon){
                this.summon1Monster(this.num, this.unitType, this.group, this.team, this.map, this.position, this.UiJs);
                this.summonTimer = 0;
                this.summonNum--;
                if(this.summonNum <= 0){
                    //召唤结束
                    this.startSummon = false;
                    if(this.UiJs.summonStationDataControl){//ai生成怪物的逻辑不需要召唤台
                        this.UiJs.summonStationDataControl.summonStationState = ms.SummonStationState.Idle;
                    }
                    this.UiJs.summonFinish();
                }
            }
        }

    },

    

    
});
