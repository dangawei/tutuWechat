//index.js
const util = require("../../utils/config.js");

const app = getApp()
const http_host = util.http_host;
const img_url = util.img_url;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shuaxin:false,
    scrollleft: 200,
    windowHeight:'530',
    proList: [],
    bookId: 0,
    unitId:0,
    partId:0,
    xia:0
  },
  // 滑块
  //滑动获取选中商品
  getSelectItem: function (e) {
    var that = this;
    var itemWidth = e.detail.scrollWidth / that.data.partList.length;//每个商品的宽度
    var scrollLeft = e.detail.scrollLeft;//滚动宽度
    var curIndex = Math.round(scrollLeft / itemWidth);//通过Math.round方法对滚动大于一半的位置进行进位
   
    for (var i = 0, len = that.data.partList.length; i < len; ++i) {
      that.data.partList[i].selected = false;
    }
    that.data.partList[curIndex].selected = true;
    that.setData({
      partList: that.data.partList,
      giftNo: this.data.partList[curIndex].id
    });
  },

  //滑动移动事件
  handletouchmove: function (event) {
    var currentX = event.touches[0].pageX
    var currentY = event.touches[0].pageY
    var tx = currentX - this.data.lastX
    var ty = currentY - this.data.lastY
    var text = ""
    //左右方向滑动
    if (Math.abs(tx) > Math.abs(ty)) {
      if (tx < 0)
        text = "zuo"
      else if (tx > 0)
        text = "you"
    }
    //上下方向滑动
    else {
      if (ty < 0)
        text = "向上滑动"
      else if (ty > 0)
        text = "向下滑动"
    }
    //将当前坐标进行保存以进行下一次计算
    this.data.lastX = currentX
    this.data.lastY = currentY
    this.setData({
      text: text
    })
  },

  //滑动结束事件
  handletouchend: function (event) {
    var that = this
    this.data.currentGesture = 0;

    if (that.data.text == 'zuo') {
      //向左滑动
      // that.xiayiye()
    } else if (that.data.text == 'you') {
      // 向右滑动

    }
  },
 //点击关卡跳转页面
 tiaozhuan:function(e){
    if (e.currentTarget.dataset.is_block == 0) {
      app.tanchuang('关卡尚未解锁')
      return;
    }
    var that = this
   wx.setStorageSync("customsPassId", e.currentTarget.dataset.id)
    app.card.id = e.currentTarget.dataset.id
    app.card.name = e.currentTarget.dataset.name
    app.card.type = e.currentTarget.dataset.type

    app.partList.arr = that.data.partList
    app.partList.xia = e.currentTarget.dataset.xia
      // 判断题型属于哪个页面
      switch (e.currentTarget.dataset.type) {
        case 1:
          var url = 'levelzero/levelzero?bookId=' + that.data.bookId + '&unitId=' + that.data.unitId + '&partId=' + that.data.partId +'&customPassId=' + e.currentTarget.dataset.id + '&pass=0'
          break;
        case 2:
          var url = 'levelone/levelone?bookId=' + that.data.bookId + '&unitId=' + that.data.unitId + '&partId=' + that.data.partId + '&customPassId=' + e.currentTarget.dataset.id + '&pass=1'
          break;
        case 3:
          var url = 'leveltwo/leveltwo?bookId=' + that.data.bookId + '&unitId=' + that.data.unitId + '&partId=' + that.data.partId + '&customPassId=' + e.currentTarget.dataset.id + '&pass=2'
          break;
        case 4:
          var url = 'levelthree/levelthree?bookId=' + that.data.bookId + '&unitId=' + that.data.unitId + '&partId=' + that.data.partId + '&customPassId=' + e.currentTarget.dataset.id + '&pass=3'
          break;
        case 5:
          var url = 'levelfour/levelfour?bookId=' + that.data.bookId + '&unitId=' + that.data.unitId + '&partId=' + that.data.partId + '&customPassId=' + e.currentTarget.dataset.id + '&pass=4'
          break;
        case 6:
          var url = 'levelfive/levelfive?bookId=' + that.data.bookId + '&unitId=' + that.data.unitId + '&partId=' + that.data.partId + '&customPassId=' + e.currentTarget.dataset.id + '&pass=5'
          break;
        default:
         // 所有不符合条件执行代码
          app.tanchuang('哎呀，出错了！')
      }

      console.log(url);
      app.again.url = url
      //跳转至对应页面
      wx.navigateTo({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
        url: "/pages/" + url
      })
    // }
 },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    if(e){
      app.book.bookId=e.bookId
      app.book.bookName = e.bookName
      app.unit.unitId = e.unitId
      app.unit.unitName = e.unitName
      app.part.id = e.partId
      app.part.partId = e.partId
      app.part.partName = e.partName
      this.setData({
        bookId:e.bookId,
        unitId: e.unitId,
        partId: e.partId,
        partName: e.partName
      })
      // app.partList.xia = e.passPass
      app.partList.xia = 0
    }
    //将part信息存入app中  方便在题中调用
    var that = this
    //获取该part下所有关卡
    wx.request({
      url: http_host + 'custom/pass/list/' + wx.getStorageSync("partId"),
      data: {
        //从app中取出用户数据
        partId: app.part.partId
      },
      header: {
        'token': wx.getStorageSync("userInfo").token,
        'Content-Type': 'application/json'
      },
      success: function (res) {
        //判断返回数据是否正确
        if (res.data.code == 0) {
          console.log(res.data.data)
          if (res.data.data.length==0){
            console.log(11111);
            wx.showModal({
              title: '提示',
              content: "历史数据查询不到,请点击确定返回上一页,重新选择part",
              success: function (res) {
                wx.navigateBack({ changed: true });//返回上一页
              }
            })
          }else{
            app.part.all = res.data.data
            wx.setStorageSync("part", res.data.data)
            var List = res.data.data
            var list = List.sort(that.compare('sort'))
            var partlist = []
            var xia = 0
            for (var i in list) {
              partlist[i] = new Object();

              partlist[i] = list[i]

              partlist[i].xia = xia

              partlist[i].card_cover_url = partlist[i].icon
              // is_block 1关卡解锁 0没解锁
              if (partlist[i].score == null) {
                if (i == 0) {
                  partlist[i].is_block = 1
                } else if (i > 0 && partlist[i - 1].score != null) {
                  partlist[i].is_block = 1
                } else {
                  partlist[i].is_block = 0
                }
              } else {
                partlist[i].is_block = 1
              }
              xia++;
            }
            that.setData({
              partList: partlist,
              //共多少关卡
              part_number: partlist.length,

            })
            //判断当前part是否和 历史partid一致
            if (app.part.partId == app.part.lishi_id && app.partList.xia == -1) {
              if (app.partList.lishi_xia != 0) {
                that.setData({
                  address: app.partList.lishi_xia
                })
              }
            } else {
              if (app.partList.xia != 0) {
                that.setData({
                  address: app.partList.xia
                })
              }
            }
          }
        }else{
          //返回数据失败
          app.tanchuang('获取关卡详情错误！')
        }
    
      },
      
    })

  },
//partList排序
  compare: function compare(property){
    return function(a, b) {
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
        shuaxin:true
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(this.data.shuaxin){
      this.onLoad();
    }
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
      imageUrl: 'http://img.tutukids.com/group1/M00/00/0A/转发海报.png',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})