const util = require("../../utils/config.js");

const app = getApp()
const http_host = util.http_host;
const img_url = util.img_url;
var pages = getCurrentPages();
var currPage = pages[pages.length - 1];   //当前页面
var prevPage = pages[pages.length - 2];  //上一个页面

//index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showDialogshare:false,
    shuaxin:false,
    type: 0,  //0为未闯过关  1为闯过关
    part_id:0,   // part_id   继续闯关时候会用到
    unitlist: [],
    exercise:0,
    mind:1,
    img_url: img_url
  },
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
  addsubject(){
    wx.navigateTo({
      url: "/pages/addsubject/addsubject"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var that = this
    if (wx.getStorageSync("bookId")){
      app.book.id = wx.getStorageSync("bookId")
    }
   //获取当前教材详细内容
    wx.request({
      url: http_host + 'practice/book/detail/' + app.book.id,
      data: {
       //从app中取出用户数据
        bookId: app.book.id
      },
      header: {
       'token': wx.getStorageSync("userInfo").token,
      //  'token': "ZH5PoB87IVmjVJ7Fg6dSi6wq3kGJwazIUgX*XWLz1p4=",
       'Content-Type': 'application/json'
      },
      success: function (res) {
       //判断返回数据是否正确
       if(res.data.code == 0)
       {
          that.setData({
            //所有数据 方便以后调用
            all:res.data.data,
            //给单元赋值
            unitlist: res.data.data.unitsVOS,
            //给教材名称赋值
            book_name: res.data.data.name,
            //教材id  
            book_id: res.data.data.id,
            //教材图片
            book_img: res.data.data.icon,
            
          })
          //判断是否闯过关
         if (res.data.data.latestPassRecordVO != null){
            wx.setStorageSync("unitId", res.data.data.latestPassRecordVO.unitsId)
            wx.setStorageSync("partId", res.data.data.latestPassRecordVO.partsId)
            wx.setStorageSync("unitName", res.data.data.latestPassRecordVO.unitName)
            wx.setStorageSync("partName", res.data.data.latestPassRecordVO.partName)
            wx.setStorageSync("customPassId", res.data.data.latestPassRecordVO.customPassId)
            that.setData({
              //继续闯关中的 part名称
              curren_part_title_name: res.data.data.latestPassRecordVO.partName,
              // 闯过关的关卡数
              curren_card_id: res.data.data.latestPassRecordVO.customPassId,
              //存在闯过关卡记录
              type: 1,
              existence_unit: res.data.data.latestPassRecordVO.unitName,
              unitId: res.data.data.latestPassRecordVO.unitsId,
              existence_part: res.data.data.latestPassRecordVO.partName,
              part_id: res.data.data.latestPassRecordVO.partsId
            })
            app.unit.name = res.data.data.latestPassRecordVO.unitName
            //将partid存入app中
            app.part.lishi_id = res.data.data.latestPassRecordVO.partsId
          }
          app.book.name = res.data.data.book_name
          //获取该part下所有关卡
          // wx.request({
          //   url: http_host + 'getcardlist',
          //   data: {
          //     //从app中取出用户数据
          //     token: app.user.token,
          //     uid: app.user.uid,
          //     part_id: that.data.part_id
          //   },
          //   header: {
          //     'Content-Type': 'application/json'
          //   },
          //   success: function (res) {
          //     //判断返回数据是否正确
          //     if (res.data.code == 0) {

          //       console.log(3)
          //       console.log(res.data)
          //       var List = res.data.data.cards

          //       var list = List.sort(that.compare('card_sequence'))
          //       var partlist = []
          //       var xia = 0
          //       for (var i in list) {
           
          //         if (list[i].id == that.data.curren_card_id)
          //         {
          //           app.partList.lishi_xia = xia
          //         }

          //         xia++;
          //       }
          //       // that.setData({
          //       //   partList: partlist,
          //       //   //共多少关卡
          //       //   part_number: partlist.length,
          //       //   address: app.partList.xia

          //       // })
          //     } else {
          //       //返回数据失败
          //       app.tanchuang('获取关卡详情错误！')
          //     }
          //   },
          // })
       } else if (res.data.code == 46) {
         app.tanchuang('登录账号有误,点击确定重新登录！')
        //  setTimeout(function () {
        //    wx.reLaunch({
        //      url: '/pages/login/login'
        //    })
        //  }, 1500)
       } else{
         //返回数据不正确
         app.tanchuang('获取教材详情错误！')
       }
     }
   })

  },

  //点击关卡跳转页面
  jixu: function (e) {
    // 已修改
    app.card.id = this.data.curren_card_id
    app.card.name = this.data.curren_part_title_name
    //跳转至对应页面
    wx.navigateTo({    //保留当前页面，跳转到应用内的某个页面（最多打开6个页面，之后按钮就没有响应的）
      url: "/pages/partlist/partlist?bookId=" + wx.getStorageSync("bookId") + "&bookName=" + wx.getStorageSync("bookName") + "&unitId=" + wx.getStorageSync("unitId") + "&unitName=" + wx.getStorageSync("unitName") + "&partId=" + wx.getStorageSync("partId") + "&partName=" + wx.getStorageSync("partName") 
    })
  },

  //partList排序
  compare: function compare(property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      shuaxin: true,
      showDialogshare:false,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.shuaxin) {
      this.onLoad();
      // wx.redirectTo({
      //   url: '/pages/afterindex/afterindex'
      // })
    }   
    // currPage.onLoad();
    
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
      imageUrl: img_url+'转发海报.png',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})