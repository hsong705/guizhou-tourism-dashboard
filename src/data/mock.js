/**
 * 贵州省旅游数智互联平台暨旅游驾驶舱 - 模拟数据（省级 + 市级）
 */
import { fluctuate, randomInt } from '../utils/format.js'

// ===== 基础数据 =====

// 贵州省9个市州及中心坐标
export const cities = [
  { name: '贵阳市', code: '520100', coord: [106.71, 26.57] },
  { name: '遵义市', code: '520300', coord: [106.93, 27.73] },
  { name: '六盘水市', code: '520200', coord: [104.83, 26.59] },
  { name: '安顺市', code: '520400', coord: [105.95, 26.25] },
  { name: '毕节市', code: '520500', coord: [105.29, 27.30] },
  { name: '铜仁市', code: '520600', coord: [109.19, 27.72] },
  { name: '黔东南州', code: '522600', coord: [107.98, 26.58] },
  { name: '黔南州', code: '522700', coord: [107.52, 26.26] },
  { name: '黔西南州', code: '522300', coord: [104.90, 25.08] },
]

// 重点景区数据（省级地图方形气泡展示）
export const keyScenicSpots = [
  {
    name: '黔灵山公园',
    shortName: '黔灵山',
    coord: [106.69, 26.61],
    city: '贵阳市',
    level: 'AAAA',
    type: '自然风光·城市公园',
    area: '426公顷',
    description: '黔灵山公园位于贵阳市中心云岩区，是集自然风光、文物古迹、民俗风情和娱乐休闲为一体的综合性公园，素有"黔南第一山"之称。园内峰峦叠翠，古木参天，湖光山色相映成趣，是贵阳市著名的城市名片和市民休闲胜地。',
    openTime: '06:30-22:00',
    image: '/scenic/qianlingshan.jpeg',
    baseFlow: 12000,
    capacity: 30000,
  },
  {
    name: '青岩古镇',
    shortName: '青岩古镇',
    coord: [106.68, 26.34],
    city: '贵阳市',
    level: 'AAAAA',
    type: '历史文化·古镇',
    area: '3.6平方公里',
    description: '青岩古镇位于贵阳市花溪区南部，始建于明洪武十一年（1378年），距今已有600多年历史，是贵州四大古镇之一。古镇内保存了大量明清时期的古建筑，佛教、道教、天主教和基督教四教并存，被誉为"中国最具魅力小镇"之一。',
    openTime: '08:10-17:40',
    image: '/scenic/qingyan.jpeg',
    baseFlow: 10000,
    capacity: 25000,
  },
  {
    name: '黄果树瀑布',
    shortName: '黄果树',
    coord: [105.67, 25.99],
    city: '安顺市',
    level: 'AAAAA',
    type: '自然风光·瀑布',
    area: '115平方公里',
    description: '黄果树瀑布位于安顺市镇宁布依族苗族自治县，是亚洲最大的瀑布之一，瀑布高77.8米、宽101米，气势磅礴，雄伟壮观。景区内包含陡坡塘瀑布、天星桥景区等，是贵州旅游的标志性名片，享有"中华第一瀑"之美誉。',
    openTime: '07:30-18:00',
    image: '/scenic/huangguoshu.jpeg',
    baseFlow: 28000,
    capacity: 50000,
  },
  {
    name: '荔波漳江风景名胜区',
    shortName: '荔波漳江',
    coord: [107.88, 25.30],
    city: '黔南州',
    level: 'AAAAA',
    type: '自然风光·喀斯特',
    area: '273平方公里',
    description: '荔波漳江风景名胜区位于黔南州荔波县，是世界自然遗产——中国南方喀斯特的核心区域。景区以小七孔、大七孔为代表，集山、水、林、洞、湖泊和瀑布于一体，被誉为"地球腰带上的绿宝石"，是中国最美的地方之一。',
    openTime: '07:30-17:00',
    image: '/scenic/libo.jpeg',
    baseFlow: 22000,
    capacity: 40000,
  },
  {
    name: '西江千户苗寨',
    shortName: '千户苗寨',
    coord: [108.18, 26.58],
    city: '黔东南州',
    level: 'AAAA',
    type: '民俗文化·村寨',
    area: '50平方公里',
    description: '西江千户苗寨位于黔东南州雷山县，是中国最大的苗族聚居村寨，拥有1200多户、6000余人口。苗寨依山而建，层层叠叠的吊脚楼蔚为壮观，被誉为"苗族民族文化艺术馆"。寨内保留着完整的苗族原生态文化，是了解苗族文化的最佳去处。',
    openTime: '全天开放',
    image: '/scenic/xijiang.jpeg',
    baseFlow: 19000,
    capacity: 35000,
  },
  {
    name: '赤水丹霞',
    shortName: '赤水丹霞',
    coord: [105.70, 28.57],
    city: '遵义市',
    level: 'AAAAA',
    type: '自然风光·丹霞地貌',
    area: '722平方公里',
    description: '赤水丹霞位于遵义市赤水市，是世界自然遗产——中国丹霞的重要组成部分，以艳丽鲜红的丹霞赤壁、拔地而起的孤峰窄脊、仪态万千的奇山异石为代表。景区内还有十丈洞大瀑布等壮美景观，是中国丹霞地貌面积最大、发育最美丽的地区之一。',
    openTime: '08:00-17:00',
    image: '/scenic/chishui.jpeg',
    baseFlow: 15000,
    capacity: 30000,
  },
  {
    name: '万峰林',
    shortName: '万峰林',
    coord: [104.96, 25.05],
    city: '黔西南州',
    level: 'AAAA',
    type: '自然风光·喀斯特',
    area: '2000平方公里',
    description: '万峰林位于黔西南州兴义市，是中国最大的喀斯特峰林，被誉为"中国最美的五大峰林"之一。峰林形态奇特，造型秀美，明代旅行家徐霞客曾赞叹"天下山峰何其多，唯有此处峰成林"。景区内布依族村寨点缀其间，田园风光如诗如画。',
    openTime: '08:00-18:00',
    image: '/scenic/wanfenglin.jpeg',
    baseFlow: 8500,
    capacity: 20000,
  },
  {
    name: '梵净山',
    shortName: '梵净山',
    coord: [108.68, 27.90],
    city: '铜仁市',
    level: 'AAAAA',
    type: '自然风光·佛教名山',
    area: '775平方公里',
    description: '梵净山位于铜仁市江口县、印江县、松桃县交界处，是世界自然遗产和世界生物圈保护区，中国第五大佛教名山。其标志性景观"红云金顶"拔地而起，巍峨壮观。梵净山保存了世界上罕见的亚热带原生生态系统，是黔金丝猴的唯一栖息地。',
    openTime: '08:00-15:00',
    image: '/scenic/fanjingshan.jpeg',
    baseFlow: 17000,
    capacity: 28000,
  },
  {
    name: '中国天眼',
    shortName: '天眼',
    coord: [106.86, 25.65],
    city: '黔南州',
    level: 'AAAA',
    type: '科技科普·天文',
    area: '30平方公里',
    description: '中国天眼（FAST，500米口径球面射电望远镜）位于黔南州平塘县克度镇，是世界最大单口径、最灵敏的射电望远镜，被誉为"中国睁眼看世界的天眼"。景区包含天文体验馆、天幕商业街等科普设施，是中国重要的天文科普教育基地。',
    openTime: '08:30-17:00',
    image: '/scenic/tianyan.jpeg',
    baseFlow: 6500,
    capacity: 15000,
  },
]

