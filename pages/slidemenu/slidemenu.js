const util = require("../../utils/config.js");

const app = getApp()
const http_host = util.http_host;
const img_url = util.img_url;
const urlimg = util.urlimg;
Page({

  /**
  * 页面的初始数据
  */
  data: {
    showDialogshare: false,
    shuaxin: false,
    //part数组
    part_list: [],
    unit_list: [],
    image: "http://img.tutukids.com/group1/M00/00/0A/part@2X.png",
    curNav: 1,
    curIndex: 0
  },

  /**
    * 生命周期函数--监听页面加载
    */
  onLoad: function (e) {
    wx.setStorageSync("unitId", e.unitId)
    wx.setStorageSync("partId", e.partId)
    wx.setStorageSync("unitName", e.unitName)
    wx.setStorageSync("partName", e.partName)
    wx.setStorageSync("bookName", e.bookName)
    wx.setNavigationBarTitle({
      title: e.bookName
    })
    this.setData({
      bookId:e.bookId,
      unitId: e.unitId,
      unitName:e.unitName,
      bookName:e.bookName
    })
    //显示加载提示框
    // wx.showLoading({
    //   title: '加载中',
    // })
  },
  //事件处理函数
  switchRightTab: function (e) {
    // 获取item项的id，和数组的下标值
    let id = e.target.dataset.id,
    index = e.target.dataset.index;
    this.setData({
      unitId: e.target.dataset.id,
      unitName: e.target.dataset.name,
      partsVOS: this.data.unit_list[index].partsVOS
    })
    //给app中的 unit赋值
    app.unit.id = id
    app.unit.name = e.target.dataset.name
    // 把点击到的某一项，设为当前index
    this.setData({
      curNav: id,
    })
  },
  // 点击进入partlist
  enterPartlist(e){
    if (e.currentTarget.dataset.canunlock==2){
      this.popup.showPopup();
    }else{
      wx.setStorageSync("unitId", this.data.unitId)
      wx.setStorageSync("partId", e.currentTarget.dataset.partid)
      wx.setStorageSync("unitName", this.data.unitName)
      wx.setStorageSync("partName", e.currentTarget.dataset.partname)
      // wx.setStorageSync("passPass", e.currentTarget.dataset.passpass)
      console.log("/pages/partlist/partlist?bookId=" + this.data.bookId + "&bookName=" + this.data.bookName + "&unitId=" + this.data.unitId + "&unitName=" + this.data.unitName + "&partId=" + e.currentTarget.dataset.partid + "&partName=" + e.currentTarget.dataset.partname)
      wx.navigateTo({    //保留当前页面，跳转到应用内的某个页面（最多打开6个页面，之后按钮就没有响应的）
        url: "/pages/partlist/partlist?bookId=" + this.data.bookId + "&bookName=" + this.data.bookName + "&unitId=" + this.data.unitId + "&unitName=" + this.data.unitName + "&partId=" + e.currentTarget.dataset.partid + "&partName=" + e.currentTarget.dataset.partname
      })
    }
    
  },
  //取消事件
  _error() {
    this.popup.hidePopup();
  },
  //确认事件
  _success() {
    this.popup.showPopup();
  },
  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function () {
    this.setData({
      shuaxin: true,
      showDialogshare: false,
    })
    this.popup = this.selectComponent("#popup");
  },

  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    var that = this
    //获取所有单元数组详情
    wx.request({
      url: http_host + 'practice/units/list/' + this.data.bookId,
      data: {
        //从app中取出用户数据
        bookId: this.data.bookId
      },
      header: {
        'token': wx.getStorageSync("userInfo").token,
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 0) {
          if (that.data.unitId == '' || that.data.unitId == null) {
            var liang = res.data.data.unitsVOS[0].id
            var unitname = res.data.data.unitsVOS[0].text
          } else {
            var liang = that.data.unitId
            var unitname = that.data.unitName
          }
          that.setData({
            unit_list: res.data.data.unitsVOS,
            unitId: liang,
            unitName: unitname
          })
          that.data.unit_list.forEach(function (obj) {
            if (obj.id == liang) {
              that.setData({
                partsVOS: obj.partsVOS
              })
            }
          })
          app.unit.id = liang
          app.unit.name = unitname
        } else if (res.data.code == 46) {
          app.tanchuang('登录账号有误,点击确定重新登录！')
        } else {
          //返回数据失败
          app.tanchuang('获取unit错误！')
        }

        that.setData({
          //单元高亮赋值
          curNav: liang,
        })
      },
      error: function (res) {
        console.log('404');
      },
    })
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
})
