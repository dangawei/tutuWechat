const util = require("../../utils/config.js");

const app = getApp()
const http_host = util.http_host;
const img_url = util.img_url;
const innerAudioContext = wx.createInnerAudioContext();
innerAudioContext.autoplay = true;
innerAudioContext.obeyMuteSwitch = false;
innerAudioContext.onError((res) => {
})
Page({

  /**
   * 默认情况下istrue:0，正确情况下istrue:1
   */
   /**选择图为填空图的2倍
   *
   * */
  data: {
    //默认喇叭放大
    clicksound: 1,
   
    bottomtype:1,
 
    bottomtype: 1,
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    indicatorcolor: '#cacaca',
    color: '#ffd742',
    istrue:1,
    //错误次数  用于播放失败音频
    cuo_number: 0,
    // 下面的数组
    arr: [],
    // 练习的音乐和正确答案
    exercises: {
      music: '',
      // list和effective数量相同 是rightlist和selcetlist的两倍
      // 数量要相同
      rightlist: [],
      selectlist: ['__'],
      
    },
     // 当前达到第几部分
    selectindex: 0,
    // 当前第几个答错了
    errorselectindex: -1,
    // 是否正确点过
    clicking: 0,
    istrue: 0,
    // 错误次数
    errornum: 0,
    // 连续正确次数
    rightnum: 0,
    // 分数
    score: 0,
    wancheng: true,
   // 滑动需要的参数
    lastX: 0,          //滑动开始x轴位置
    lastY: 0,          //滑动开始y轴位置
    text: "没有滑动",
    xuhao: 1,
    currentGesture: 0, //标识手势


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
          _this.jiazai(1)
        } else {
          //返回数据失败
          // app.tanchuang('获取题错误！')
          console.log(res.data)
        }
      }
    })
  },
  // 加载数据