/**
 * 生成景区实时数据（累计入园、实时在园、热力图数据）
 */
export function generateScenicRealtimeData(spot) {
  if (!spot) return null
  const base = spot.baseFlow || 10000
  const cap = spot.capacity || base * 1.8

  // 今日累计入园
  const todayEntry = fluctuate(base, 0.08)
  // 实时在园人数（约为累计入园的40%-65%）
  const realtimeInPark = Math.round(todayEntry * (0.4 + Math.random() * 0.25))

  // 热力图数据：模拟景区内各区域人流密度
  const centerCoord = spot.coord
  const areas = [
    '主入口', '核心游览区', '休息服务区', '停车场上区', '停车场下区',
  ]
  const heatmapData = areas.map((area, i) => {
    // 各区域偏离中心的位置
    const offsetX = (i % 3 - 1) * 0.015
    const offsetY = (Math.floor(i / 3) - 0.5) * 0.012
    // 密度值：核心区最高，外围递减
    const densityRatios = [0.65, 1.0, 0.55, 0.35, 0.28]
    const density = Math.round(realtimeInPark * densityRatios[i] * (0.85 + Math.random() * 0.3))
    return {
      area,
      coord: [centerCoord[0] + offsetX, centerCoord[1] + offsetY],
      value: density,
    }
  })

  return {
    todayEntry,
    realtimeInPark,
    capacity: cap,
    loadRate: (realtimeInPark / cap * 100).toFixed(1),
    heatmapData,
  }
}

