
const util = require("../../utils/config.js");

const app = getApp()
const http_host = util.http_host;
const img_url = util.img_url;
const urlimg = util.urlimg;
const innerAudioContext = wx.createInnerAudioContext();
innerAudioContext.autoplay = true;
innerAudioContext.obeyMuteSwitch = false;
innerAudioContext.onPlay(() => {
  // console.log('开始播放')
})
innerAudioContext.onError((res) => {
  // console.log(res)
})
Page({

  /**
   * wordtype 0是一个单词或者一个句子的时候，1是对话形势的时候，2是一个人说多句话的形式
   */
  data: {

    wordtype: 0,
    worddata: [],
    //  整句话的时候所有的音乐
    allmusic: '',
    // 对数数量，有几个对话几个-1
    clickmusic: [-1, -1],
    //下一页按钮是否显示
    xiayiye: false,
    //完成按钮是否显示
    wancheng:false,
    //上一页按钮是否显示
    shangyiye:false,
    clicksound:1,
    number:1,
   

    // 滑动需要的参数
    lastX: 0,          //滑动开始x轴位置
    lastY: 0,          //滑动开始y轴位置
    text: "没有滑动",
    xuhao: 1,
    currentGesture: 0, //标识手势
  },
  // 加载数据
  getjiazai: function (xuhao) {
    var that = this;
    that.setData({
      clicksound: 1
    })
    //判断上一页是否显示
    if (parseInt(xuhao) !== 1) {
      this.setData({
        shangyiye: true
      })
    } else {
      this.setData({
        shangyiye: false
      })
    }
    //判断下一页是否显示
    if (parseInt(xuhao) < parseInt(that.data.number)) {
      this.setData({
        xiayiye: true,
        wancheng: false,
        xuhao: xuhao,
      })
    } else {
      this.setData({
        wancheng: true,
        xiayiye: false,
        xuhao: parseInt(that.data.number)
      })
    }
    setTimeout(function () {
      that.setData({
        clicksound: -1
      })
    }, 2000);
    var yes = "exercises.rightlist"
    var selectlist = 'exercises.selectlist';
    // 给将会用到的数据清空
    this.setData({
      [yes]: [],
      [selectlist]: [],
      // 当前达到第几部分
      selectindex: 0,
      // 当前第几个答错了
      errorselectindex: -1,
      // 是否正确点过
      clicking: 0,
      // 错误次数
      cuo_number: 0
    })
    //获取题目列表
    if (xuhao <= this.data.all.length) {
      that.setData({
        currentData: this.data.all[xuhao - 1],
        //正确的图片
        [yes]: this.data.all[xuhao - 1].sourceVOS,
        // 第二个正确答案
        // [yes2]: currentData.sourceVOS,
        // 结束
        //录音文件
        // video: encodeURI(res.data.data.question_title_voice).replace(/'/, "%27"),
        // video: this.data.all[xuhao - 1].audio,
      })
      // 判断是否闯关完成
      if (parseInt(xuhao) == this.data.number) {
        this.setData({
          xiayiti: false
        })
      }
      if (parseInt(xuhao) < this.data.number) {
        this.setData({
          xuhao: xuhao,
        })
      } else {
        this.setData({
          xuhao: this.data.number
        })
      }
      //所有图片
      var all_img = this.data.currentData.sourceVOS
      var data = []
      // var xia = 0
      for (let i = 0; i < all_img.length; i++) {
        all_img[i].eff = 0
        all_img[i].icon = encodeURI(all_img[i].icon).replace(/'/, "%27")
        // xia++;
      }
      data = data.sort(app.randomsort)
      that.setData({
        all_img: all_img
      })
      var voice = encodeURI(that.data.all_img[0].audio).replace(/ /, "%90").replace(/'/, "%27");
      // 默认进来放一次音乐
      innerAudioContext.src = voice;

      innerAudioContext.play();
    }
  },
  //获取数据
  huoqu: function (xuhao) {
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var index = e.pass
    var data = wx.getStorageSync("part")
    wx.setStorageSync("title", data[index].title)
    var that = this
    that.setData({
      customPassId: e.customPassId,
      partId: e.partId,
      unitId: e.unitId,
      bookId: e.bookId,
      pass:e.pass
    })
    that.huoqu(1)
    //修改顶部背景颜色
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f5ede2'
    })
    //音频播放结束后
    innerAudioContext.onEnded((res) => {
      that.setData({
        clickmusic: -1
      })
      innerAudioContext.stop();

    });
    var title = "0" + (app.partList.xia + 1) + " " + app.card.name
    //修改标题为关卡名称
    wx.setNavigationBarTitle({
      title: title//页面标题为路由参数
    })
  },
// 页面数据加载

jiazai:function (xuhao)
{
  innerAudioContext.stop();
  var that = this
  that.getjiazai(xuhao)

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
      text:text
    })
  },

  //滑动结束事件
  handletouchend: function (event) {
    var that = this
    this.data.currentGesture = 0;
    if(that.data.text == 'zuo'){
    //向左滑动
      that.xiayiye()
    }else if(that.data.text == 'you'){
    // 向右滑动
     
      if (that.data.xuhao == 1) {
        return;
      } else {
        that.shangyiye()
      }

    }

    this.setData({
      text:''
    })
  },

  //对象转数组
  objToArray: function (array) {
    var arr = []
    for (var i in array) {
      arr.push(array[i]);
    }
    return arr;
  },


  // 点击单个图片播放音乐
  singelClick: function (e) {
    var that = this
    var voice = encodeURI(e.currentTarget.dataset.audio).replace(/ /, "%90").replace(/'/, "%27")
    //停止播放之前的音乐     防止两重音
    innerAudioContext.stop();
    //播放某个图片下的音频文件
    innerAudioContext.src = voice
    innerAudioContext.play();
    that.setData({
      clicksound: 1
    })
    setTimeout(function () {
      that.setData({
        clicksound: -1
      })
    }, 2000);

  },

  //下一页按钮跳转
  xiayiye: function (e) {
    var that = this
    //字符串转换
    var xuhao = parseInt(this.data.xuhao) + 1
    if (parseInt(that.data.xuhao) == parseInt(that.data.number)){
      //发送后台增加分数
      wx.request({
        url: http_host + 'user/pass/record/add',
        method: 'POST',
        data: {
          customPassId: parseInt(that.data.customPassId),
          partsId: parseInt(that.data.partId),
          score: 100,
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
              url: '/pages/gameresult/gameresult?bookId=' + that.data.bookId + '&unitId=' + that.data.unitId + '&partId=' + that.data.partId + '&customPassId=' + that.data.customPassId + '&pass='+that.data.pass+'&fenshu=100'
            })
          }else{
            app.tanchuang(res.data.message);
          }
        }
      })
    }else{
      that.jiazai(xuhao)
    // wx.redirectTo({
    //   url: "/pages/levelone/levelone?customPassId=" + this.options.customPassId + "&number=" + this.options.number + "&xuhao=" + xuhao
    // })
    }
  },

  //上一页按钮跳转
  shangyiye:function ()
  {
    
    this.jiazai(parseInt(this.data.xuhao) - 1)
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
    //用户点击左上角返回 
    // innerAudioContext.stop();
    
    // wx.redirectTo({      //关闭当前页面，跳转到应用内的某个页面
    //   url: "/pages/partlist/partlist?id=" + app.part.id + '&name=' + app.part.name + '&cart_number=' + app.part.cart_number
    // })
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