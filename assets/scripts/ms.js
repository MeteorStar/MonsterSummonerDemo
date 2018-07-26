/**
 * 怪物召唤士的名字空间
 * 全局变量和自定义api都放这里
 */
var ms = {

    //**************** 枚举值区域开始 ****************//

    /**
     * 种族: Dragon(龙), Magic(魔), Beast(兽) 龙克魔, 魔克兽, 兽克龙
     * @type cc.Enum
     */
    Race: cc.Enum({
        Dragon: -1,
        Magic: -1,
        Beast: -1,
    }),

    /**
     * 移动类型: Walk(步行), Fly(飞行)
     * @type cc.Enum
     */
    MoveType: cc.Enum({
        Walk: -1,
        Fly: -1,
    }),

    /**
     * 攻击类型: Direct(直接攻击), Indirect(间接攻击)
     * @type cc.Enum
     */
    AttackType: cc.Enum({
        Direct: -1,
        Indirect: -1,
    }),

    /**
     * 攻击属性: Fire(火), Ice(冰), Thunder(雷), Ground(地)
     * @type cc.Enum
     */
    AttackProperty: cc.Enum({
        Fire: -1,
        Ice: -1,
        Thunder: -1,
        Ground: -1,
    }),

    /**
     * 攻击物魔性: Magic(魔法), Physic(物理)
     * @type cc.Enum
     */
    MagicPhysic: cc.Enum({
        Magic: -1,
        Physic: -1,
    }),

    /**
     * 召唤台，怪物所属的队伍: Team0(队伍0玩家所属的队伍), Team1(敌方怪物队伍), Team2(敌方怪物队伍)
     * @type cc.Enum
     */
    Team: cc.Enum({
        Team0: -1,
        Team1: -1,
        Team2: -1,
    }),

    /**
     * unit单位的类型: Master(怪物), Summoner(召唤士)
     * @type cc.Enum
     */
    UnitType: cc.Enum({
        Master: -1,
        Summoner: -1,
    }),

    /**
     * 召唤台的当前状态: Idle(空闲), Summoning(正在召唤), Repairing(正在修复)
     * @type cc.Enum
     */
    SummonStationState: cc.Enum({
        Idle: -1,
        Summoning: -1,
        Repairing: -1,
    }),

    /**
     * 怪物当前播放的动画状态: 
     * 
     * move0(↑上移动)
     * move1(↗右上移动)
     * move2(→右移动)
     * move3(↘右下移动)
     * move4(↓下移动)
     * move5(↙左下移动)
     * move6(←左移动)
     * move7(↖左上移动)
     * 
     * attack0(↑上攻击)
     * attack1(↗右上攻击)
     * attack2(→右攻击)
     * attack3(↘右下攻击)
     * attack4(↓下攻击)
     * attack5(↙左下攻击)
     * attack6(←左攻击)
     * attack7(↖左上攻击)
     * 
     * die0(↑上死亡)
     * die1(↗右上死亡)
     * die2(→右死亡)
     * die3(↘右下死亡)
     * die4(↓下死亡)
     * die5(↙左下死亡)
     * die6(←左死亡)
     * die7(↖左上死亡)
     * @type cc.Enum
     */
    MonsterAnimState: cc.Enum({
        move0: -1,
        move1: -1,
        move2: -1,
        move3: -1,
        move4: -1,
        move5: -1,
        move6: -1,
        move7: -1,

        attack0: -1,
        attack1: -1,
        attack2: -1,
        attack3: -1,
        attack4: -1,
        attack5: -1,
        attack6: -1,
        attack7: -1,

        die0: -1,
        die1: -1,
        die2: -1,
        die3: -1,
        die4: -1,
        die5: -1,
        die6: -1,
        die7: -1,  
    }),

    /**
     * 控制怪物战斗的模式: Normal(正常模式，点击怪物会显示3面板), Fast(快速模式，点击怪物不会显示面板)
     * @type cc.Enum
     */
    FightMode: cc.Enum({
        Normal: -1,
        Fast: -1,
    }),

    /**
     * 玩家怪物的攻击状态: None(没有攻击对象), AutomaticAttack(去攻击自动攻击对象), 
     * CounterAttack(去攻击反击对象),ForcedAttack(去攻击强制攻击对象),
     * @type cc.Enum
     */
    AttackState: cc.Enum({
        None: -1,
        AutomaticAttack: -1,
        CounterAttack: -1,
        ForcedAttack: -1,
    }),

    //**************** 枚举值区域结束 ****************//


    //**************** 常量区域开始 ****************//

    /**
    * 弹道速度是移动速度的倍率,3
    */
    BulletTimesToMoveSpeed: 3,

    /**
    * 动画的动画的帧速率，影响动画的播放，12
    * 值越大，播放越快(单次播放持续的时间越短)
    */
    Sample: 12,

    /**
     * 怪物属性speed转化为时间s的转化率，40 
     * speedRate / speed 即可得到每次攻击的时间间隔
     */
    speedRate: 40,

    /**
     * 怪物的基础攻击距离 30
     */
    rangeBase: 30,

    /**
     * 怪物属性range转化为像素距离的比例，40
     * rangeBase + rangeRate * range 即可得到实际的攻击距离
     */
    rangeRate: 40,

    /**
     * 怪物的基础移速 20
     */
    moveBase: 20,

    /**
     * 怪物属性move转化为像素距离的比例，20
     * moveBase + moveRate * move 即可得到实际的每秒移动距离
     */
    moveRate: 20,

    /**
     * 当前总的怪物数量, 9
     */
    monsterTotalNum: 9,

    /**
     * 单次召唤相同怪的最小数量, 1
     */
    minSummonNum: 1,

    /**
     * 单次召唤相同怪的最大数量, 10
     */
    maxSummonNum: 10,

    /**
     * 召唤怪的最小分组编号, 1
     */
    minGroupNum: 1,

    /**
     * 召唤怪的最大分组编号, 8
     */
    maxGroupNum: 8,

    /**
     * 怪物初始攻击等级为0所对应的攻击系数, 1.0
     */
    attackLevelNum: 1.0,

    /**
     * 怪物攻击伤害类型为魔法的标志, '魔'
     */
    magic: '魔',

    /**
     * 怪物攻击伤害类型为物理的标志, '物'
     */
    physic: '物',

    /**
     * 怪物受伤掉血的判断碰撞圆的半径, 80
     */
    hurtRadius: 80,

    /**
     * 发现并追击敌人的判断碰撞圆的半径, 600
     */
    findRadius: 600,

    /**
     * 怪物之间防止重叠的判断碰撞圆的半径, 50
     */
    overlappingRadius: 50,

    /**
     * 召唤士单位额外的hp附加, 1000
     */
    summonerExtraHp: 1000,

    /**
     * 召唤士单位攻击的额外系数, 1.5
     */
    summonerSubtractionAttack: 1.5,

    /**
     * 怪物随机在召唤台附近坐标x的变动范围, 400
     */
    summonedX: 400,

    /**
     * 怪物随机在召唤台附近坐标y的变动范围, 300
     */
    summonedY: 300,

    /**
     * 怪物的选取框正方形的边长 110 ,处理怪物在召唤台附近的防重叠生成的逻辑
     */
    monsterSelected: 110,

    /**
     * 召唤台的选取框正方形的边长 160 ,处理怪物在召唤台附近的防重叠生成的逻辑
     */
    summonStationSelected: 160,

    /**
     * 所有怪物攻击暴击的概率 0.15
     */
    critProbability: 0.15,

    /**
     * 所有怪物攻击暴击的倍数 2.5
     */
    critTimes: 2.5,

    /**
     * 种族克制伤害加成系数 1.2
     */
    raceRestraintAddition: 1.2,

    /**
     * 种族被克伤害削减系数 0.8
     */
    raceRestraintedReduce: 0.8,

    /**
     * 攻击属性克制伤害加成系数 1.5
     */
    attackPropertyAddition: 1.5,

    /**
     * 攻击属性相同伤害削减系数 0.5
     */
    attackPropertyReduce: 0.5,

    //**************** 常量区域结束 ****************//


    //**************** 函数区域开始 ****************//

    /**
    * 随机一个范围 min~max 的小数
    * @param min 随机的下限
    * @param max 随机的上限
    */
    random (min, max) {
        var ratio = Math.random();
        return min + (max - min) * ratio;
    },

    /**
    * 随机一个范围 min~max 的整数
    * @param min 随机的下限
    * @param max 随机的上限
    */
    randomInt (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
 
    /**
    * 弱化随机，随机0.4~0.8的小数
    */
    randomWeak () {
        return this.random(0.4, 0.8);
    },

    /**
    * 正常随机：随机一个范围 0.8~1.2 的小数
    * 怪物属性初始化的时候，都会在基础数值上 * 一个正常随机的系数
    */
    randomNormal () {
        return this.random(0.8, 1.2);
    },

    /**
    * 增强随机，随机1.2~1.6的小数
    */
    randomStrengthen () {
        return this.random(1.2, 1.6);
    },

    /**
    * 以一定的速度匀速运动
    * @param {cc.Vec2} currentPosition 当前坐标
    * @param {cc.Vec2} destinationPosition 目的地坐标
    * @param {num} speed 移动速度(像素为单位)
    */
    moveToSpeed (currentPosition, destinationPosition, speed) {
        var distance = cc.pDistance(currentPosition, destinationPosition);
        var time = distance / speed;
        return cc.moveTo(time, destinationPosition);
    },

    /**
    * 用resources文件夹图集里面的精灵帧直接生成clip，然后加入到对应的Animation组件上，
    * 其中move是cc.WrapMode.Loop模式，attack和die是正常模式，
    * 24个clip名字依次为move0--move7，attack0--attack7，die0--die7
    * 动画加载完后会播放move0动画
    * @param {Int} num 怪物的编号,必须为大于0的整数
    * @param {cc.Animation} anim 怪物的Animation组件，一般默认有24个clip(move，attack，die各8个)
    */
    makeClipsToAnimation (num, anim) {
        //monsterFrame/1/attack.plist
        var action = ['move', 'attack', 'die'];
        for(var actionNum = 0; actionNum < 3; actionNum++){
            var url = 'monsterFrame' + '/' +
                        num.toString() + '/' +
                        action[actionNum];

            cc.loader.loadRes(url, cc.SpriteAtlas, function (err, atlas) {
                if(err){
                    cc.error(err);
                    return;
                }
            
                var atlasName = atlas.name.slice(0,atlas.name.indexOf('.'));
                for(var direction = 0, frames = []; direction < 8; direction++){
                    for(var number = 0; number < 6; number++){
                        var spriteFrame = atlas.getSpriteFrame(atlasName + direction.toString() + number.toString());
                        frames.push(spriteFrame);
                    }
                    var clip = cc.AnimationClip.createWithSpriteFrames(frames, ms.Sample);
                    clip.name = atlasName + direction.toString();
                    if(atlasName === 'move'){
                        clip.wrapMode = cc.WrapMode.Loop;
                    }
                    anim.addClip(clip); 
                    frames = [];
                }
                //动画加载完后会播放move0动画
                anim.play('move0');
            });
        }    
    },

    /**限制穿墙函数，selfNode到了wallsNode的边缘会被限制在边缘,
     * 上下左右四个方向都限制，防止模型跑出屏幕外
     * @param {cc.Node} selfNode 被限制的节点
     * @param {cc.Node} wallsNode 界限节点
     */
    unThroughWalls (selfNode, wallsNode) {

        if((selfNode.x + selfNode.width/2) > wallsNode.width/2){//限右
            selfNode.x = wallsNode.width/2 - selfNode.width/2;
        } 
        if((selfNode.x - selfNode.width/2) < -wallsNode.width/2){//限左
            selfNode.x = -(wallsNode.width/2 - selfNode.width/2);
        }
        if((selfNode.y + selfNode.height/2) > wallsNode.height/2){//限上
            selfNode.y = wallsNode.height/2 - selfNode.height/2;
        } 
        if((selfNode.y - selfNode.height/2) < -wallsNode.height/2){//限上
            selfNode.y = -(wallsNode.height/2 - selfNode.height/2);
        }
    },

    /**
     * 根据节点的位置和宽高生成包围框矩形
     * @param {cc.Vec2} position 节点的位置
     * @param {num} width 节点的宽度
     * @param {num} height 节点的高度
     */
    rect: function(position, width, height){
        return new cc.Rect(position.x - width/2, position.y - height/2, width, height);
    },

    //**************** 函数区域结束 ****************//

};

/**
* 让ms名字空间可以被其他文件直接访问
*/
window.ms = ms;

module.exports = ms;