// 热门景区
export const scenicSpots = [
  { name: '黄果树瀑布', city: '安顺市', baseFlow: 28000 },
  { name: '荔波小七孔', city: '黔南州', baseFlow: 22000 },
  { name: '西江千户苗寨', city: '黔东南州', baseFlow: 19000 },
  { name: '梵净山', city: '铜仁市', baseFlow: 17000 },
  { name: '赤水丹霞', city: '遵义市', baseFlow: 15000 },
  { name: '镇远古城', city: '黔东南州', baseFlow: 13000 },
  { name: '青岩古镇', city: '贵阳市', baseFlow: 12000 },
  { name: '龙宫景区', city: '安顺市', baseFlow: 11000 },
  { name: '百里杜鹃', city: '毕节市', baseFlow: 10000 },
  { name: '织金洞', city: '毕节市', baseFlow: 9000 },
]

// 消费类型
export const consumTypes = [
  { name: '住宿', key: 'hotel', ratio: 0.32, color: '#2c92ff' },
  { name: '餐饮', key: 'food', ratio: 0.25, color: '#00e4ff' },
  { name: '门票', key: 'ticket', ratio: 0.18, color: '#ffc53d' },
  { name: '交通', key: 'transport', ratio: 0.14, color: '#36d7a0' },
  { name: '购物', key: 'shopping', ratio: 0.11, color: '#a855f7' },
]

