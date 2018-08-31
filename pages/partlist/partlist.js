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
 tiaozhuan:function (e)
 {
  
   if (e.currentTarget.dataset.is_block == 0) {
     app.tanchuang('关卡尚未解锁')
      return;
   }
    var that = this
    app.card.id = e.currentTarget.dataset.id
    app.card.name = e.currentTarget.dataset.name
    app.card.type = e.currentTarget.dataset.type

    app.partList.arr = that.data.partList
    app.partList.xia = e.currentTarget.dataset.xia
   console.log(app.card.name)
      // 判断题型属于哪个页面
      switch (e.currentTarget.dataset.type) {
        case 1:
          var url = 'levelone/levelone?card_id=' + e.currentTarget.dataset.id + '&xuhao=1'
          
          break;
        case 2:
          var url = 'leveltwo/leveltwo?card_id=' + e.currentTarget.dataset.id + '&xuhao=1'
          break;
        case 3:
          var url = 'levelthree/levelthree?card_id=' + e.currentTarget.dataset.id + '&xuhao=1'
          break;
        case 4:
          var url = 'levelfour/levelfour?card_id=' + e.currentTarget.dataset.id + '&xuhao=1'
          break;
        case 5:
          var url = 'levelfive/levelfive?card_id=' + e.currentTarget.dataset.id + '&xuhao=1'
          break;
        default:
         // 所有不符合条件执行代码
          app.tanchuang('哎呀，出错了！')
      }


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
    if(e.qing == 1)
    {
      
      app.partList.xia = 0
    }
 
    this.setData({
      name:e.name,
    
    })
 
    //将part信息存入app中  方便在题中调用
    app.part.id = e.id
    app.part.name = e.name
   
    var that = this
    //获取该part下所有关卡
    wx.request({
      // url: http_host + 'custom/pass/list/' + e.id,
      url: http_host + 'custom/pass/list/213',
      data: {
        //从app中取出用户数据
        partId:e.id
      },
      header: {
        // 'token': app.globalData.userInfo.token,
        'token': "ZH5PoB87IVmjVJ7Fg6dSi6wq3kGJwazIUgX*XWLz1p4=",
        'Content-Type': 'application/json'
      },
      success: function (res) {
        //判断返回数据是否正确
        if (res.data.code == 0) {
          var List = res.data.data
          var list = List.sort(that.compare('sort'))
          var partlist = []
          var xia = 0
          for(var i in list)
          {

              partlist[i] = new Object();
              
              partlist[i] = list[i]

              partlist[i].xia = xia

              // partlist[i].card_cover_url = partlist[i].card_cover_url.replace(/'/, "%27")
              // is_block 1关卡解锁 0没解锁
            if (partlist[i].score==null){
              if(i==2){
                partlist[i].is_block = 1
              }else{
                partlist[i].is_block = 0
              }
              
            }else{
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
          console.log(app.partList.xia)
          if (app.part.id == app.part.lishi_id && app.partList.xia == -1)
          {
        console.log('shang')
        console.log(app.partList.lishi_xia)
            if (app.partList.lishi_xia == 0) {
             
            } else {
            
              that.setData({
                address: app.partList.lishi_xia
              })
            }
          }else{
          console.log('xia')
          if(app.partList.xia == 0)
          {
          
          }else{
            console.log('xia')
            console.log(app.partList.xia)
            that.setData({
              address: app.partList.xia
            })
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
      wx.redirectTo({     
        url: "/pages/partlist/partlist?id=" + this.options.id + "&name=" + this.options.name
      })
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
    return {
      title: app.globalData.userInfo.nickName + '  邀请你来闯关啦~图图小学英语课后趣味练习！',
      desc: '转发描述',
      path: '/pages/index/index',
      imageUrl: "http://tutu-resource-base.test.upcdn.net/a/%E8%BD%AC%E5%8F%91%E6%B5%B7%E6%8A%A5.png",
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  
})