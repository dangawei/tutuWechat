
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
    console.log('ppp')
    console.log(app)
    var that = this

    that.setData({
      card_id: e.card_id,
      number: e.number,
    })
    that.jiazai(1)
    //修改顶部背景颜色
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f5ede2'
    })
    //音频播放结束后
    innerAudioContext.onEnded((res) => {

      console.log('触发')
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
  console.log(1)


 

  console.log(app)
 
  //判断上一页是否显示
  if (parseInt(xuhao) !== 1) {
    this.setData({
      shangyiye: true
    })
  }else{
    this.setData({
      shangyiye: false
    })
  }

  // 判断是否传过来题的序号

  //判断下一页是否显示
  if (parseInt(xuhao) < parseInt(that.data.number)) {
    this.setData({
      xiayiye: true,
      wancheng:false,
      xuhao: xuhao,
    })

   
  } else {

   
    this.setData({
      wancheng: true,
      xiayiye:false,
      xuhao: parseInt(that.data.number)
    })
  }

  that.huoqu(xuhao)

},

//获取数据
huoqu:function (xuhao)
{

  var that = this;
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

          //所有文字
          all_text: res.data.data.title_sentence,
          //整段话录音文件
          video: encodeURI(res.data.data.title_voice)
        })
   
         var arr = Object.keys(that.data.all_text);
        //  计算出长度
         var len = arr.length;
       

        //所有图片
        var all_img = res.data.data.question_content_images
        //所有播放文件
        var all_video = res.data.data.question_content_image_voices

        //处理传过来的数据
        var all_img = that.all_img(all_img)
        var all_video = that.all_video(all_video)

        //赋值
        that.setData({
          all_img: all_img,
          all_video: all_video,
          all_text_len: len
        })
       
       
        // 默认进来放一次音乐
        innerAudioContext.src = that.data.video;
         
        innerAudioContext.play();
      

        //判断是否需要获取下一题
        

      } else {
        //返回数据失败
        // app.tanchuang('获取题错误！')
        console.log(res.data)
      }
    }
  })
},

//根据获取过来的类型做处理
  all_img: function (all_img)
  {

    //循环赋值
    var data = []
    var xia = 0
    for (var i in all_img) {
      data[xia] = new Object();
      data[xia].img_path = all_img[i].replace(/'/, "%27")
      data[xia].id = i
      data[xia].eff = 0
      xia++;
    }
    return data;

  },

  all_video:function (all_video)
  {
    //循环转码
    for (var i in all_video) {
      all_video[i] = encodeURI(all_video[i])
    }

    return all_video;
   
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
    console.log('ha')
    console.log(event)
    var that = this
    this.data.currentGesture = 0;
    console.log(this.data.text)

    if(that.data.text == 'zuo')
    {
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
    console.log(arr);
    return arr;
  },


  // 点击单个图片播放音乐
  singelClick: function (e) {
    innerAudioContext.src='';
  
    var that = this

    //停止播放之前的音乐     防止两重音
    innerAudioContext.stop();
    if (e.currentTarget.dataset.all == 0) {

      for(var i in that.data.all_video)
      {
        if (i == e.currentTarget.dataset.id)
        {
          var xia = i
        }
      }

      console.log('ce')
      console.log(xia)
      //播放某个图片下的音频文件
      innerAudioContext.src = that.data.all_video[xia];
      that.setData({
        clickmusic: xia
      })
    } else {

      console.log('bofang')
      console.log(that.data)
      //播放整句话的音频文件
      innerAudioContext.src = that.data.video;
      //清空绿色显示
      that.setData({
        clickmusic: -1
      })
    }
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

    if (parseInt(that.data.xuhao) == parseInt(that.data.number))
    {
      //发送后台增加分数
      wx.request({
        url: http_host + 'setcardscore',
        data: {
          //从app中取出用户数据
          token: app.user.token,
          uid: app.user.uid,
          card_id: that.data.card_id,
          // 分数
          card_score: 100,
          // 是否解锁下一关    1解锁  0不解锁
          is_completed: 1

        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          wx.redirectTo({
            url: "/pages/gameresult/gameresult?fenshu=100"
          })
        }
      })

    }else{
    // console.log(that)
    // return;

      that.jiazai(parseInt(that.data.xuhao) + 1)
    // wx.redirectTo({
    //   url: "/pages/levelone/levelone?card_id=" + this.options.card_id + "&number=" + this.options.number + "&xuhao=" + xuhao
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
    innerAudioContext.stop();
    
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