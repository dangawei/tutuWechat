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

  globalData: {
    // 用户基本信息
    userInfo: null
    
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
    arr:[],
    xia:-1,
    lishi_xia:'',
  },

  book:{
    name:''
  },
})