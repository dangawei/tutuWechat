const util = require("../../utils/config.js");

const app = getApp();
const http_host = util.http_host;
const regPhone = /^[1][3,4,5,6,7,8][0-9]{9}$/;
Page({
  data:{
    time: '获取验证码',
    currentTime: 10,
    disabled: false,
    phoneValue:'',
    phoneError:false
  },
  cancelPhone: function () {
    this.setData({
      phoneValue:''
    })
  },
  bindKeyInput: function (e){
    this.setData({
      phoneValue: e.detail.value
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
      this.setData({
        phoneError: false
      })
      app.globalData.phone = this.data.phoneValue
      // 进入verification页面
      wx.navigateTo({
        url: "/pages/verification/verification?type=1"
      })
    } else {
      this.setData({
        phoneError: true
      })

    }
  },
  /** 生命周期函数--监听页面加载 */
  onLoad: function (options) {
  },
  countDown: function (options) {
    var that = this;
    var currentTime = that.data.currentTime;
    that.setData({
      time: currentTime + '秒'
    })
    that.data.disabled=true
    var interval = setInterval(function () {
      that.setData({
        time: (currentTime - 1) + '秒'
      })
      currentTime--;
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新获取',
          currentTime: 60,
          disabled: false
        })
      }
    }, 1000)
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
  onShareAppMessage: function () {
    var that = this
    return {
      title: wx.getStorageSync("userInfo").realName + '  邀请你来闯关啦~图图小学英语课后趣味练习！',
      desc: '转发描述',
      path: '/pages/login/login',
      imageUrl: 'http://img.tutukids.com/group1/M00/00/0A/转发海报.png',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }, 
})