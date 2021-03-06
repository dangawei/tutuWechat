const util = require("../../utils/config.js");

const app = getApp();
const http_host = util.http_host;
const img_url = util.img_url;
const urlimg = util.urlimg;
const regPhone = /^[1][3,4,5,6,7,8][0-9]{9}$/;
Page({
  data: {
    disabled: false,
    phoneValue: '',//手机号
    phoneError: false,
    passwordValue:'',
    errorInfo:'手机号错误',//错误信息
    errorShow:true,
  },
  cancelPhone: function () {
    this.setData({
      phoneValue: ''
    })
  },
  cancelPassword: function () {
    this.setData({
      passwordValue: ''
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      phoneValue: e.detail.value
    })
    if (regPhone.test(this.data.phoneValue)) {
      this.setData({
        phoneError: false
      })
    }
  },
  bindKeyPassword: function (e) {
    this.setData({
      passwordValue: e.detail.value
    })
    if (regPhone.test(this.data.phoneValue)) {
      this.setData({
        phoneError: false
      })
    }
  },
  // 点击下一步
  nextBtn() {
    if (regPhone.test(this.data.phoneValue)) {
      let _this=this
      wx.request({
        url: http_host + "user/login/password",
        method:"POST",
        data: {
          username: this.data.phoneValue,
          password: this.data.passwordValue
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          // 判断是否正确传回数据
          if (res.data.code == 0) {
            app.globalData.userInfo = res.data.data
            wx.setStorage(
              {
                key: 'userInfo',
                data: res.data.data
              }
            )
            wx.setStorageSync('bookId',res.data.data.textbookIdPractice)
            app.book.id = res.data.data.textbookIdPractice
            app.book.bookId = res.data.data.textbookIdPractice
            _this.setData({
              phoneError: false
            })
            if (res.data.data.textbookIdPractice && res.data.data.textbookIdPractice != 0) {
              wx.reLaunch({
                url: '/pages/afterindex/afterindex'
              })
            } else {
              // beforeindex
              wx.reLaunch({
                url: "/pages/beforeindex/beforeindex"
              })
            }
          } else {
            //返回数据失败
              app.tanchuang(res.data.message)
          }
        }
      })
    } else {
      this.setData({
        phoneError: true
      })

    }
  },
  quickLogin(){
    wx.navigateTo({
      url: '/pages/quicklogin/login?type=1',
    })
  },
  resetPassword: function () {
    wx.navigateTo({
      url: '/pages/resetpassword/resetpassword?type=2',
    })
  },
  /** 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    if (wx.getStorageSync("isLogin") || wx.getStorageSync("isLogin")==0){
      if (wx.getStorageSync("isLogin")==1){
        this.getUserInfo()
      }
    }else{
      this.getUserInfo()
    }
  },
  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function () {

  },
  /**
  * 生命周期函数--监听页面隐藏
  */
  onHide: function () {

  },
  getUserInfo: function (res) {
    let _this = this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']){
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
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
          })
        }else {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: reset => {
              // 可以将 res 发送给后台解码出 unionId
              // setTimeout(function () {
                // _this.login(reset.userInfo)
              // }, 100)
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
  },
  login(option) {
    var _this=this
    wx.showLoading({
      title: '加载中',
    })
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: http_host +'user/login/mini',
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
              wx.hideLoading()
              if(reset.data.code==0){
                app.globalData.userInfo = reset.data.data
                wx.setStorage(
                  {
                    key: 'userInfo',
                    data: reset.data.data
                  }
                )
                wx.setStorageSync('bookId', reset.data.data.textbookIdPractice)
                wx.setStorageSync("isLogin", 1)
                app.book.id = reset.data.data.textbookIdPractice
                app.book.bookId = reset.data.data.textbookIdPractice
                _this.setData({
                  phoneError: false
                })
                if (reset.data.data.textbookIdPractice && reset.data.data.textbookIdPractice != 0) {
                  wx.redirectTo({
                    url: '/pages/afterindex/afterindex'
                  })
                } else {
                  // beforeindex
                  wx.redirectTo({
                    url: "/pages/beforeindex/beforeindex"
                  })
                }
              } else {
                //返回数据失败
                app.tanchuang(reset.data.message)
              }
              
            }
          })
        } else {
          app.tanchuang('登陆授权错误！')
        }
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this
    return {
      title: wx.getStorageSync("userInfo").realName + '  邀请你来闯关啦~图图小学英语课后趣味练习！',
      desc: '转发描述',
      path: '/pages/login/login',
      imageUrl: urlimg,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})