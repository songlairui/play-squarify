const wait = [
    'a932aac82ac84fc9c6c92194bd88204e', // 1. run b.func to upload
    'f0466135fc8b3a662084784e5f4ac792', // 2. 编译文件【】
    '911222a6723da8db7ca8a8e3689591e1', // 3. 检查文件 -> 编译
    '3d1dfba33285839f5aa317a53698f4c5', // 4. 编译文件
    '41168dca39589e852da6631126d0f94d', // 5. backup method?

    'ad554134baaa7dc37c79f2d0af026415', // 1. local server

    'bd975ba7c5cc0dc70c1404f310e1632b', // generate generateFile
    '3a9c9c49e5ac7329d924774b97ec3e8a', // generate JS File？
    '7a983d175ae5bf313342dd02835b3807', // remoteDebug

    '8267de7f4ec7b70a147f3fa5ef2bdea4', // 检查文件
    'cc2c2970ff81ae4a83123e81ee123da2', // 上传代码，插件代码
]

const ignore = [
    '48679210e49dc5028a8b6642263eba75', // 编辑game
    '25d0beb4120ce2acafb4e03b95444fda', // 新建项目，文件，打开项目等--树干
    'efaddce19b790978e16990920754b000', // 新建项目，文件，打开项目等--树干
    '6ff091369f442a4678a2ed4a1f758495', // 申请测试


    '233d77ecf0781f44985f684f70e316d0', // 应用代理
    '437e6043fc662374e4f1c2330516ac40', // proxyConfig
    '69d7142a54ea62832f5ad2d8fb08d0ae', // 本地代理？
    'eb1fe4da47d7ed10884f8b039b058c5b', // 打开小程序，打开代码片段
    '5bdce4f0657e887a1fda83e134c0b823', // cli-server? extractLoginInfo
    '2dfc6a3df6d6fc51266b293c8420e88b', // 初始化webview，开发小游戏？
    '3bfffbe88b3d923921f851c0697974fe', // 检查系统配置，代理，腾讯云等
    '56a764ae9cb4336bf6babe1c1da0275b', // 封装logger？
    '51a8f674caffc4c2fa2358314af90837', // DEVTOOLS_STORAGE
    '46d7303eb986fa402d60bf5e929aa077', // debug console?
]

const entry = [
    '071409e377770b723074b0f04fd4a50c', // 小游戏，所有方法
    '8e433dffaa20c3a7331f9aeecb1221b0', // nw 主进程
    'c347d628ff50158115a95a6e980c1738', // 界面渲染
    '0db350fb89acd99bf2de39677770889c', // 全部方法
    '60fdb5a14c198acde3823b610d29f71f', // 解析 project.config.json
    '2c0e34a9e23574aea227f3448a526c52', // 查找 project.json
    '8fbd6def1ab387883f5913820f0bb2bf' // 开始渲染小程序
].concat(ignore)