jiazai:function (xuhao)
{
  var that = this;
  if (parseInt(xuhao) < parseInt(that.data.number)) {
    this.setData({
      xuhao: xuhao,
    })
  } else {
    this.setData({
      xuhao: parseInt(that.data.number)
    })
  }
  var yes = "exercises.rightlist"

  // 第二个正确答案
  // var yes2 = "exercises.rightlist2"

  var selectlist = 'exercises.selectlist';
  that.setData({
    [yes]: [],
    // [yes2]: [],
    [selectlist]: [],

    // 当前达到第几部分
    selectindex: 0,
    // 当前第几个答错了
    errorselectindex: -1,
    // 是否正确点过
    clicking: 0,
    istrue: 0,
    // 错误次数
    errornum: 0,
    // 连续正确次数
    rightnum: 0,
    cuo_number: 0,
    sourceVOS: that.data.all[xuhao-1].sourceVOS
  })
  var yes = "exercises.rightlist"
  // 第二个正确答案
  // var yes2 = "exercises.rightlist2"
  var array = (that.data.sourceVOS[1].text).split(",");
  for(let i in array){
    if (!array[i]){
      array.splice(i,1)
    }
  }
  // 结束
  that.setData({
    //正确的顺序
    [yes]: array,
    // 第二个正确答案
    // [yes2]: res.data.data.question_answer1,
    //录音文件
    video:that.data.sourceVOS[0].audio,
    //正确后显示的图片
    img:that.data.sourceVOS[0].icon
  })
  // if (res.data.data.question_answer1 == null || res.data.data.question_answer1 == '') {
  //   that.setData({
  //     // 第二个正确答案
  //     [yes2]: [],
  //   })
  // }

  //所有文字
  var all_text = (that.data.sourceVOS[2].text).split(",")
  var data = []
  var xia = 0
  for (var i in all_text) {
    if (!all_text[i]) {
      all_text.splice(i, 1)
    }else{
      data[xia] = new Object();
      data[xia].text = all_text[i]
      data[xia].id = i
      data[xia].eff = 0
      xia++;
    }

  }
  data = data.sort(app.randomsort)
  that.setData({
    arr: data
  })

  // that.updatadataarr();//对答案列表进行分页

  //给selectlist赋值  
  for (var s = 0; s < that.data.exercises.rightlist.length; s++) {
    var zhi = "exercises.selectlist[" + s + "]"

    that.setData({
      [zhi]: "__"
    })
  }

  innerAudioContext.src = ''
  // 默认进来放一次音乐
  innerAudioContext.src = that.data.video;
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


  selectClick: function (e) {
    if (e.currentTarget.dataset.eff == 1) {
      return;
    }
    var that = this
    // 判断是否答对
    if (e.currentTarget.dataset.text == this.data.exercises.rightlist[this.data.selectindex]) {
      this.dadui(e, this.data.exercises.rightlist.length);
    }else{
      // 错误逻辑层
      //停止播放之前的音乐     防止两重音
      innerAudioContext.stop();
      if (that.data.cuo_number == 0) {
        innerAudioContext.src = 'http://app.yizhizaibo.cn/eat/public/tutu/careful.mp3';

      } else if (that.data.cuo_number == 1) {
        innerAudioContext.src = 'http://app.yizhizaibo.cn/eat/public/tutu/notquite.mp3';
      } else if (that.data.cuo_number == 2) {
        innerAudioContext.src = 'http://app.yizhizaibo.cn/eat/public/tutu/youalmostthere.mp3';
      } else if (that.data.cuo_number == 3) {
        innerAudioContext.src = 'http://app.yizhizaibo.cn/eat/public/tutu/entryagain.mp3';
      } else if (that.data.cuo_number >= 4) {
        innerAudioContext.src = 'http://app.yizhizaibo.cn/eat/public/tutu/comeonyoucandoit.mp3';
      }
      innerAudioContext.play();
      this.setData({
        errornum: this.data.errornum + 1,
        errorselectindex: this.data.selectindex,
        score: this.data.score - 5,
        clicking: 1,
        rightnum: that.data.rightnum -1,
        cuo_number: this.data.cuo_number + 1
      })
      setTimeout(function () {
        that.setData({
          errorselectindex: -1
        })
      }, 2000);
    
    }
 
    setTimeout(function () {
      that.setData({
        clicking: 0
      })
    }, 2000);
  },

  // 答对执行代码
dadui:function (e,number)
{
  innerAudioContext.stop();
  var that = this;
  for (var i = 0; i < that.data.arr.length; i++) {
    if (e.currentTarget.dataset.id == that.data.arr[i].id) {
      var arr_id = i
      break;
    }
  }
  if (this.data.arr[arr_id].eff != 0) {
    return;
  }

  var selectlist = 'exercises.selectlist[' + this.data.selectindex + ']';
  var effective = 'arr[' + arr_id + '].eff';


  this.setData({
    [selectlist]: this.data.arr[arr_id].text,
    selectindex: this.data.selectindex + 1,
    [effective]: 1,
    rightnum: that.data.rightnum + 1
  })
  // this.updatadataarr();
  innerAudioContext.stop();
  innerAudioContext.src = 'https://www.chengxuyuantoutiao.com/a/sound/ding.mp3';
  innerAudioContext.play();


  // 判断这题目是否答完

  if (this.data.exercises.selectlist[this.data.exercises.selectlist.length - 1] != '__') {
    that.setData({
      score: this.data.score + 20,
      clicking: 1,
      istrue: 1
    })
    this.setData({
      errornum: 0,
      
    })

    setTimeout(function () {
      that.xiayiti()
    }, 1500) //延迟时间 这里是1秒


  } else {

  }


},
  //点击播放的时候的状态
  soundClick: function () {
    var that = this
    innerAudioContext.stop()
    innerAudioContext.src = this.data.video;
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

  //下一题
  xiayiti: function () {
    var that = this

    if (parseInt(that.data.xuhao) == parseInt(that.data.number)) {
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

    } else{
    that.jiazai(parseInt(that.data.xuhao) + 1)
    }
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

  // updatadataarr: function () {
  //   var that = this;
  //   var array = Object.keys(that.data.arr)
  //   let subArrayNum = 8;
  //   var dataArr = new Array(Math.ceil(array.length / subArrayNum));
  //   //console.log('dataArr', dataArr);
  //   for (let i = 0; i < dataArr.length; i++) {
  //     dataArr[i] = new Array();
  //   }
  //   for (let i = 0; i < array.length; i++) {
  //     dataArr[parseInt(i / subArrayNum)][i % subArrayNum] = that.data.arr[i];
  //   }
  //   console.log( dataArr)
  //   that.setData({
  //     dataArr: dataArr,
  //     len: array.length
  //   })
  // },
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
  }
})