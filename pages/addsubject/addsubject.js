const util = require("../../utils/config.js");

const app = getApp()
const http_host = util.http_host;
const img_url = util.img_url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //激活状态
    tag_active: 0,
    //分类总数0开始
    allnum: 3,
    //移动方向
    movefx: 1,
    tocheY: 0,
    grades: [1, 2, 3],
    bookVersion:'',//版本号
    book_id:'',//练习教材id
  },
  getBooks: function (e) {
    console.log(e)
    if (e.currentTarget){
      let e = e.currentTarget.dataset
    }else{
      let e=e;
    }
     
    let that=this
    this.setData({
      tag_active: e
    });
    //获取所有教材版本
    wx.request({
      url: http_host + '/practice/book/' + e,
      data: {
        bookVersionId: e
      },
      header: {
        // 'token': app.globalData.userInfo.token,
        'token': wx.getStorageSync("userInfo").token,
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // 判断是否正确传回数据
        if (res.data.code == 0) {
          that.setData({
            //数据
            groupBooks: res.data.data
          })

        } else {
          //返回数据失败
          app.tanchuang('获取数据错误！')
        }
      }
    })

  },
  //选择版本获得教材
  selectdataindex: function (event) {
    let e = event.currentTarget.dataset.index
    let that = this
    this.setData({
      tag_active: e
    });
    //获取所有教材版本
    wx.request({
      url: http_host + '/practice/book/' + e,
      data: {
        bookVersionId: e
      },
      header: {
        // 'token': app.globalData.userInfo.token,
        'token': wx.getStorageSync("userInfo").token,
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // 判断是否正确传回数据
        if (res.data.code == 0) {
          that.setData({
            //数据
            groupBooks: res.data.data
          })

        } else {
          //返回数据失败
          app.tanchuang('获取数据错误！')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log(e);
    if(e){
      this.setData({
        book_id: e.bookId
      })
    }
    
    var that = this
    // 获取所有的教材版本
    wx.request({
      url: http_host + 'practice/version/list',
      data: {
        // bookVersionId: app.globalData.userInfo.bookVersionId
      },
      header: {
        // 'token': app.globalData.userInfo.token,
        'token': wx.getStorageSync("userInfo").token,
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // 判断是否正确传回数据
        if (res.data.code == 0) {
          that.setData({
            //数据
            bookVersion: res.data.data
          })
          that.getBooks(res.data.data[0].id)
        } else {
          //返回数据失败
          app.tanchuang('获取数据错误！')
        }
      }
    })
  },
  
  //添加到个人教材中
  add:function (e)
  { 
    //发送后台添加
    wx.request({
      url: http_host + 'user/choose/practice/' + e.currentTarget.dataset.id,
      data: {
        //从app中取出用户数据
        bookId: e.currentTarget.dataset.id
      },
      header: {
        // 'token': app.globalData.userInfo.token,
        'token': wx.getStorageSync("userInfo").token,
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // 判断是否正确传回数据
        if (res.data.code == 0) {
          app.book.id = e.currentTarget.dataset.id
          app.book.name = e.currentTarget.dataset.name
          wx.redirectTo({
            url: '/pages/afterindex/afterindex?bookId=' + e.currentTarget.dataset.id
          })
        } else {
          //返回数据失败
          app.tanchuang('添加数据错误！')
        }
      }
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
    return {
      title: app.globalData.userInfo.nickName + '  邀请你来闯关啦~图图小学英语课后趣味练习！',
      desc: '转发描述',
      path: '/pages/index/index',
      imageUrl:"http://tutu-resource-base.test.upcdn.net/a/%E8%BD%AC%E5%8F%91%E6%B5%B7%E6%8A%A5.png",
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  
  touchdataindex: function (e) {
    if (e.touches[0].clientY < this.data.tocheY) {
      this.setData({
        movefx: 0
      })
    } else {
      this.setData({
        movefx: 1
      })
    }
    this.setData({
      tocheY: e.touches[0].clientY
    })
  }
})