const bits = [
    'b627c3d043d88f996c8bbc3f8ee8238f', // 界面按钮
    '3c55dff3626a3ee184d599f076158345', // 界面UI action？
    '37d8b9297fb1bd87f9a3ac407b8006a0', // dispatch Action
    'fc137838572a83604db39acff8e909e0', // 菜单按钮action
    'd559680a1a0c2551cbce1a9fb152cb99', // 渲染模拟器界面？
    '1c8a8c710417d102ab574145dc51b4b0', // isFileIgnore
    '948f9199c1cd0ba6cb9d19ad84972410', // getCurrentPage方法实现
    '63f52c9055d92f52ca0510da7d3dcadb', // 界面-远程调试
    '0f320ead31c0cc78b70041f44d626bb6', // 取全局配置
    '74af8a23ddee45c6c1265c88746b66bc', // http 请求队列？

    '1d93826913e7d586487fc11ac06648f5', // 右键菜单等

    '1bd2563d13db26950ae47494b2c34454', // entry, 小程序/小游戏

    '205e69607c4b60711b15f5ac95b40ce4', // window main server
    '5451dfc4d939398d913dc724d952b02b', // init Something

    'bc04f89cf8edab62335086e0a2a5a103', // react dropDown component
    '36e525c1a6e2426c7d997e7f9a8c6422', // 打开项目
    'efc820e1b92d6e4063535296d4a24213', // 计算文件大小
    '6d8ca1450488a9f8eb33c4b19e3c49ed', // writeFile， 生成Page？
    'ebfcad0a5e72b6e693634486564b1394', // html 入口
    'b543ae2da406cea63b3ad8951f17b6c0', // 开发调试窗口关闭
    '1f98c7ca32b0549d99bce70cd41a3fcd', // 切换设备
    'a1dd553cc059d528bb0ef56afed53968', // 模拟 webview onPostMessage?
    'b6d8659542036f6a35f417e0693e56db', // getFile?
    'd260ebf687a29f24aed49f66b233ab7d', // 检测 enablePullScroll
    '0794878a22a26634e42df858bbaca543', // tos 开发模式，上传文件
    '881e653f19d837f2408386047cb8c38c', // 全局 channel boardcast
    'a63026ab5a5a3c59a61a9749a18aa2ca', // 加载 pluginRoot
    'c4190a2430506f3602ca550e1e75d620', // getA8Key, showDevTools
    'e5fa35c3c8e81bc6466b4b8eb436113b', // createPackage
    'a78e6d6a87de1708226375ca4c320d76', // attach ?
    '3b66d845db4d098b7a16cb0357f5c072', // update Config
    '42191d95974f14b18961c9f2c730464e', // 读写项目配置文件
    'd62fc37d7aa6416d5dcc240ba94175cd', // read from cache
    'be8599cf60139a20dca47b3e43647454', // 获取配置
    '6b5520e429c60abf5d2f924c0fa05fd0', // 编译前，获取文件列表？
    'dc59f57d54946e61d27c95ab24d8cb4f', // loadConfig
    '1dea83a77e99a7c94f6b6f01f5c175b0', // 解析 app-config.json
    '3e4c71c2a2cc438e1b3afc3fb10bd4b6', // 编译 .wxml 文件
    '84858de8a097c9cf84ff2c2e3d86e2a9', // 本地数据读写？
    '214c25062f31e2cad941b3ec069db1fe', // 全局 boardCast ?
    'db2217eb4cff896bdcbc50abe005058f', // 全局 register 方法？
    'd3ce001ab1e75959382f6a7e0156dd17', // chrome.onclose , 弹出IDE开始窗口
    'bc78839ccca8df9e5ceeb7fae11b7be2', // 不知道， 区分isDev， return createStore()
    'a8c87029da0fa06e986298d447ab0fe2', // setMainWindow
    '4389a88e405d1d37f36c16fc0ec96540', // renderIphoneXStatusBar?
    '92320c1386e6db6a6f2556736a9bc280', // 遍历文件目录，同步文件，设置变量？
    '6238a86bb7a55c11aa0f9eb335d0f34c', // 查找 app.json 开始渲染
    '89ba85d67a88f7636d657c22b5d3e038', // getUserInfo
    'e98c60a262d8d98e69e574a9d12a21df', // 更改IDE设置，代理，位置信息等
    'da7c31daaf542cf1796023d8e344b98a', // clientreport
    'f6cbcecf6ed9f533f6a506310d8f07b6', // 文件系统操作，模拟 http://tmp ?
    'cdbf7243dc99f8461acbb1d57af1d8ae', // getSourceMap？
    '6620a0cf7dad1b400d60f0fdae40f524', // 初始化一个chrome.window?
    'ba23d8b47b1f4ea08b9fd49939b9443f', // 显示Picker，Model，ActionSheet 等
    'ff946754202ecf377034d29daac7c8d9', // 远程调试？
    '9c906d27ca74e18d0deaaa231e71fdfa', // 登录、更新状态
    'd28a711224425b00101635efe1034c99', // 下载VENDOR？
    '1fcc6bd55b687d154a4247e57fe3011d', // react setData -
    '875171e7b864aa58d026d4fa0999fbd1', // react 通用组件？
    'd3976cc01aeebc5b09e11c4135b6bd8d', // 检查版本库？
    '162bf2ee28b76d3b3d95b685cede4146', // 打包，查找根路径
    '84b183688a46c9e2626d3e6f83365e13', // 检查更新，检查令牌
    '72653d4b93cdd7443296229431a7aa9a', // preventCache
    '15ba1827c7f6564a45df6bd44da3a977', // 登录

    '41f4eba9fb17703b7d61eca8b05aa076', // 标识变量， [isMode]
    'df6d0ff021a69fb541c733de4dbba0fe', // 配置文件， 数值变量
    '37be435102276ea9cf47609ff6535cd4', // 配置文件， http://tmp
    '76d9df7b0b3e47fbe17881420a4bef86', // 配置文件， error code
    '09060286633d09fb81fefc8ff1294dd7', // 配置文件， cli,event
    '5719b6ded53098ffd9e848abcac30153', // 配置文件，错误码
    'bcb48ae14d243711d3b31cb0f602d209', // type 配置
    '822bc5aa1823c9aa222d9ffad72e7f17', // ACTION 变量
    '72410b6d4968336cd8b2fc1d41f52cdf', // 配置文件，QCLOUD配置
    '5498e660c05c574f739a28bd5d202cfa', // 配置文件 菜单按钮
    'eadce02c750c875a10680bcfedadec88', // 配置文件，菜单名
    '949d8235c744ced2a80121e4dba34c28', // 配置文件，状态码
    '9fdd4ac31a05c27355910f0d74accd4c', // 配置文件，标识
    'f171257bbcaef547a3cf27266ccb0db2', // 配置文件
    '6242f55dbdfe53c2f07b7a51568311f2', // 配置文件
    '3b5f8e2469c474c8d433c1c6926d8999', // 配置文件
    '56c390e04c10e91a4aa2a2c19d9a885d', // 配置文件
    '0634ee2ebd3e560d9d4804ecc960160f' // 静态变量
].concat(ignore)

module.exports = { entry: [], bits: [] }