// ===== 各市州区县数据 =====
export const cityDistricts = {
  '520100': { // 贵阳市
    name: '贵阳市',
    baseFlow: 125000,
    baseConsum: 42000000,
    districts: [
      { name: '南明区', code: '520102', coord: [106.71, 26.57], baseFlow: 28000 },
      { name: '云岩区', code: '520103', coord: [106.72, 26.60], baseFlow: 26000 },
      { name: '花溪区', code: '520111', coord: [106.67, 26.41], baseFlow: 18000 },
      { name: '乌当区', code: '520112', coord: [106.75, 26.63], baseFlow: 12000 },
      { name: '白云区', code: '520113', coord: [106.63, 26.68], baseFlow: 14000 },
      { name: '观山湖区', code: '520115', coord: [106.62, 26.60], baseFlow: 16000 },
      { name: '清镇市', code: '520181', coord: [106.47, 26.56], baseFlow: 8000 },
      { name: '修文县', code: '520123', coord: [106.59, 26.84], baseFlow: 5000 },
      { name: '息烽县', code: '520122', coord: [106.74, 27.09], baseFlow: 4000 },
      { name: '开阳县', code: '520121', coord: [106.87, 27.06], baseFlow: 4500 },
    ],
    scenic: [
      { name: '青岩古镇', baseFlow: 12000 },
      { name: '甲秀楼', baseFlow: 8000 },
      { name: '天河潭', baseFlow: 6500 },
      { name: '黔灵山公园', baseFlow: 5500 },
      { name: '花溪公园', baseFlow: 4500 },
      { name: '红枫湖', baseFlow: 3800 },
      { name: '修文阳明洞', baseFlow: 3000 },
      { name: '息烽集中营', baseFlow: 2500 },
      { name: '开阳南江大峡谷', baseFlow: 2200 },
      { name: '观山湖公园', baseFlow: 2000 },
    ],
  },
  '520300': { // 遵义市
    name: '遵义市',
    baseFlow: 98000,
    baseConsum: 35000000,
    districts: [
      { name: '红花岗区', code: '520302', coord: [106.89, 27.70], baseFlow: 22000 },
      { name: '汇川区', code: '520303', coord: [106.93, 27.70], baseFlow: 20000 },
      { name: '播州区', code: '520304', coord: [106.83, 27.54], baseFlow: 12000 },
      { name: '仁怀市', code: '520382', coord: [106.40, 27.79], baseFlow: 10000 },
      { name: '赤水市', code: '520381', coord: [105.70, 28.59], baseFlow: 11000 },
      { name: '习水县', code: '520330', coord: [106.20, 28.33], baseFlow: 6000 },
      { name: '桐梓县', code: '520322', coord: [106.83, 28.13], baseFlow: 5500 },
      { name: '绥阳县', code: '520323', coord: [107.18, 27.95], baseFlow: 4000 },
      { name: '湄潭县', code: '520328', coord: [107.47, 27.75], baseFlow: 3500 },
      { name: '凤冈县', code: '520327', coord: [107.72, 27.96], baseFlow: 2500 },
    ],
    scenic: [
      { name: '赤水丹霞', baseFlow: 15000 },
      { name: '遵义会议会址', baseFlow: 9500 },
      { name: '茅台古镇', baseFlow: 8000 },
      { name: '赤水大瀑布', baseFlow: 6500 },
      { name: '燕子岩国家森林公园', baseFlow: 4200 },
      { name: '四洞沟景区', baseFlow: 3800 },
      { name: '海龙屯', baseFlow: 3200 },
      { name: '丙安古镇', baseFlow: 2500 },
      { name: '娄山关', baseFlow: 2200 },
      { name: '双河洞', baseFlow: 2000 },
    ],
  },
  '520200': { // 六盘水市
    name: '六盘水市',
    baseFlow: 43000,
    baseConsum: 15000000,
    districts: [
      { name: '钟山区', code: '520201', coord: [104.83, 26.59], baseFlow: 14000 },
      { name: '六枝特区', code: '520203', coord: [105.48, 26.21], baseFlow: 8000 },
      { name: '水城区', code: '520204', coord: [104.96, 26.55], baseFlow: 9000 },
      { name: '盘州市', code: '520281', coord: [104.47, 25.71], baseFlow: 12000 },
    ],
    scenic: [
      { name: '乌蒙大草原', baseFlow: 6500 },
      { name: '妥乐古银杏', baseFlow: 4200 },
      { name: '玉舍国家森林公园', baseFlow: 3800 },
      { name: '梅花山', baseFlow: 3200 },
      { name: '野玉海', baseFlow: 2800 },
      { name: '哒啦仙谷', baseFlow: 2200 },
      { name: '韭菜坪', baseFlow: 2500 },
      { name: '牂牁江', baseFlow: 1800 },
      { name: '大洞竹海', baseFlow: 1500 },
      { name: '月照养生谷', baseFlow: 1200 },
    ],
  },
  '520400': { // 安顺市
    name: '安顺市',
    baseFlow: 68000,
    baseConsum: 24000000,
    districts: [
      { name: '西秀区', code: '520402', coord: [105.97, 26.25], baseFlow: 18000 },
      { name: '平坝区', code: '520403', coord: [106.26, 26.41], baseFlow: 8000 },
      { name: '普定县', code: '520422', coord: [105.74, 26.32], baseFlow: 6000 },
      { name: '镇宁县', code: '520423', coord: [105.77, 26.06], baseFlow: 12000 },
      { name: '关岭县', code: '520424', coord: [105.62, 25.94], baseFlow: 9000 },
      { name: '紫云县', code: '520425', coord: [106.08, 25.75], baseFlow: 5000 },
    ],
    scenic: [
      { name: '黄果树瀑布', baseFlow: 28000 },
      { name: '龙宫景区', baseFlow: 11000 },
      { name: '天龙屯堡', baseFlow: 4200 },
      { name: '格凸河', baseFlow: 3800 },
      { name: '旧州古镇', baseFlow: 2800 },
      { name: '云峰屯堡', baseFlow: 2500 },
      { name: '花江大峡谷', baseFlow: 2000 },
      { name: '夜郎洞', baseFlow: 1800 },
      { name: '红崖天书', baseFlow: 1200 },
      { name: '斯拉河', baseFlow: 1000 },
    ],
  },
  '520500': { // 毕节市
    name: '毕节市',
    baseFlow: 52000,
    baseConsum: 18000000,
    districts: [
      { name: '七星关区', code: '520502', coord: [105.29, 27.30], baseFlow: 14000 },
      { name: '大方县', code: '520521', coord: [105.61, 27.14], baseFlow: 7000 },
      { name: '织金县', code: '520524', coord: [105.77, 26.67], baseFlow: 9000 },
      { name: '黔西市', code: '520581', coord: [106.03, 27.01], baseFlow: 6000 },
      { name: '金沙县', code: '520523', coord: [106.22, 27.46], baseFlow: 4000 },
      { name: '纳雍县', code: '520525', coord: [105.38, 26.78], baseFlow: 3500 },
      { name: '威宁县', code: '520526', coord: [104.28, 26.86], baseFlow: 5000 },
      { name: '赫章县', code: '520527', coord: [104.73, 27.12], baseFlow: 2500 },
    ],
    scenic: [
      { name: '百里杜鹃', baseFlow: 10000 },
      { name: '织金洞', baseFlow: 9000 },
      { name: '草海', baseFlow: 4500 },
      { name: '九洞天', baseFlow: 3200 },
      { name: '慕俄格古城', baseFlow: 2800 },
      { name: '阿西里西', baseFlow: 2500 },
      { name: '支嘎阿鲁湖', baseFlow: 1800 },
      { name: '油杉河', baseFlow: 1500 },
      { name: '可乐遗址', baseFlow: 1000 },
      { name: '总溪河', baseFlow: 800 },
    ],
  },
  '520600': { // 铜仁市
    name: '铜仁市',
    baseFlow: 55000,
    baseConsum: 19000000,
    districts: [
      { name: '碧江区', code: '520602', coord: [109.19, 27.72], baseFlow: 15000 },
      { name: '万山区', code: '520603', coord: [109.21, 27.52], baseFlow: 6000 },
      { name: '江口县', code: '520621', coord: [108.84, 27.70], baseFlow: 12000 },
      { name: '石阡县', code: '520623', coord: [108.23, 27.52], baseFlow: 5000 },
      { name: '思南县', code: '520624', coord: [108.25, 27.94], baseFlow: 4500 },
      { name: '德江县', code: '520626', coord: [108.12, 28.26], baseFlow: 3500 },
      { name: '松桃县', code: '520628', coord: [109.20, 28.15], baseFlow: 5000 },
      { name: '玉屏县', code: '520622', coord: [108.92, 27.24], baseFlow: 3000 },
    ],
    scenic: [
      { name: '梵净山', baseFlow: 17000 },
      { name: '大明边城', baseFlow: 4500 },
      { name: '九龙洞', baseFlow: 3200 },
      { name: '石阡温泉', baseFlow: 2800 },
      { name: '亚木沟', baseFlow: 2500 },
      { name: '苗王城', baseFlow: 2200 },
      { name: '朱砂古镇', baseFlow: 1800 },
      { name: '佛顶山', baseFlow: 1500 },
      { name: '寨沙侗寨', baseFlow: 1200 },
      { name: '铜仁大峡谷', baseFlow: 1000 },
    ],
  },
  '522600': { // 黔东南州
    name: '黔东南州',
    baseFlow: 87000,
    baseConsum: 30000000,
    districts: [
      { name: '凯里市', code: '522601', coord: [107.98, 26.58], baseFlow: 20000 },
      { name: '镇远县', code: '522625', coord: [108.43, 27.05], baseFlow: 12000 },
      { name: '施秉县', code: '522623', coord: [108.12, 27.03], baseFlow: 6000 },
      { name: '从江县', code: '522633', coord: [108.91, 25.75], baseFlow: 8000 },
      { name: '黎平县', code: '522631', coord: [109.14, 26.23], baseFlow: 9000 },
      { name: '雷山县', code: '522634', coord: [108.08, 26.38], baseFlow: 10000 },
      { name: '榕江县', code: '522632', coord: [108.52, 25.93], baseFlow: 7000 },
      { name: '台江县', code: '522630', coord: [108.32, 26.67], baseFlow: 4500 },
      { name: '剑河县', code: '522629', coord: [108.44, 26.72], baseFlow: 4000 },
      { name: '丹寨县', code: '522636', coord: [107.79, 26.20], baseFlow: 3500 },
    ],
    scenic: [
      { name: '西江千户苗寨', baseFlow: 19000 },
      { name: '镇远古城', baseFlow: 13000 },
      { name: '肇兴侗寨', baseFlow: 7500 },
      { name: '杉木河', baseFlow: 5000 },
      { name: '云台山', baseFlow: 3800 },
      { name: '岜沙苗寨', baseFlow: 3200 },
      { name: '加榜梯田', baseFlow: 2800 },
      { name: '朗德苗寨', baseFlow: 2200 },
      { name: '隆里古城', baseFlow: 1800 },
      { name: '舞阳河', baseFlow: 1500 },
    ],
  },
  '522700': { // 黔南州
    name: '黔南州',
    baseFlow: 72000,
    baseConsum: 25000000,
    districts: [
      { name: '都匀市', code: '522701', coord: [107.52, 26.26], baseFlow: 16000 },
      { name: '福泉市', code: '522702', coord: [107.52, 26.69], baseFlow: 7000 },
      { name: '荔波县', code: '522722', coord: [107.88, 25.41], baseFlow: 18000 },
      { name: '独山县', code: '522726', coord: [107.54, 25.82], baseFlow: 5000 },
      { name: '平塘县', code: '522727', coord: [107.32, 25.83], baseFlow: 6000 },
      { name: '罗甸县', code: '522728', coord: [106.74, 25.43], baseFlow: 4000 },
      { name: '龙里县', code: '522730', coord: [106.98, 26.45], baseFlow: 5500 },
      { name: '惠水县', code: '522731', coord: [106.66, 26.13], baseFlow: 4500 },
      { name: '三都县', code: '522732', coord: [107.87, 25.99], baseFlow: 3500 },
      { name: '贵定县', code: '522723', coord: [107.23, 26.58], baseFlow: 3000 },
    ],
    scenic: [
      { name: '荔波小七孔', baseFlow: 22000 },
      { name: '荔波大七孔', baseFlow: 8000 },
      { name: '中国天眼', baseFlow: 6500 },
      { name: '茂兰喀斯特', baseFlow: 4200 },
      { name: '都匀斗篷山', baseFlow: 2800 },
      { name: '金海雪山', baseFlow: 2200 },
      { name: '掌布景区', baseFlow: 1800 },
      { name: '涟江樱花', baseFlow: 1500 },
      { name: '瑶山古寨', baseFlow: 1200 },
      { name: '水春河', baseFlow: 1000 },
    ],
  },
  '522300': { // 黔西南州
    name: '黔西南州',
    baseFlow: 38000,
    baseConsum: 13000000,
    districts: [
      { name: '兴义市', code: '522301', coord: [104.90, 25.08], baseFlow: 14000 },
      { name: '兴仁市', code: '522302', coord: [105.19, 25.43], baseFlow: 5000 },
      { name: '安龙县', code: '522323', coord: [105.44, 25.10], baseFlow: 4000 },
      { name: '贞丰县', code: '522325', coord: [105.65, 25.39], baseFlow: 5000 },
      { name: '普安县', code: '522323', coord: [104.95, 25.78], baseFlow: 2500 },
      { name: '晴隆县', code: '522324', coord: [105.22, 25.83], baseFlow: 2500 },
      { name: '册亨县', code: '522327', coord: [105.81, 24.98], baseFlow: 2000 },
      { name: '望谟县', code: '522326', coord: [106.10, 25.17], baseFlow: 2000 },
    ],
    scenic: [
      { name: '万峰林', baseFlow: 8500 },
      { name: '马岭河峡谷', baseFlow: 5500 },
      { name: '万峰湖', baseFlow: 3500 },
      { name: '双乳峰', baseFlow: 2800 },
      { name: '二十四道拐', baseFlow: 2200 },
      { name: '北盘江大峡谷', baseFlow: 1800 },
      { name: '贞丰三岔河', baseFlow: 1500 },
      { name: '安龙招堤', baseFlow: 1200 },
      { name: '晴隆阿妹戚托', baseFlow: 800 },
      { name: '放马坪', baseFlow: 600 },
    ],
  },
}

