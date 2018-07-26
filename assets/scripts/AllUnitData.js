var ms = require('ms');
/* 18个属性
num编号int,查找怪物信息的标志
mp法力int,召唤时候需要消耗的量
summon召唤时间int,召唤单个怪物所需的时间
name名字string,一般是中文
lv等级int,1等级的怪可以占领中立的召唤台
race种族,分为龙，魔，兽3族，龙克魔，魔克兽，兽克龙，克制方对被克方造成1.2倍伤害，反之只造成0.8倍伤害
moveType移动类型,与地形共同影响移动速度,步行和飞行
attackType攻击类型，近战或者远程
attackProperty攻击属性，火冰雷地，火冰互克，雷地互克，分别对对方造成1.5倍伤害，同属性只造成0.6倍伤害
magicPhysic物魔性,攻击是什么类型，魔法或者物理
physicDamage物理损伤有效率,乘以攻击方的攻击力可得到损伤值
magicDamage魔法损伤有效率,乘以攻击方的攻击力可得到损伤值
hp生命int,不大于0就死了
skill特殊技能int,0表示无特殊技能,非0表示技能冷却时间
attack攻击力int,表示能对敌人造成的正常伤害
speed攻击速度int,值为40表示每秒可攻击一次 40/speed得到攻击间隔时间
range攻击范围int,敌人的距离在自己多少范围内的时候可以发动攻击
move移动速度int,单位时间内能移动的距离
*/

