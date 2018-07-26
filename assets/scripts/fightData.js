var ms = require('ms');
//存放所有游戏战斗时的通用数据，每个脚本都可以对这里的数据进行读写
module.exports = {
    
    //召唤台的初始数据
    stationData: {
        stationName: '召唤台',

        attackLevel: '攻击等级L0',
        attackLevelNum: 1,
        physicLevel: '物防等级L0',
        physicLevelNum: 0.2,
        magicLevel: '魔防等级L0',
        magicLevelNum: 0.15,

        attack: 0,
        speed: 0,
        range: 0,
        move: 0,

        maxHp: 2000,
    },

    //所有怪物独一无二的标识
    monsterID: 0,

    //己方怪物分组信息,ms.maxGroupNum个分组，每个分
    //二级数组里面保存的是能唯一识别怪物并且保存足够多信息的unitDataControl脚本
    selfGroup: [],

    //记录己方所有怪物信息的数组
    selfAllMonster: [],

    //记录敌方所有怪物信息的数组
    otherAllMonster: [],

    //己方单位被选中的怪物信息数组
    selfSelected: [],
    

}
