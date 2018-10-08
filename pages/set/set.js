const util = require("../../utils/config.js");

const app = getApp();
const http_host = util.http_host;
const urlimg = util.urlimg;
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
                wx.setStorageSync("isLogin",0)
              } else if (res.data.code == 46){
                app.tanchuang('登录账号有误,点击确定重新登录！')
              } else{
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