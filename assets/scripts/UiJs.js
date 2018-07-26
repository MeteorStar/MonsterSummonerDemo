var ms = require('ms');
var FramesJs = require('FramesJs');
var AllUnitData = require('AllUnitData');
cc.Class({
    extends: cc.Component,

    properties: {
        //召唤台总面板
        stationPanel: {
            default: null,
            type: cc.Node
        },
        //怪物信息总面板
        monsterPanel: {
            default: null,
            type: cc.Node
        },
        //各种图标
        FramesJs: {
            default: null,
            type: FramesJs
        },
        //mp,敌我怪物数量，ap显示面板
        mpApNum: {
            default: null,
            type: cc.Node
        },
        //游戏结束面板
        gameOver: {
            default: null,
            type: cc.Node
        },


    },

    // use this for initialization
    init (GameJs) {
        this.GameJs = GameJs;
        //获得stationPanel面版下的所有子面板
        this.stationMask = this.stationPanel.getChildByName('stationMask');
        this.stationInfo = this.stationPanel.getChildByName('stationInfo');
        this.stationHp = this.stationPanel.getChildByName('stationHp');
        this.summonMenu = this.stationPanel.getChildByName('summonMenu');
        this.monsterPreviewInfo = this.stationPanel.getChildByName('monsterPreviewInfo');
        this.group = this.stationPanel.getChildByName('group');
        this.suspendSummon = this.stationPanel.getChildByName('suspendSummon');
        this.suspendConfirm = this.stationPanel.getChildByName('suspendConfirm');

        //获得monsterPanel面版下的所有子面板
        this.monsterInfo = this.monsterPanel.getChildByName('monsterInfo');
        this.monsterHp = this.monsterPanel.getChildByName('monsterHp');
        this.commandMenu = this.monsterPanel.getChildByName('commandMenu');
        this.reGroup = this.monsterPanel.getChildByName('reGroup');
        this.eliminateConfirm = this.monsterPanel.getChildByName('eliminateConfirm');

        //获得mpApNum的控制脚本
        this.mpApNumJs = this.mpApNum.getComponent('mpApNumJs');

        //关闭两个主面板及其子面板
        this.initStationPanel();
        this.initMonsterPanel();
        
        //召唤台属性面板的控制脚本取得
        this.stationInfoJs = this.stationInfo.getComponent('stationInfoJs');
        this.stationHpJs = this.stationHp.getComponent('stationHpJs');
        //怪物属性面板的控制脚本取得
        this.monsterInfoJs = this.monsterInfo.getComponent('monsterInfoJs');
        this.monsterHpJs = this.monsterHp.getComponent('monsterHpJs');
        //在groupJs脚本里面获得当前召唤怪物的信息
        this.groupJs = this.group.getComponent('groupJs');

    },

    //关掉召唤台面板及所有子面板
    initStationPanel () {
        var stationPanelChildren = this.stationPanel.children;
        for(var i = 0; i < stationPanelChildren.length; i++){
            stationPanelChildren[i].active = false;
        }
        this.stationPanel.active = false;
    },

    //关掉怪物面板及所有子面板
    initMonsterPanel () {
        var monsterPanelChildren = this.monsterPanel.children;
        for(var i = 0; i < monsterPanelChildren.length; i++){
            monsterPanelChildren[i].active = false;
        }
        this.monsterPanel.active = false;
    },

    /**
     * 点击召唤台显示召唤台对应的属性信息
     */
    showStationInfo (summonStationData) {

        //属性面板的数值更新
        if(this.stationInfoJs.stationName.node.active){
            this.stationInfoJs.stationName.string = summonStationData.stationName;
        }
        this.stationInfoJs.attackLevel.string = summonStationData.attackLevel;
        this.stationInfoJs.attackLevelNum.string = summonStationData.attackLevelNum;
        this.stationInfoJs.physicLevel.string = summonStationData.physicLevel;
        this.stationInfoJs.physicLevelNum.string = summonStationData.physicLevelNum;
        this.stationInfoJs.magicLevel.string = summonStationData.magicLevel;
        this.stationInfoJs.magicLevelNum.string = summonStationData.magicLevelNum;
        this.stationInfoJs.attack.string = summonStationData.attack;
        this.stationInfoJs.speed.string = summonStationData.speed;
        this.stationInfoJs.range.string = summonStationData.range;
        this.stationInfoJs.move.string = summonStationData.move;
        //血量面板信息更新
        this.stationHpJs.hpNum.string = Math.ceil(summonStationData.currentHp) + '/' + Math.ceil(summonStationData.maxHp);
        this.stationHpJs.summonerPortrait.spriteFrame = summonStationData.summonerFrame;
        this.stationHpJs.hpProgress.progress = summonStationData.currentHp / summonStationData.maxHp;

        //己方召唤士头像无色，敌方红色
        if(summonStationData.team === ms.Team.Team0){
            this.stationHpJs.summonerPortrait.node.color = cc.Color.WHITE;
        } else {
            this.stationHpJs.summonerPortrait.node.color = cc.Color.RED;
        }
        //召唤中的图标信息更新
        if(this.stationInfoJs.iconInfo.active){
            this.stationInfoJs.summoningInfo.string = AllUnitData[this.groupJs.num].name + '召唤中';
            this.stationInfoJs.summoningPortrait.spriteFrame = this.FramesJs.bMonsterPortrait[this.groupJs.num - 1];
            this.stationInfoJs.summoningProgress.progress = this.GameJs.summonProgress;
        }
        
    },

    /**
     * stationInfo相关操作
     */
    summonStationPress (summonStationDataControl) {
        //隐藏怪物信息
        this.initMonsterPanel();

        //参数本地化
        this.summonStationDataControl = summonStationDataControl;

        this.stationPanel.active = true;
        this.stationMask.active = true;

        if(summonStationDataControl.team === ms.Team.Team0){
            switch(summonStationDataControl.summonStationState) {
                case ms.SummonStationState.Idle://显示召唤台空闲状态时候的面板
                    this.stationInfo.active = true;
                    this.stationInfoJs.stationName.node.active = true;
                    this.stationInfoJs.iconInfo.active = false;
                    this.stationHp.active = true;
                    this.summonMenu.active = true;
                    break;
                case ms.SummonStationState.Summoning://显示召唤台正在召唤状态时候的面板
                    this.stationInfo.active = true;
                    this.stationInfoJs.stationName.node.active = false;
                    this.stationInfoJs.iconInfo.active = true;
                    this.stationHp.active = true;
                    this.suspendSummon.active = true;
                    break;
            }
        } else {
            //敌方召唤台只显示召唤台信息和hp
            this.stationInfo.active = true;
            this.stationInfoJs.stationName.node.active = true;
            this.stationInfoJs.iconInfo.active = false;
            this.stationHp.active = true;
        }
    },

    /**
     * stationHp相关操作
     */
    //回到战场按钮相应
    returnBattle () {
        //关闭两个主面板及其子面板
        this.initStationPanel();
        this.initMonsterPanel();
    },

    /**
     * summonMenu相关操作
     */
    //召唤按钮相应
    summon () {
        this.summonMenu.active = false;
        this.monsterPreviewInfo.active = true; 
        //传递所选召唤台的信息 
        this.monsterPreviewInfo.getComponent('monsterPreviewInfoJs').selectedStationInfo(this.summonStationDataControl); 
    },
    //修复按钮相应
    repair () {
        this.summonMenu.active = false;
        this.stationInfo.active = false;
        this.stationHp.active = false;

        this.stationMask.active = false;
    },
    //升级按钮相应
    upgrade () {
        this.summonMenu.active = false;
        this.stationInfo.active = false;
        this.stationHp.active = false;

        this.stationMask.active = false;
    },

    /**
     * monsterPreviewInfo相关操作
     * 只相应确定和取消按钮，上下切换怪物按钮放到对应节点的脚本处理
     */
    //返回按钮相应
    monsterPreviewInfoReturn () {
        this.monsterPreviewInfo.active = false;
        this.summonMenu.active = true;
    },
    //确定按钮相应
    monsterPreviewInfoConfirm () {
        this.monsterPreviewInfo.active = false;
        this.group.active = true;
    },

    /**
     * group相关操作
     * 只相应确定和取消按钮，上下切换怪物和分组按钮放到对应节点的脚本处理
     */
    //返回按钮相应
    groupReturn () {
        this.group.active = false;
        this.monsterPreviewInfo.active = true;   
    },
    //确定按钮相应
    groupConfirm () {
        this.group.active = false;
        this.stationInfo.active = false;
        this.stationHp.active = false;

        this.stationMask.active = false;
    },

    /**
     * suspendSummon相关操作,只相应面板的显隐，后台逻辑放到对应节点的脚本处理
     */
    //中止召唤按钮相应
    suspend () {
        this.suspendSummon.active = false;
        this.suspendConfirm.active = true;   
    },

    /**
     * suspendConfirm相关操作,只相应面板的显隐，后台逻辑放到对应节点的脚本处理
     */
    //确定按钮相应
    stopConfirm () {
        this.suspendConfirm.active = false;
        this.stationInfo.active = false;
        this.stationHp.active = false;

        this.stationMask.active = false;
    },
    //取消按钮相应
    stopCancel () {
        this.suspendConfirm.active = false;
        this.stationInfo.active = false;
        this.stationHp.active = false;

        this.stationMask.active = false;
    },



    /**
     * 选中怪物后显示对应的信息面板,并更新对应属性值
     */
    //显示对应的信息面板
    monsterSelected (team, selectedData) {
        this.selectedData = selectedData;
        //快速模式不显示面板
        if(this.GameJs.fightMode === ms.FightMode.Fast)
            return;
        //清除面板
        this.initMonsterPanel();
        //选中怪物时候还可以移动查看战场
        this.monsterPanel.active = true;

        this.monsterInfo.active = true;
        this.monsterHp.active = true;
        if(team === ms.Team.Team0){
            this.commandMenu.active = true;
        }
    },
    //更新对应属性值 18个
    showMonsterInfo (monsterData) {
        //种族图标更新
        this.monsterInfoJs.race.spriteFrame = this.FramesJs.race[monsterData.race];
        //等级和名字
        this.monsterInfoJs.lv.string = monsterData.lv;
        this.monsterInfoJs.monsterName.string = monsterData.monsterName;
        //移动类型图标更新
        this.monsterInfoJs.moveType.spriteFrame = this.FramesJs.moveType[monsterData.moveType];
        //攻击类型图标更新
        this.monsterInfoJs.attackType.spriteFrame = this.FramesJs.attackType[monsterData.attackType];
        //攻击属性图标更新
        this.monsterInfoJs.attackProperty.spriteFrame = this.FramesJs.attackProperty[monsterData.attackProperty];
        //攻击物魔性标志更新
        switch (monsterData.magicPhysic) {
            case ms.MagicPhysic.Magic:
                this.monsterInfoJs.magicPhysic.string = ms.magic;
                break;
            case ms.MagicPhysic.Physic:
                this.monsterInfoJs.magicPhysic.string = ms.physic;
                break; 
        };
        //相应属性数值更新
        this.monsterInfoJs.attackLevelNum.string = ms.attackLevelNum;//目前不能升级，统一标示
        this.monsterInfoJs.physicLevelNum.string = monsterData.physicLevelNum.toFixed(1);
        this.monsterInfoJs.magicLevelNum.string = monsterData.magicLevelNum.toFixed(1);
        this.monsterInfoJs.attack.string = Math.round(monsterData.attack);
        this.monsterInfoJs.speed.string = Math.round(monsterData.speed);
        this.monsterInfoJs.range.string = Math.round(monsterData.range);
        this.monsterInfoJs.move.string = Math.round(monsterData.move);

        //血量面板信息更新
        this.monsterHpJs.hpNum.string = Math.ceil(monsterData.currentHp) + '/' + Math.ceil(monsterData.maxHp);
        this.monsterHpJs.monsterPortrait.spriteFrame = this.FramesJs.aMonsterPortrait[monsterData.num - 1];
        this.monsterHpJs.hpProgress.progress = monsterData.currentHp / monsterData.maxHp;
        if(monsterData.skill == 0){
            this.monsterHpJs.skillProgress.progress = 0;
        } else {
            this.monsterHpJs.skillProgress.progress = monsterData.skillTime / monsterData.skill;
        }
    },

    //召唤结束画面切换
    summonFinish () {
        if(this.suspendSummon.active || this.suspendConfirm.active){
            this.suspendSummon.active = false;
            this.suspendConfirm.active = false;
            this.summonMenu.active = true;
            this.stationInfoJs.stationName.node.active = true;
            this.stationInfoJs.iconInfo.active = false;
        }
    },

    /**
     * commandMenu相关操作
     */
    //释放技能按钮
    releaseSkill () {
        //关闭面板
        this.initMonsterPanel();
        //判断是否能释放技能
        this.selectedData.unitAttack.releaseSkill(this.selectedData);
    },

    /**
     * mpApNum相关操作
     */
    //点击战斗模式图标，切换操作战斗模式
    switchFightMode () {
        if(this.GameJs.fightMode === ms.FightMode.Normal){
            this.GameJs.fightMode = ms.FightMode.Fast; 
        }else{
            this.GameJs.fightMode = ms.FightMode.Normal;
        }
        //图标变换
        this.mpApNumJs.fightModeIcon.spriteFrame = this.FramesJs.fightModeIcon[this.GameJs.fightMode];
    },
    
});