// ===== 省级数据生成函数 =====

/**
 * 生成各市州客流数据
 */
export function generateCityFlowData() {
  const baseFlows = {}
  cities.forEach(c => {
    const info = cityDistricts[c.code]
    if (info) baseFlows[c.name] = info.baseFlow
  })

  return cities.map(city => ({
    name: city.name,
    code: city.code,
    coord: city.coord,
    todayFlow: fluctuate(baseFlows[city.name] || 50000, 0.08),
    monthFlow: fluctuate((baseFlows[city.name] || 50000) * 28, 0.05),
    yearFlow: fluctuate((baseFlows[city.name] || 50000) * 300, 0.03),
    yoy: (Math.random() * 0.3 + 0.02).toFixed(4),
  })).sort((a, b) => b.todayFlow - a.todayFlow)
}

/**
 * 生成热门景区排行数据
 */
export function generateScenicRankData() {
  return scenicSpots.map(spot => ({
    name: spot.name,
    city: spot.city,
    todayFlow: fluctuate(spot.baseFlow, 0.1),
    yoy: (Math.random() * 0.4 - 0.05).toFixed(4),
    capacity: fluctuate(spot.baseFlow * 1.5, 0.05),
  })).sort((a, b) => b.todayFlow - a.todayFlow)
}

