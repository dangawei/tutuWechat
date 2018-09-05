// pages/login/login.js
const util = require("../../utils/config.js");

const app = getApp()
const http_host = util.http_host;
const appid = util.appId;
const secret = util.secret;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xianshi:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({

      frontColor: '#000000',

      backgroundColor: '#fff'

    })
    var that = this
    // wx.getSetting({
    //   success(res) {
    //     console.log(res);
    //     if (!res.authSetting['scope.userInfo']) {
    //       that.setData({
    //         xianshi: true
    //       })
    //       //未授权
    //       that.setData({
    //         showDialogshare: !that.data.showDialogshare,
    //       })
    //     } else {
    //       console.log('已授权')
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           app.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           // if (this.userInfoReadyCallback) {
    //           // this.userInfoReadyCallback(res)
    //           // }
    //           var detail = []
    //           detail['rawData'] = res.rawData
    //           detail['signature'] = res.signature
    //           //已授权
    //           that.login(res, detail)
    //         }
    //       })


    //     }
    //   }
    // })
  },
  //首页授权弹框
  getUserInfo: function (res) {
    let _this=this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: reset => {
              // 可以将 res 发送给后台解码出 unionId
              _this.login(reset.userInfo)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(reset)
              }
            }
          })
        }
      }
    })
    // var that = this;
    // const encryptedData = res.detail.encryptedData;
    // const iv = res.detail.iv;

    // if (encryptedData && iv) {
    //   console.log("允许")
    //   //存储全局变量

    //   app.globalData.userInfo = res.detail.userInfo

    //   that.login(res.detail.userInfo, res.detail)

    // } else {

    //   console.log("请授权公开信息,登录小程序")
    // }
    
  },
  //登录
  // oldLogin: function (userInfo, detail) {
  //   var that = this
  //   wx.login({
  //     success: function (res) {
  //       if (res.code) {
  //         //获取openid
  //         wx.request({
  //           url: http_host + 'login',
  //           data: {
  //             //  用户登录凭证
  //             js_code: res.code,
  //             // 客户端类型
  //             cliet_type: 'wx',
  //             // 原始字符串
  //             rawdata: detail.rawData,
  //             //校验字符串
  //             signature: detail.signature,
  //             //用户头像
  //             user_avatar_url: userInfo.avatarUrl,
  //             //昵称
  //             nick_name: userInfo.nickName,
  //             //性别
  //             gender: userInfo.gender,
  //             //城市
  //             city: userInfo.city,
  //             //省份
  //             province: userInfo.province,
  //             //国家
  //             country: userInfo.country,

  //           },
  //           header: {
  //             'Content-Type': 'application/json'
  //           },
  //           success: function (res) {


  //             //存入常量  方便调用
  //             app.user.token = res.data.data.token
  //             app.user.uid = res.data.data.uid

  //             //判断返回数据  uid 是否为空  （是否返回成功！）
  //             if (res.data.uid !== '' || res.data.uid !== null) {
  //               that.setData({
  //                 showDialogshare: !that.data.showDialogshare,
  //               })

  //               //判断用户当前是否存在教材	
  //               wx.request({
  //                 url: http_host + 'getcurrentbookdetail',
  //                 data: {
  //                   //从app中取出用户数据
  //                   token: app.user.token,
  //                   uid: app.user.uid
  //                 },
  //                 header: {
  //                   'Content-Type': 'application/json'
  //                 },
  //                 success: function (res) {
  //                   //判断是否存在教程
  //                   if (res.data.data == null || res.data.data == '') {

  //                     wx.reLaunch({

  //                       url: '/pages/beforeindex/beforeindex'

  //                     })
  //                   } else {
  //                     // 存在教程
  //                     wx.reLaunch({

  //                       url: '/pages/afterindex/afterindex?id=' + res.data.data.curren_card_id

  //                     })

  //                   }
  //                 }
  //               })



  //             } else {
  //               //返回数据失败
  //               app.tanchuang('登陆授权错误！')
  //             }
  //           }
  //         })
  //       }
  //     },

  //   })
  // },
  login(option){
    wx.login({
      success: res => {
        console.log(res);
        if (res.code) {
          wx.request({
            url: http_host +'user/login/mini',
            // url: "https://api.weixin.qq.com/sns/jscode2session?appid=" + appid + "&secret=" + secret + "&js_code=" + res.code + "&grant_type=authorization_code",
            method: "POST",
            data: {
              avatar: option.avatarUrl,
              code: res.code,
              gender: option.gender,
              nickName: option.nickName
            },
            header: {
              'Content-Type': 'application/json'
            },
            success: function (reset) {
              console.log(reset)
              // app.globalData.userInfo = res.data.data
              // wx.setStorage({
              //   key: 'userInfo',
              //   data: res.data.data
              // })
              // if (res.data.data.textbookIdPractice) {
              //   app.book.id = res.data.data.textbookIdPractice
              //   wx.redirectTo({
              //     url: '/pages/afterindex/afterindex?bookId=' + res.data.data.textbookIdPractice
              //   })
              // } else {
              //   // beforeindex
              //   wx.redirectTo({
              //     url: "/pages/beforeindex/beforeindex"
              //   })
              // }
            }
          })
        } else {
          app.tanchuang('登陆授权错误！')
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})