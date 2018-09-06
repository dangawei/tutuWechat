const util = require("../../utils/config.js");

const app = getApp();
const http_host = util.http_host;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    
  },
  nextBtn:function(){

    let _this = this
    wx.showModal({
      title: '退出登录',
      content: '确定要退出吗',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: http_host + "user/logout",
            method: "POST",
            header: {
              'token': wx.getStorageSync("userInfo").token,
              'Content-Type': 'application/json'
            },
            success: function (res) {
              // 判断是否正确传回数据
              if (res.data.code == 0) {
                wx.reLaunch({
                  url: '/pages/login/login'
                })
              } else {
                //返回数据失败
                app.tanchuang(res.data.message)
              }
            }
          })
        } 
      }
    });
    
  }
})