/**
 * 生成24小时客流趋势数据
 */
export function generateFlowTrendData(baseToday = 640000, baseYesterday = 590000) {
  const hourPattern = [
    0.05, 0.03, 0.02, 0.02, 0.03, 0.05,
    0.10, 0.20, 0.40, 0.65, 0.80, 0.90,
    0.85, 0.75, 0.80, 0.88, 0.95, 1.00,
    0.92, 0.70, 0.50, 0.35, 0.20, 0.10,
  ]

  const todayData = hourPattern.map((ratio, i) => {
    const currentHour = new Date().getHours()
    if (i > currentHour) return null
    return Math.round(baseToday * ratio * (0.9 + Math.random() * 0.2))
  })

  const yesterdayData = hourPattern.map(ratio =>
    Math.round(baseYesterday * ratio * (0.9 + Math.random() * 0.2))
  )

  const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)

  return { hours, todayData, yesterdayData }
}

/**
 * 生成消费统计数据
 */
export function generateConsumData(baseConsum = 280000000) {
  const totalConsum = fluctuate(baseConsum, 0.08)
  const perCapita = fluctuate(420, 0.05)
  const yoy = (Math.random() * 0.15 + 0.03).toFixed(4)
  const mom = (Math.random() * 0.1 - 0.02).toFixed(4)

  const typeData = consumTypes.map(t => ({
    name: t.name,
    value: Math.round(totalConsum * t.ratio * (0.9 + Math.random() * 0.2)),
    color: t.color,
  }))

  return {
    totalConsum,
    perCapita,
    yoy,
    mom,
    typeData,
  }
}

