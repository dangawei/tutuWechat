const util = require("../../utils/config.js");

const app = getApp();
const http_host = util.http_host;
var pages = getCurrentPages(); // 当前页面
var beforePage = pages[pages.length - 2]; // 前一个页面

Page({
  data:{
    passwordValue:'',//密码

  },
  cancelPhone: function () {
    this.setData({
      passwordValue: ''
    })
  },
  bindKeyInput:function(e){
    this.setData({
      passwordValue: e.detail.value
    })
  },
  nextBtn:function(){
    wx.request({
      url: http_host + 'user/password/set',
      method: "POST",
      data: {
        password: this.data.passwordValue
      },
      header: {
        'token':wx.getStorageSync("userInfo").token,
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // 判断是否正确传回数据
        if (res.data.code == 0) {
          wx.showToast({
            title: '修改成功!',
            icon: 'success',
            duration: 1500,
            success:function(){
              // 返回上级页面
              // wx.navigateBack({
              //   success: function () {
              //     beforePage.onLoad(); // 执行前一个页面的onLoad方法
              //   }
              // })
              wx.redirectTo({
                url: '/pages/login/login'
              })
            }
          });
        } else {
          //返回数据失败
          app.tanchuang(res.data.message)
        }
      }
    })
  },
  //修改成功之后推出登录,跳转到登录页面
  // outLogin(){
    
  // },
  /** 生命周期函数--监听页面加载 */
  onLoad: function (options) {

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

  }
})