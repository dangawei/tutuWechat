const util = require("../../utils/config.js");

const app = getApp()
const http_host = util.http_host;
const img_url = util.img_url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exercise: 1,
    mind: 0,

  },
  // exercise: function () {
  //   var that = this;
  //   // if (wx.getStorageSync("userInfo").textbookIdPractice && wx.getStorageSync("userInfo").textbookIdPractice != 0) {
  //   //   wx.redirectTo({
  //   //     url: '/pages/afterindex/afterindex'
  //   //   })
  //   // } else {
  //   //   // beforeindex
  //   //   wx.redirectTo({
  //   //     url: "/pages/beforeindex/beforeindex"
  //   //   })
  //   // }
  //   wx.navigateBack();
  // },
  exercise: function () {
    var that = this;
    that.setData({
      exercise: 0,
      mind: 1,
    })
  },
  mind: function () {
    var that = this;
    that.setData({
      exercise: 1,
      mind: 0,
    })
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      // name: app.globalData.userInfo.realName,
      // img: app.globalData.userInfo.icon || 'http://img.tutukids.com/group1/M00/00/0A/spellcheck.png'
      name: wx.getStorageSync('userInfo').realName,
      img: wx.getStorageSync('userInfo').icon || 'http://img.tutukids.com/group1/M00/00/0A/spellcheck.png'
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f7f7f7'

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
  }
})