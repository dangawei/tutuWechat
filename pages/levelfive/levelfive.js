const util = require("../../utils/config.js");

const app = getApp()
const http_host = util.http_host;
const img_url = util.img_url;
const innerAudioContext = wx.createInnerAudioContext();
innerAudioContext.autoplay = true;
innerAudioContext.obeyMuteSwitch = false;
innerAudioContext.onError((res) => {
  // console.log(res.errMsg)
  // console.log(res.errCode)
})
// pages/levelthree/levelthree.js
Page({
  /**选择图为填空图的2倍
   *
   * 
   */
  data: {
    all: [],//所有关卡数据
    // 下面的数组
    arr: [],
    // 当前关卡id
    customPassId: 0,
    clicksound: 1,
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    indicatorcolor: '#cacaca',
    color: '#ffd742',
    // 练习的音乐
    exercises: {
      music: '',
      rightlist: [],
      selectlist: [],
    },
    // 当前达到第几部分
    selectindex: 0,
    // 当前第几个答错了
    errorselectindex: -1,
    // 是否正确点过
    clicking: 0,
    // 错误次数
    errornum: 0,
    // 连续正确次数
    rightnum: 0,
    // 分数
    score: 0,
    xiayiti: true,
    //错误次数 用于播放错误音乐
    cuo_number: 0,
    // 滑动需要的参数
    lastX: 0,          //滑动开始x轴位置
    lastY: 0,          //滑动开始y轴位置
    text: "没有滑动",
    xuhao: 1,
    currentGesture: 0, //标识手势

  },
  //获取所有题目列表
  huoqu: function () {
    var _this = this
    wx.request({
      url: http_host + 'custom/pass/subject/list/' + _this.data.customPassId,
      data: {
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
          // console.log(_this.data.all)
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
  //随机打乱图片顺序

  // 加载数据
  jiazai: function (xuhao) {
    var that = this;
    that.setData({
      clicksound: 1
    })
    setTimeout(function () {
      that.setData({
        clicksound: -1
      })
    }, 2000);
    // var yes = "exercises.rightlist"
    // 第二个正确答案
    // var selectlist = 'correctyes';
    // 给将会用到的数据清空
    this.setData({
      // [yes2]: [],
      // [selectlist]: [],
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
      var correctDate = this.data.all[xuhao - 1].sourceIds
      var correctDates = correctDate.replace(/[\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\,|\<|\.|\>|\?]/g, "")
      var arrayYes = correctDates.split("/")
      console.log(arrayYes)
      that.setData({
        currentData: this.data.all[xuhao - 1],
        // //正确的图片
        // correctyes: correctDates,
        // 第二个正确答案
        // [yes2]: currentData.sourceVOS,
        // 结束
        //录音文件
        // video: encodeURI(res.data.data.question_title_voice).replace(/'/, "%27"),
        video: this.data.all[xuhao - 1].sentenceAudio,
        customPassId: this.data.all[xuhao - 1].customsPassId,

      })
      // console.log(this.data.currentData)
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
      // var data = []
      // // var xia = 0
      for (let index in arrayYes) {
        var a = arrayYes[index].toLowerCase();
        for (let i = 0; i < all_img.length; i++) {
          if (a == all_img[i].text.toLowerCase()) {
            all_img[i].eff = 0
            all_img[i].show = 0
            arrayYes[index] = all_img[i]
            // return
            // xia++;
          }
        }
      }
      var arrayCopy = arrayYes.concat();
      // console.log([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }].sort(app.randomsort))
      var data = arrayCopy.sort(app.randomsort)
      console.log(data);
      that.setData({
        dataArr: arrayYes,
        correctyes: arrayYes,
        len: arrayYes.length,
        // correctyes: correctDates,
        arr: data
      })
      // that.updatadataarr();//对答案列表进行分页

    }
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
  soundClicks: function () {
    innerAudioContext.stop();
    innerAudioContext.src = this.data.video;

    innerAudioContext.play();
  },
  selectClick: function (e) {
    console.log(e)
    var that = this
    if (e.currentTarget.dataset.eff == 1) {
      return;
    }
    // 判断第一个正确答案是否答对
    if (e.currentTarget.dataset.id == this.data.correctyes[this.data.selectindex].id) {
      that.dadui(e, 1)
    } else {
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
  // 答对后执行
  dadui: function (e, number) {
    innerAudioContext.stop();
    var that = this;
    innerAudioContext.src = 'http://img.tutukids.com/group1/M00/00/0A/ding.mp3';
    innerAudioContext.play();
    // for (var i = 0; i < that.data.arr.length; i++) {
    //   if (e.currentTarget.dataset.id == that.data.arr[i].id) {
    //     var arr_id = i
    //     break;
    //   }
    // }
    var arr_id = e.currentTarget.dataset.index
    if (this.data.arr[arr_id].eff != 0) {
      return;
    }
    var selectlist = 'correctyes[' + this.data.selectindex + '].show';
    var effective = 'arr[' + arr_id + '].eff';
    this.setData({
      [selectlist]: 1,
      selectindex: this.data.selectindex + 1,
      [effective]: 1
    })
    // console.log(this.data.correctyes);
    // this.updatadataarr();
    // 判断这题目是否答完
    if (this.data.selectindex == this.data.correctyes.length) {
      that.setData({
        score: this.data.score + 20,
        clicking: 1
      })
      this.setData({
        errornum: 0,
      })
      innerAudioContext.src = that.data.video;

      innerAudioContext.play();
      if (parseInt(that.data.xuhao) == this.data.number) {
        setTimeout(function () {
          that.wancheng()
        }, 2800)
      } else {
        setTimeout(function () {
          //下一题
          that.jiazai(parseInt(that.data.xuhao) + 1)
        }, 2800)
      }

    }

  },
  //点击完成按钮
  wancheng: function () {
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

  // 点击播放按钮的效果
  soundClick: function () {
    var that = this
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
  selectClick1: function (e) {
    console.log('答案是：' + e.currentTarget.dataset.eff)
    console.log('id是：' + e.currentTarget.dataset.id)
  },
  // 下一题
  xiayiti() {
    this.jiazai(parseInt(this.data.xuhao) + 1)
  },
  //对答案列表进行分页
  updatadataarr: function () {
    console.log(this.data.correctyes)
    var that = this;
    var arrayYes = this.data.correctyes.split("/")
    console.log(arrayYes)
    // let subArrayNum = 8;
    // var dataArr = new Array(Math.ceil(array.length / subArrayNum));
    // //console.log('dataArr', dataArr);
    // for (let i = 0; i < dataArr.length; i++) {
    //   dataArr[i] = new Array();
    // }
    // for (let i = 0; i < array.length; i++) {
    //   dataArr[parseInt(i / subArrayNum)][i % subArrayNum] = that.data.arr[i];
    // }
    that.setData({
      dataArr: arrayYes,
      correctyes: arrayYes,
      len: arrayYes.length
    })
    console.log(this.data.dataArr);
  },

  //对象转数组
  objToArray: function (array) {
    var arr = []
    for (var i in array) {
      arr.push(array[i]);
    }
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].replace(/'/, "%27")
    }
    console.log(arr);
    return arr;
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    innerAudioContext.src = this.data.exercises.music;
    innerAudioContext.play();
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
      imageUrl: 'http://img.tutukids.com/group1/M00/00/0A/转发海报.png',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})