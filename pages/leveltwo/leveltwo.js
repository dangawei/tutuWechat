const util = require("../../utils/config.js");

const app = getApp()
const http_host = util.http_host;
const img_url = util.img_url;
const urlimg = util.urlimg;
const innerAudioContext = wx.createInnerAudioContext();
innerAudioContext.autoplay = true;
innerAudioContext.obeyMuteSwitch = false;
innerAudioContext.onError((res) => {
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stop:0,
    // 点击播放效果
    clicksound: 1,
    clicking:0,
    exercises: [],

    score: 0,
    // 当前的练习题目
    nowexercises: 0,
    // 对的状态
    rightborder: -1,
    // 错误的状态
    errorborder: -1,
    // 对的次数
    // errornum:0,
    // 错的次数
    rightnum: 0,
    xiayiti: false,
    wancheng:false,
    cuo_number:0,
    // 滑动需要的参数
    lastX: 0,          //滑动开始x轴位置
    lastY: 0,          //滑动开始y轴位置
    text: "没有滑动",
    currentGesture: 0, //标识手势
    currentIndex:1,//当前题号
    img_url: img_url
  },

  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (e) {
    var index = e.pass
    var data = wx.getStorageSync("part")
    wx.setStorageSync("title", data[index].title)
    var that = this
    // 异步请求数据
    //给当前关卡数 和 总关卡数  赋值
    that.setData({
      customPassId: e.customPassId,
      partId: e.partId,
      unitId: e.unitId,
      bookId: e.bookId,
      pass: e.pass
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f5ede2'
    })

    var title = "0" + (parseInt(e.pass) + 1) + " " + wx.getStorageSync("part")[parseInt(e.pass)].title
    //修改标题为关卡名称
    wx.setNavigationBarTitle({
      title: title//页面标题为路由参数
    })
    that.huoqu(e.customPassId)
  },

  // 加载数据
  getjiazai: function (reset) {
    var that = this;
    var index=parseInt(reset)-1
    if (parseInt(reset) >= parseInt(that.data.number)) {
      this.setData({
        xiayiti: false,
        wancheng: true,
      })
    }else{
      this.setData({
        xiayiti: true,
        wancheng: false
      })
    }
    var data = this.data.all[index].sourceVOS.sort(app.randomsort)
    this.setData({
      stop: 0,
      clicking: 0,
      errorborder: -1,
      cuo_number: 0,
      currentIndex: parseInt(reset),
      data: data,
      sourceIds: this.data.all[index].sourceIds
    })
    that.data.data.forEach(function(obj){
      if (obj.text.toLowerCase() == (that.data.sourceIds).toLowerCase()){
        that.setData({
          audio: obj.audio,
          correctId:obj.id
        })
      }
    })
    var voice = encodeURI(that.data.audio).replace(/ /, "%90").replace(/'/, "%27")
    // 默认进来放一次音乐
    innerAudioContext.src = voice;
    innerAudioContext.play();
  },
  //获取数据
  huoqu: function (reset) {
    var _this = this
    wx.request({
      url: http_host + 'custom/pass/subject/list/' + _this.data.customPassId,
      // url: http_host + 'custom/pass/subject/list/436',
      data: {
        // passId: this.data.customPassId
        passId: _this.data.customPassId
      },
      header: {
        'token': wx.getStorageSync("userInfo").token,
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // 判断是否正确传回数据
        if (res.data.code == 0) {
          _this.setData({
            //所有数据
            all: res.data.data,
            number: res.data.data.length
          })
          // 加载数据
          _this.getjiazai(1)
        } else {
          //返回数据失败
          // app.tanchuang('获取题错误！')
          console.log(res.data)
        }
      }
    })
  },
  // 点击播放正确
  singelClickAll() {
    var voice = encodeURI(this.data.audio).replace(/ /, "%90").replace(/'/, "%27")
    //停止播放之前的音乐     防止两重音
    innerAudioContext.stop();
    innerAudioContext.src = voice
    innerAudioContext.play();
  },
  singelClick: function (e) {
    innerAudioContext.stop();
    var that = this;
    var xia = e.currentTarget.dataset.xia
    if(that.data.stop == 1){
      return;
    }else{
      this.setData({
        stop:1
      })
    }
    // 判断是否正确
    if (this.data.correctId == e.currentTarget.dataset.id) {
      //停止播放之前音乐文件   防止两重音
      var voice = encodeURI(util.ok).replace(/ /, "%90").replace(/'/, "%27")
      innerAudioContext.stop();
      // innerAudioContext.src = 'https://www.chengxuyuantoutiao.com/a/sound/ding.mp3';
      innerAudioContext.src = voice;
      var up = "data[" + xia + "].green";
      that.setData({
        //绿色  下标的值
        [up]: 1,
        //分数加20
        score: parseInt(this.data.score) + 20,
        errornum: that.data.errornum + 1,
        clicking:1,
       
      })
      if (parseInt(that.data.currentIndex) == parseInt(that.data.number))
      {
          that.wancheng()
      }else{
        setTimeout(function () {
          clicking: 0
          errorborder: -1
          that.xiayiti()
        }, 2000)
      }
    } else {
      console.log(that.data.cuo_number)
      //错误执行逻辑层
      //停止播放之前的音乐     防止两重音
      innerAudioContext.stop();
      if (that.data.cuo_number == 0) {
        // innerAudioContext.src = 'http://app.yizhizaibo.cn/eat/public/tutu/careful.mp3';
        innerAudioContext.src = util.error1;

      } else if (that.data.cuo_number == 1) {
        innerAudioContext.src = util.error2;
        // innerAudioContext.src = 'http://app.yizhizaibo.cn/eat/public/tutu/notquite.mp3';
      } else if (that.data.cuo_number == 2) {
        innerAudioContext.src = util.error3;
        // innerAudioContext.src = 'http://app.yizhizaibo.cn/eat/public/tutu/youalmostthere.mp3';
      } else if (that.data.cuo_number == 3) {
        innerAudioContext.src = util.error4;
        // innerAudioContext.src = 'http://app.yizhizaibo.cn/eat/public/tutu/entryagain.mp3';
      } else if (that.data.cuo_number >= 4) {
        innerAudioContext.src = util.error5;
        // innerAudioContext.src = 'http://app.yizhizaibo.cn/eat/public/tutu/comeonyoucandoit.mp3';
      }
      innerAudioContext.play();

      var up = "data[" + xia + "].red";
      that.setData({
        //红色  下标的值
        [up]: 1,
        errorborder:1,
        clicking:1,
        score: parseInt(this.data.score) - 5,
        errornum: this.data.errornum - 1,
        rightnum: 0,
        cuo_number:that.data.cuo_number + 1
      })
      setTimeout(function () {
        that.setData({
          clicking: 0,
          errorborder: -1,
          [up]: 0,
        })
      }, 1000);
      that.setData({
        stop: 0,
      })
    }
  },

//点击完成按钮
  wancheng:function (){
    var that = this
    //发送后台增加分数
    wx.request({
      url: http_host + 'user/pass/record/add',
      method: 'POST',
      data: {
        customPassId: parseInt(that.data.customPassId),
        partsId: parseInt(that.data.partId),
        score: that.data.score,
        textbookId: parseInt(that.data.bookId),
        unitsId: parseInt(that.data.unitId)
      },
      header: {
        'token': wx.getStorageSync("userInfo").token,
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.redirectTo({
            url: '/pages/gameresult/gameresult?bookId=' + that.data.bookId + '&unitId=' + that.data.unitId + '&partId=' + that.data.partId + '&customPassId=' + that.data.customPassId + '&pass=' + that.data.pass + '&fenshu=' + that.data.score
          })
        } else {
          app.tanchuang(res.data.message);
        }
      }
    })
  },
  //通关跳转页面
  tongguan:function (){
    var that = this
    wx.showModal({
      title: '温馨提示',
      content: '恭喜您，已过关！',
      success: function (res) {
        wx.redirectTo({
          url: "/pages/gameresult/gameresult?fenshu=" + parseInt(that.data.score)
        })
      }
    })
  },
  xiayiti:function (){
    this.getjiazai(parseInt(this.data.currentIndex) + 1)
  },

  //对象转数组
  objToArray: function (array) {
    var arr = []
    for (var i in array) {
      arr.push(array[i]);
    }
    console.log(arr);
    return arr;
  },
  soundClick: function () {
    var that = this
    that.setData({
      clicksound: 1
    })
    var voice = encodeURI(this.data.video).replace(/ /, "%90").replace(/'/, "%27")
    innerAudioContext.src = voice;
    innerAudioContext.play();
    setTimeout(function () {
      that.setData({
        clicksound: -1
      })
    }, 2000);
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
    innerAudioContext.stop();
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
  }
})