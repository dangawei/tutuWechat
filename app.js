//app.js
App({

  tanchuang: function (content)
  { 
    wx.showModal({
      title: '提示',
      content: content,
      success: function (res) {
       
      }
    })
    return;
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    
  },
  //随机打乱数组的顺序
  randomsort:function(a, b) {
    return Math.random() > .5 ? -1 : 1;
    //用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
  },
  globalData: {
    // 用户基本信息
    userInfo: null,
    // 手机号
    phone:''
  },
  // 用户信息  token 及 用户UID
  user:{
    token:'',
    uid:''
  },
  //part信息
  part:{
    id:'',
    name:'',
    cart_number:'',
    lishi_id:'',
  },

  next_pass:{
    url:''
  }, 
  again: {
    url: '',
    name:''
  }, 

  //unit信息
  unit:{
    id:'',
    name:''
  },
  //card信息
  card:{
    name:'',
    id:''
  },

  partList:{
    // 所有关卡
    all:[],
    arr:[],
    xia:-1,
    lishi_xia:'',
  },
  //教材信息
  book:{
    id:'',
    name:''
  },
})