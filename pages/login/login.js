const util = require("../../utils/config.js");

const app = getApp();
const http_host = util.http_host;
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