const util = require("../../utils/config.js");

const app = getApp()
const http_host = util.http_host;
const img_url = util.img_url;
const innerAudioContext = wx.createInnerAudioContext();
innerAudioContext.autoplay = true;
innerAudioContext.obeyMuteSwitch = false;
innerAudioContext.onError((res) => {
  console.log(res.errMsg)
  console.log(res.errCode)
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
    xuhao: 1,
    currentGesture: 0, //标识手势

  },

  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (e) {

    var that = this

    //给当前关卡数 和 总关卡数  赋值
    this.setData({
      // 关卡ID
      card_id:e.card_id,
      // 题数
      number: e.number,
     
    })


    // 加载数据
    that.jiazai(1)

    wx.setNavigationBarColor({

      frontColor: '#000000',

      backgroundColor: '#f5ede2'

    })

    var title = "0" + (app.partList.xia + 1) + " " + app.card.name
    //修改标题为关卡名称
    wx.setNavigationBarTitle({
      title: title//页面标题为路由参数
    })
  },

  // 加载数据
  jiazai:function (xuhao)
  {
    

    var that = this;

    if (parseInt(xuhao) == parseInt(that.data.number)){
      this.setData({
        xiayiti:false
      })
    }

    if (parseInt(xuhao) < parseInt(that.data.number)) {
      this.setData({
   
        xuhao: xuhao,
      })


    } else {


      this.setData({
       
        xuhao: parseInt(that.data.number)
      })
    }


    this.setData({
      stop:0,
      clicking: 0,
      errorborder: -1,
      cuo_number:0
    })
    // 按钮显示
    if (that.data.number > xuhao) {
      this.setData({
        xiayiti: true
      })
    } else {
   
      this.setData({
        wancheng: true
      })
    }

   
    //当前
    wx.request({
      url: http_host + 'getquestion',
      data: {
        //从app中取出用户数据
        token: app.user.token,
        uid: app.user.uid,
        card_id: that.data.card_id,
        //当前题的序号  
        question_sequence: xuhao
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // 判断是否正确传回数据
        console.log(2)
        console.log(res)
        if (res.data.code == 0) {

          that.setData({
            //所有数据  方便以后调用
            all: res.data.data,
           
            //正确的图片
            yes: res.data.data.question_answer,
            //录音文件
            video: encodeURI(res.data.data.question_title_voice).replace(/'/, "%27"),

          })

          var all_img =  res.data.data.question_content_images
           


          var data = []
          var xia = 0
          for (var i in all_img) {


            data[xia] = new Object();
            data[xia].img = all_img[i].replace(/'/, "%27")

            data[xia].id = i
            data[xia].green = 0
            data[xia].red = 0
            xia++;

          }

          that.setData({
            data: data
          })
          innerAudioContext.stop();
          innerAudioContext.obeyMuteSwitch = false;
          // 默认进来放一次音乐
          innerAudioContext.src = that.data.video;
          innerAudioContext.play();

        } else {
          //返回数据失败
          // app.tanchuang('获取题错误！')
          console.log(res.data)
        }
      }
    })

  },





  singelClick: function (e) {

    
    innerAudioContext.stop();
    var that = this;

    if(that.data.stop == 1)
    {
      console.log('ting')
      return;
    }else{

    this.setData({
      stop:1
    })
    }
    console.log(1)
    console.log(e)
    console.log(that.data)

    for(var i = 0; i < that.data.data.length; i++)
    {
      if (that.data.data[i].id == e.currentTarget.dataset.id)
      {
        var xia = i
        break; 
      }
    }
    // 判断是否正确
    if (this.data.yes == e.currentTarget.dataset.id) {
      //停止播放之前音乐文件   防止两重音
      innerAudioContext.stop();
      innerAudioContext.src = 'https://www.chengxuyuantoutiao.com/a/sound/ding.mp3';

      var up = "data[" + xia + "].green";
      that.setData({
        //绿色  下标的值
        [up]: 1,
        //分数加20
        score: parseInt(this.data.score) + 20,
        errornum: that.data.errornum + 1,
        clicking:1,
       
      })

      console.log(2)
      console.log(that.data)
     
      if (parseInt(that.data.xuhao) == parseInt(that.data.number))
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
      innerAudioContext.stop()
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

      var up = "data[" + xia + "].red";
    console.log('ce')
    console.log(that.data)
     

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

      console.log('播放错误音频')
      console.log(that.data.data[xia].red)

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
  wancheng:function ()
  {

    var that = this
  

    //发送后台增加分数
    wx.request({
      url: http_host + 'setcardscore',
      data: {
        //从app中取出用户数据
        token: app.user.token,
        uid: app.user.uid,
        card_id: that.data.card_id,
        // 分数
        card_score: that.data.score,
        // 是否解锁下一关    1解锁  0不解锁
        is_completed: 1

      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {

        if (res.data.code == 0) {
        
          wx.redirectTo({
            url: "/pages/gameresult/gameresult?fenshu=" + parseInt(that.data.score)
          })
          that.setData({
            stop: 0,
          })

        }else{
          console.log('budui')
        }
      }
    })
   
  },
//通关跳转页面
tongguan:function ()
{
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
  xiayiti:function ()
  {
    this.jiazai(parseInt(this.data.xuhao) + 1)
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
    innerAudioContext.src = this.data.video;
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