/**
 * 生成汇总数据
 */
export function generateSummaryData(baseFlow = 640000, baseConsum = 280000000) {
  return {
    yearFlow: fluctuate(baseFlow * 900, 0.02),
    monthFlow: fluctuate(baseFlow * 28, 0.03),
    todayFlow: fluctuate(baseFlow, 0.05),
    scenicCount: randomInt(380, 420),
    totalConsum: fluctuate(baseConsum, 0.08),
    perCapita: fluctuate(420, 0.05),
  }
}

/**
 * 生成完整的省级仪表盘数据
 */
export function generateDashboardData() {
  return {
    cityFlow: generateCityFlowData(),
    scenicRank: generateScenicRankData(),
    flowTrend: generateFlowTrendData(),
    consum: generateConsumData(),
    summary: generateSummaryData(),
  }
}

// ===== 市级数据生成函数 =====

/**
 * 生成市级区县客流数据
 */
export function generateDistrictFlowData(cityCode) {
  const cityInfo = cityDistricts[cityCode]
  if (!cityInfo) return []

  return cityInfo.districts.map(d => ({
    name: d.name,
    code: d.code,
    coord: d.coord,
    todayFlow: fluctuate(d.baseFlow, 0.1),
    monthFlow: fluctuate(d.baseFlow * 28, 0.06),
    yearFlow: fluctuate(d.baseFlow * 300, 0.04),
    yoy: (Math.random() * 0.3 + 0.02).toFixed(4),
  })).sort((a, b) => b.todayFlow - a.todayFlow)
}

