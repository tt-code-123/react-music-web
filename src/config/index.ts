// 项目配置文件，保存通用性配置
// 基本网络请求路径
export const BASE_URL = 'http://localhost:8082'

// 头部数据
export const headerData = [
  {
    label: '首页',
    path: '/t/home',
  },
  {
    label: '歌单',
    path: '/t/playlist',
  },
  {
    label: '专辑',
    path: '/t/album',
  },
  {
    label: '歌手',
    path: '/t/singer',
  },
  {
    label: '音乐吧',
    path: '/t/dynamic',
  },
]

// 底部数据
export const footerData = [
  {
    title: '音乐文化',
    data: ['文化官网', '音乐简介', '服务协议'],
  },
  {
    title: '音乐家族',
    data: ['圈子彩铃', '耀眼舞台', '来电铃声'],
  },
  {
    title: '联系我们',
    data: ['商务合作', '常见问题', '意见反馈'],
  },
]
export const footerText = [
  '关于TT',
  'About TT',
  '服务条款',
  '用户服务协议',
  '隐私政策',
  '权利声明',
  '广告服务',
  'TT招聘',
  '客服中心',
  '网站导航',
]
export const footerTxt = ['TT公司 版权所有', '营业执照', '网络文化经营许可证：粤网文[2020]3396-195号']

// 热门搜索
export const hotSearch = ['周杰伦', '邓紫棋', 'Justin Bieber', '薛之谦', '林俊杰']

export const playlistBox = [
  {
    title: '关于蓝调音乐入门，你不得不知的几位大神！',
    img: require('@/assets/img/a.jpg'),
    playCount: 327000,
  },
  {
    title: 'HipHop Battle ：热血骚年街舞专用',
    img: require('@/assets/img/b.jpg'),
    playCount: 375000,
  },
  {
    title: '怼！| 抨击是种技术，讽刺是门艺术',
    img: require('@/assets/img/c.jpg'),
    playCount: 867000,
  },
  {
    title: '匀速慢跑，高速起飞',
    img: require('@/assets/img/d.jpg'),
    playCount: 420000,
  },
  {
    title: '华语经典|那些时常萦绕耳边的旋律		',
    img: require('@/assets/img/e.jpg'),
    playCount: 814500,
  },
  {
    title: '那些浪漫到极致的西语歌',
    img: require('@/assets/img/f.jpg'),
    playCount: 164800,
  },
  {
    title: '摇滚音乐中的“诗”',
    img: require('@/assets/img/g.jpg'),
    playCount: 121900,
  },
  {
    title: '回忆杀 | 那些属于8090的共同回忆',
    img: require('@/assets/img/h.jpg'),
    playCount: 322000,
  },
]
