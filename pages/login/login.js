const util = require("../../utils/config.js");

const app = getApp();
const http_host = util.http_host;
Page({
  data:{
    time: '获取验证码',
    currentTime: 60,
    disabled: false
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
})

// let count =60
// //倒计时60秒
// function countDown() {
//   console.log(1);
//   let that=this;
//   if (count == 0) {
//     that.setData({
//       counttime: count,
//       disabled: false
//     })
//     return;
//   }
//   that.setData({
//     counttime: count
//   })
//   setTimeout(function () {
//     count--;
//     countDown(that, count);
//   }, 1000);
// }