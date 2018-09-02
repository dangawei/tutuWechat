const util = require("../../utils/config.js");

const app = getApp();
const http_host = util.http_host;
var pages = getCurrentPages();
var currPage = pages[pages.length - 1];   //当前页面
var prevPage = pages[pages.length - 2];  //上一个页面

Page({
  //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
  data: {
    time: '获取验证码',
    currentTime: 60,
    Length: 6,    //输入框个数 
    isFocus: false,  //聚焦 
    Value: "",    //输入的内容 
    titleText: "验证码已发送至+86 ",
    ttShow:true,
    valueLength:0,//输入验证码 的位数
    isDisabled:false,//获取验证码是否禁用
    isError:false,//验证码检验
    getData:{},//得到的数据
    errorInfo:'验证码错误'
  },
  Focus(e) {
    var that = this;
    var inputValue = e.detail.value;
    that.setData({
      valueLength: e.detail.value.length
    })
    that.setData({
      Value: inputValue,
    })
  },
  Tap() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },
  formSubmit(e) {
    console.log(e.detail.value.password);
  },
  countDown: function (options) {
    var that = this;
    var currentTime = that.data.currentTime;
    that.setData({
      time: currentTime + '秒',
      isDisabled:true
    })
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
          isDisabled:false
        })
      }
    }, 1000)
    console.log(app.globalData.phone)
    wx.request({
      url: http_host + 'sms/send',
      method: "POST",
      data: {
        mobile: app.globalData.phone,
        type:1
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // 判断是否正确传回数据
        if (res.data.code == 0) {
          wx.showToast({
            title: '已发送',
            icon: 'success',
            duration: 3000
          });
        } else {
          //返回数据失败
          app.tanchuang(res.message)
        }
      }
    })
  },
  nextBtn(){
      let _this=this
      wx.request({
        url: http_host + 'sms/check',
        method:"POST",
        data: {
          code:parseInt(this.data.Value),
          mobile: app.globalData.phone,
          type: 1
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          // 判断是否正确传回数据
          if (res.data.code == 0) {
              _this.nextLogin();
          } else {
            //返回数据失败
            _this.setData({
              errorInfo:res.data.message,
              isError:true
            })
          }
        }
      })
  },
  nextLogin(){
    let _this = this
    wx.request({
      url: http_host + 'user/login/sms',
      method: "POST",
      data: {
        mobile: app.globalData.phone
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // 判断是否正确传回数据
        if (res.data.code == 0) {
          _this.setData({
            isError: false
          })
          app.globalData.userInfo = res.data.data
          wx.setStorage({
            key: 'userInfo',
            data: res.data.data
          })
          if (res.data.data.textbookIdPractice) {
            app.book.id = res.data.data.textbookIdPractice
            wx.redirectTo({
              url: '/pages/afterindex/afterindex?bookId=' + res.data.data.textbookIdPractice
            })
          } else {
            // beforeindex
            wx.redirectTo({
              url: "/pages/beforeindex/beforeindex"
            })
          }
        } else {
          //返回数据失败
          _this.setData({
            errorInfo: res.data.message,
            isError: true
          })
        }
      }
    })
  },
  /** 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    this.setData({
      titleText:"验证码已发送至+86 "+app.globalData.phone
    })
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