//9组怪物数据
const AllUnitDataList = [
	{
        num: 0,
        mp: 20,
        summon: 20,
        name: '示例怪物',
        lv: 1,
        race: ms.Race.Dragon,//  ms.Race.Dragon  ms.Race.Magic  ms.Race.Beast
        moveType: ms.MoveType.Walk,//  ms.MoveType.Walk  ms.MoveType.Fly
        attackType: ms.AttackType.Direct,//  ms.AttackType.Direct  ms.AttackType.Indirect
        attackProperty: ms.AttackProperty.Fire,//  ms.AttackProperty.Fire  ms.AttackProperty.Ice  ms.AttackProperty.Thunder  ms.AttackProperty.Ground
        magicPhysic: ms.MagicPhysic.Magic,//  ms.MagicPhysic.Magic  ms.MagicPhysic.Physic
        physicDamage: 1.0,
        magicDamage: 1.0,
        hp: 300,
        skill: 0,
        attack: 20,
        speed: 40,
        range: 1,
        move: 5,
    },

	{
        num: 1,
        mp: 5,
        summon: 12,
        name: '见习魔法师',
        lv: 1,
        race: ms.Race.Magic,//  ms.Race.Dragon  ms.Race.Magic  ms.Race.Beast
        moveType: ms.MoveType.Walk,//  ms.MoveType.Walk  ms.MoveType.Fly
        attackType: ms.AttackType.Indirect,//  ms.AttackType.Direct  ms.AttackType.Indirect
        attackProperty: ms.AttackProperty.Ground,//  ms.AttackProperty.Fire  ms.AttackProperty.Ice  ms.AttackProperty.Thunder  ms.AttackProperty.Ground
        magicPhysic: ms.MagicPhysic.Magic,//  ms.MagicPhysic.Magic  ms.MagicPhysic.Physic
        physicDamage: 1.2,
        magicDamage: 0.9,
        hp: 320,
        skill: 0,
        attack: 20,
        speed: 40,
        range: 8,
        move: 4,
    },

    {
        num: 2,
        mp: 10,
        summon: 21,
        name: '地狱恶魔',
        lv: 3,
        race: ms.Race.Magic,//  ms.Race.Dragon  ms.Race.Magic  ms.Race.Beast
        moveType: ms.MoveType.Fly,//  ms.MoveType.Walk  ms.MoveType.Fly
        attackType: ms.AttackType.Direct,//  ms.AttackType.Direct  ms.AttackType.Indirect
        attackProperty: ms.AttackProperty.Ground,//  ms.AttackProperty.Fire  ms.AttackProperty.Ice  ms.AttackProperty.Thunder  ms.AttackProperty.Ground
        magicPhysic: ms.MagicPhysic.Magic,//  ms.MagicPhysic.Magic  ms.MagicPhysic.Physic
        physicDamage: 1.0,
        magicDamage: 0.7,
        hp: 550,
        skill: 0,
        attack: 36,
        speed: 48,
        range: 1,
        move: 5,
    },

    {
        num: 3,
        mp: 12,
        summon: 24,
        name: '格斗龙',
        lv: 3,
        race: ms.Race.Dragon,//  ms.Race.Dragon  ms.Race.Magic  ms.Race.Beast
        moveType: ms.MoveType.Walk,//  ms.MoveType.Walk  ms.MoveType.Fly
        attackType: ms.AttackType.Direct,//  ms.AttackType.Direct  ms.AttackType.Indirect
        attackProperty: ms.AttackProperty.Fire,//  ms.AttackProperty.Fire  ms.AttackProperty.Ice  ms.AttackProperty.Thunder  ms.AttackProperty.Ground
        magicPhysic: ms.MagicPhysic.Physic,//  ms.MagicPhysic.Magic  ms.MagicPhysic.Physic
        physicDamage: 0.5,
        magicDamage: 1.1,
        hp: 700,
        skill: 0,
        attack: 45,
        speed: 60,
        range: 1,
        move: 6,
    },

    {
        num: 4,
        mp: 30,
        summon: 35,
        name: '三头龙',
        lv: 3,
        race: ms.Race.Dragon,//  ms.Race.Dragon  ms.Race.Magic  ms.Race.Beast
        moveType: ms.MoveType.Walk,//  ms.MoveType.Walk  ms.MoveType.Fly
        attackType: ms.AttackType.Indirect,//  ms.AttackType.Direct  ms.AttackType.Indirect
        attackProperty: ms.AttackProperty.Fire,//  ms.AttackProperty.Fire  ms.AttackProperty.Ice  ms.AttackProperty.Thunder  ms.AttackProperty.Ground
        magicPhysic: ms.MagicPhysic.Magic,//  ms.MagicPhysic.Magic  ms.MagicPhysic.Physic
        physicDamage: 0.8,
        magicDamage: 0.8,
        hp: 750,
        skill: 30,
        attack: 25,
        speed: 28,
        range: 12,
        move: 3,
    },

    {
        num: 5,
        mp: 10,
        summon: 15,
        name: '剑圣',
        lv: 2,
        race: ms.Race.Beast,//  ms.Race.Dragon  ms.Race.Magic  ms.Race.Beast
        moveType: ms.MoveType.Walk,//  ms.MoveType.Walk  ms.MoveType.Fly
        attackType: ms.AttackType.Direct,//  ms.AttackType.Direct  ms.AttackType.Indirect
        attackProperty: ms.AttackProperty.Thunder,//  ms.AttackProperty.Fire  ms.AttackProperty.Ice  ms.AttackProperty.Thunder  ms.AttackProperty.Ground
        magicPhysic: ms.MagicPhysic.Physic,//  ms.MagicPhysic.Magic  ms.MagicPhysic.Physic
        physicDamage: 0.7,
        magicDamage: 1.2,
        hp: 375,
        skill: 0,
        attack: 24,
        speed: 80,
        range: 1,
        move: 6,
    },

    {
        num: 6,
        mp: 15,
        summon: 18,
        name: '恶魔猎手',
        lv: 3,
        race: ms.Race.Magic,//  ms.Race.Dragon  ms.Race.Magic  ms.Race.Beast
        moveType: ms.MoveType.Fly,//  ms.MoveType.Walk  ms.MoveType.Fly
        attackType: ms.AttackType.Indirect,//  ms.AttackType.Direct  ms.AttackType.Indirect
        attackProperty: ms.AttackProperty.Ice,//  ms.AttackProperty.Fire  ms.AttackProperty.Ice  ms.AttackProperty.Thunder  ms.AttackProperty.Ground
        magicPhysic: ms.MagicPhysic.Magic,//  ms.MagicPhysic.Magic  ms.MagicPhysic.Physic
        physicDamage: 1.1,
        magicDamage: 0.8,
        hp: 420,
        skill: 0,
        attack: 30,
        speed: 64,
        range: 6,
        move: 5,
    },

    {
        num: 7,
        mp: 10,
        summon: 23,
        name: '火山巨人',
        lv: 2,
        race: ms.Race.Beast,//  ms.Race.Dragon  ms.Race.Magic  ms.Race.Beast
        moveType: ms.MoveType.Walk,//  ms.MoveType.Walk  ms.MoveType.Fly
        attackType: ms.AttackType.Direct,//  ms.AttackType.Direct  ms.AttackType.Indirect
        attackProperty: ms.AttackProperty.Fire,//  ms.AttackProperty.Fire  ms.AttackProperty.Ice  ms.AttackProperty.Thunder  ms.AttackProperty.Ground
        magicPhysic: ms.MagicPhysic.Physic,//  ms.MagicPhysic.Magic  ms.MagicPhysic.Physic
        physicDamage: 0.6,
        magicDamage: 0.7,
        hp: 1200,
        skill: 0,
        attack: 12,
        speed: 30,
        range: 1,
        move: 5,
    },

    {
        num: 8,
        mp: 7,
        summon: 11,
        name: '暗影刺客',
        lv: 1,
        race: ms.Race.Beast,//  ms.Race.Dragon  ms.Race.Magic  ms.Race.Beast
        moveType: ms.MoveType.Walk,//  ms.MoveType.Walk  ms.MoveType.Fly
        attackType: ms.AttackType.Direct,//  ms.AttackType.Direct  ms.AttackType.Indirect
        attackProperty: ms.AttackProperty.Thunder,//  ms.AttackProperty.Fire  ms.AttackProperty.Ice  ms.AttackProperty.Thunder  ms.AttackProperty.Ground
        magicPhysic: ms.MagicPhysic.Physic,//  ms.MagicPhysic.Magic  ms.MagicPhysic.Physic
        physicDamage: 1.0,
        magicDamage: 1.0,
        hp: 300,
        skill: 0,
        attack: 20,
        speed: 48,
        range: 1,
        move: 9,
    },

    {
        num: 9,
        mp: 12,
        summon: 23,
        name: '大魔导师',
        lv: 3,
        race: ms.Race.Magic,//  ms.Race.Dragon  ms.Race.Magic  ms.Race.Beast
        moveType: ms.MoveType.Walk,//  ms.MoveType.Walk  ms.MoveType.Fly
        attackType: ms.AttackType.Indirect,//  ms.AttackType.Direct  ms.AttackType.Indirect
        attackProperty: ms.AttackProperty.Ice,//  ms.AttackProperty.Fire  ms.AttackProperty.Ice  ms.AttackProperty.Thunder  ms.AttackProperty.Ground
        magicPhysic: ms.MagicPhysic.Magic,//  ms.MagicPhysic.Magic  ms.MagicPhysic.Physic
        physicDamage: 1.5,
        magicDamage: 0.2,
        hp: 600,
        skill: 0,
        attack: 40,
        speed: 44,
        range: 8,
        move: 4,
    }
];

module.exports = AllUnitDataList;