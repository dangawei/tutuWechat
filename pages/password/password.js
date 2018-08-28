const util = require("../../utils/config.js");

const app = getApp();
const http_host = util.http_host;

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
    console.log(this.data.passwordValue)
  },
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