/**
 * 生成市级景区排行数据
 */
export function generateCityScenicRankData(cityCode) {
  const cityInfo = cityDistricts[cityCode]
  if (!cityInfo) return []

  return cityInfo.scenic.map(spot => ({
    name: spot.name,
    city: cityInfo.name,
    todayFlow: fluctuate(spot.baseFlow, 0.1),
    yoy: (Math.random() * 0.4 - 0.05).toFixed(4),
    capacity: fluctuate(spot.baseFlow * 1.5, 0.05),
  })).sort((a, b) => b.todayFlow - a.todayFlow)
}

/**
 * 生成完整的市级仪表盘数据
 */
export function generateCityDashboardData(cityCode) {
  const cityInfo = cityDistricts[cityCode]
  if (!cityInfo) return null

  const baseFlow = cityInfo.baseFlow
  const baseConsum = cityInfo.baseConsum

  return {
    cityName: cityInfo.name,
    cityCode,
    districtFlow: generateDistrictFlowData(cityCode),
    scenicRank: generateCityScenicRankData(cityCode),
    flowTrend: generateFlowTrendData(baseFlow, Math.round(baseFlow * 0.92)),
    consum: generateConsumData(baseConsum),
    summary: generateSummaryData(baseFlow, baseConsum),
  }
}

/**
 * 根据城市代码获取城市信息
 */
export function getCityInfo(cityCode) {
  return cityDistricts[cityCode] || null
}
