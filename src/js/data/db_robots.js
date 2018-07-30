
// 模拟机器人数据库
export default {
  '001': {
    icon: 'hero.png',
    name: '塞巴斯塔',
    HP: 4000,
    EN: 140,
    flexibility: 110,
    armour: 1200,
    move: 7,
    orientation: ['A', 'A', 'B', 'A'], // 地形适应能力，对应 空、陆、海、宇
    weapons: [
      {
        name: '闪光飞弹',
        power: 1800,
        range: [1, 7], // 射程
        attr: ['p', 'b'] // 属性：移动后可攻击，光束类武器
      }
    ],
    abilities: {
      'split': {
        name: '分身',
        require: 130
      }
    },
    parts: [] // 安装在机体的增强零件
  },
  '002': {
    icon: 'hero.png',
    name: '高达Z',
    HP: 3800,
    EN: 160,
    flexibility: 120,
    armour: 900,
    move: 6,
    orientation: ['D', 'A', 'C', 'A'], // 地形适应能力，对应 空、陆、海、宇
    weapons: [
      {
        name: '高能光束步枪',
        power: 3000,
        range: [2, 7], // 射程
        attr: ['b'] // 属性：移动后可攻击，光束类武器
      }
    ],
    abilities: {
      'transform': {
        name: '变形'
      }
    },
    parts: [] // 安装在机体的增强零件
  },
  '501': {
    icon: 'enemy.png',
    name: '塞巴斯塔',
    HP: 4000,
    EN: 140,
    flexibility: 110,
    armour: 1200,
    move: 7,
    orientation: ['A', 'A', 'B', 'A'], // 地形适应能力，对应 空、陆、海、宇
    weapons: [
      {
        name: '闪光飞弹',
        power: 1800,
        range: [1, 7], // 射程
        attr: ['p', 'b'] // 属性：移动后可攻击，光束类武器
      }
    ],
    abilities: {},
    parts: [] // 安装在机体的增强零件
  },
  '502': {
    icon: 'enemy.png',
    name: '高达Z',
    HP: 3800,
    EN: 160,
    flexibility: 120,
    armour: 900,
    move: 6,
    orientation: ['D', 'A', 'C', 'A'], // 地形适应能力，对应 空、陆、海、宇
    weapons: [
      {
        name: '高能光束步枪',
        power: 3000,
        range: [2, 7], // 射程
        attr: ['b'] // 属性：移动后可攻击，光束类武器
      }
    ],
    abilities: {},
    parts: [] // 安装在机体的增强零件
  }
}
