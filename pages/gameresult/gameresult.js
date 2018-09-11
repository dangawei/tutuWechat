const util = require("../../utils/config.js");

const app = getApp()
const http_host = util.http_host;
const img_url = util.img_url;
const innerAudioContext = wx.createInnerAudioContext();
innerAudioContext.autoplay = true;
innerAudioContext.onError((res) => {
 
})
//index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stops:0,
    // types:0是优秀 1是良好 2是及格 3是不及格
    types: -1,
    username: "",
    socre: 0,
    imagesrc: '',
    showDialogposter: false,
    headimgurl_path:'',
    codebtnimgurl_path:'',
    honor_path:'',
    score_path:'',
    typecenterbgimg: [
      'http://img.tutukids.com/group1/M00/00/0A/centerbgexcellent.png',
      "http://img.tutukids.com/group1/M00/00/0A/centerbggood.png",
      "http://img.tutukids.com/group1/M00/00/0A/centerbggood.png",
      'http://img.tutukids.com/group1/M00/00/0A/centerbgbad.png',
    ],
    typeimg: [
      'http://img.tutukids.com/group1/M00/00/0A/exelent.png',
      'http://img.tutukids.com/group1/M00/00/0A/good.png',
      'http://img.tutukids.com/group1/M00/00/0A/notbad.png',
      'http://img.tutukids.com/group1/M00/00/0A/bad.png',
    ],
    musicsrc: [
      'http://img.tutukids.com/group1/M00/00/0A/sound/perfect.mp3',
      'http://img.tutukids.com/group1/M00/00/0A/sound/good.mp3',
      'http://img.tutukids.com/group1/M00/00/0A/sound/good.mp3',
      'http://img.tutukids.com/group1/M00/00/0A/sound/comeonletstryagain_1.mp3',
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.card.type = options.pass
    this.setData({
      xuhao: app.partList.xia + 1,
      username: wx.getStorageSync("userInfo").realName,
      user_img: wx.getStorageSync("userInfo").icon || "http://img.tutukids.com/group1/M00/00/0A/spellcheck.png",
      socre:options.fenshu,
      unit_name: wx.getStorageSync("unitName"),
      part_name: wx.getStorageSync("partName"),
      card_name: wx.getStorageSync("title"),
      type:app.card.type,
      pass:options.pass
    })
    var title = "0" + (parseInt(that.data.pass)+1) + " " + wx.getStorageSync("title")

    wx.setNavigationBarTitle({
      title: title
    })
    console.log(options.fenshu);
    if (parseInt(options.fenshu) == 100)
    {
      var t = 0
    } else if (parseInt(options.fenshu) >= 80 && parseInt(options.fenshu) <= 99)
    {
      var t = 1
    } else if (parseInt(options.fenshu) >= 60 && parseInt(options.fenshu) <= 79)
    {
      var t = 2
    } else if (parseInt(options.fenshu) <60)
    {
      var t = 3
    }

    this.setData({
      types:t
    })
    console.log(this.data.musicsrc[this.data.types])
    innerAudioContext.src = this.data.musicsrc[this.data.types]
    innerAudioContext.play();
    var that = this
    // app.globalData.userInfo.avatarUrl
    // 头像换成本地路径
    wx.getImageInfo({
      // src: app.globalData.userInfo.avatarUrl,
      src: this.data.user_img,
      success: function (res) {
        //res.path是网络图片的本地地址
        let qrCodePath = res.path;
        that.setData({
          headimgurl_path: qrCodePath
        })
      },
      fail: function (res) {
        //失败回调
      }
    })
    // 白色矩形背景换成本地路径
    wx.getImageInfo({
      src: 'http://img.tutukids.com/group1/M00/00/0A/bg.png',
      success: function (res) {
        //res.path是网络图片的本地地址
        let qrCodePath = res.path;
        that.setData({
          whitebg_path: qrCodePath
        })
      },
      fail: function (res) {
        //失败回调
      }
    })
    // 黄色圆形背景换成本地路径
    wx.getImageInfo({
      src: 'http://img.tutukids.com/group1/M00/00/0A/yellowcircle.png',
      success: function (res) {
        //res.path是网络图片的本地地址
        let qrCodePath = res.path;
        that.setData({
          yellowcirclebg_path: qrCodePath
        })
      },
      fail: function (res) {
        //失败回调
      }
    })
    // http://img.tutukids.com/group1/M00/00/0A/logoposter.png
    wx.getImageInfo({
      src: 'http://img.tutukids.com/group1/M00/00/0A/logoposter.png',
      success: function (res) {
        //res.path是网络图片的本地地址
        let qrCodePath = res.path;
        that.setData({
          tutulogoimgurl_path: qrCodePath
        })
      },
      fail: function (res) {
        //失败回调
      }
    })
    // 海报背景换成本地路径
    wx.getImageInfo({
      src: 'http://img.tutukids.com/group1/M00/00/0A/gameresultbg.png',
      success: function (res) {
        //res.path是网络图片的本地地址
        let qrCodePath = res.path;
        that.setData({
          posterbg_path: qrCodePath
        })
      },
      fail: function (res) {
        //失败回调
      }
    })
    // 二维码换成本地路径
    wx.getImageInfo({
      src: 'http://img.tutukids.com/group1/M00/00/0A/minderweima.png',
      success: function (res) {
        //res.path是网络图片的本地地址
        let qrCodePath = res.path;
        that.setData({
          codeimgurl_path: qrCodePath
        })
      },
      fail: function (res) {
        //失败回调
      }
    })
    // 按钮背景图片换成本地路径
    wx.getImageInfo({
      src: 'http://img.tutukids.com/group1/M00/00/0A/gameresultnext.png',
      success: function (res) {
        //res.path是网络图片的本地地址
        let qrCodePath = res.path;
        that.setData({
          codebtnimgurl_path: qrCodePath
        })
      },
      fail: function (res) {
        //失败回调
      }
    })
    // 勋章换成本地图片
    wx.getImageInfo({
      src: that.data.typecenterbgimg[0],
      success: function (res) {
        //res.path是网络图片的本地地址
        let qrCodePath = res.path;
        that.setData({
          honor_path: qrCodePath
        })
      },
      fail: function (res) {
        //失败回调
      }
    })
    // 及格换成本地图片
    wx.getImageInfo({
      src: that.data.typeimg[0],
      success: function (res) {
        //res.path是网络图片的本地地址
        let qrCodePath = res.path;
        that.setData({
          score_path: qrCodePath
        })
      },
      fail: function (res) {
        //失败回调
      }
    })
  },


// 下一关
  xiayiguan:function (){
    var that=this;
    if(this.data.stops == 1){
      return;
    }else{
      this.setData({
        stops:1,
      })
    }
    var stop = 0
    // 判断类型是否等于5
    if (app.card.type != 5) {

      if (app.card.type == 4)
      {
        app.card.type = 5
      }
      var url;
      var index = parseInt(this.data.pass) + 1
      var data = wx.getStorageSync("part")
      wx.setStorageSync("customPassId", data[index].id)
      wx.setStorageSync("title", data[index].title)
      //循环出下一题的连接
      // 判断题型属于哪个页面
      switch (index) {
        case 0:
          url = 'levelzero/levelzero?bookId=' + wx.getStorageSync("bookId") + '&unitId=' + wx.getStorageSync("unitId") + '&partId=' + wx.getStorageSync("partId") + '&customPassId=' + data[index].id + '&pass=0'
          break;
        case 1:
          url = 'levelone/levelone?bookId=' + wx.getStorageSync("bookId") + '&unitId=' + wx.getStorageSync("unitId") + '&partId=' + wx.getStorageSync("partId") + '&customPassId=' + data[index].id + '&pass=1'
          break;
        case 2:
          url = 'leveltwo/leveltwo?bookId=' + wx.getStorageSync("bookId") + '&unitId=' + wx.getStorageSync("unitId") + '&partId=' + wx.getStorageSync("partId") + '&customPassId=' + data[index].id + '&pass=2'
          break;
        case 3:
          url = 'levelthree/levelthree?bookId=' + wx.getStorageSync("bookId") + '&unitId=' + wx.getStorageSync("unitId") + '&partId=' + wx.getStorageSync("partId") + '&customPassId=' + data[index].id + '&pass=3'
          break;
        case 4:
          url = 'levelfour/levelfour?bookId=' + wx.getStorageSync("bookId") + '&unitId=' + wx.getStorageSync("unitId") + '&partId=' + wx.getStorageSync("partId") + '&customPassId=' + data[index].id + '&pass=4'
          break;
        case 5:
          url = 'levelfive/levelfive?bookId=' + wx.getStorageSync("bookId") + '&unitId=' + wx.getStorageSync("unitId") + '&partId=' + wx.getStorageSync("partId") + '&customPassId=' + data[index].id + '&pass=5'
          break;
        default:
         // 所有不符合条件执行代码
          app.tanchuang('哎呀，出错了！')
      }
      //将下一题的连接存入app中  在用户通关后 点击下一关会取出
      app.next_pass.url = url
      app.again.url = url
      app.card.id = data[index].id

      app.card.name = data[index].id.title

      app.card.type = data[index].id.sort
      wx.redirectTo({
        url: "/pages/" + url
      })
    }else{
      wx.redirectTo({
        url: "/pages/" +url
      })
    }
   
  },
  //跳转页面
  tiaozhuan:function()
  {
    wx.redirectTo({
      url: "/pages/" + app.again.url
    })
  },
// 完成
  wancheng:function()
  {
    wx.redirectTo({    
      url: "/pages/partlist/partlist?id="+app.part.id+"&name="+app.part.name
    })
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
  ttt: function () {
    console.log(111);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this
    return {
      title: wx.getStorageSync("userInfo"). realName+ '  在图图英语闯关获得了' + that.data.socre+'分！你敢和我挑战吗？',
      desc: '转发描述',
      path: '/pages/login/login',
      imageUrl:'../images/转发海报.png',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //生成海报弹框 
  toggleDialogposter: function () {
    this.createNewImg();
    this.setData({
      showDialogposter: !this.data.showDialogposter,
    });
 
  },
  //点击保存到相册
  saveImgToPhotosAlbumTap: function () {
    console.log(this.data.imagesrc)
    var that = this;
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagesrc,
      success: function (res) {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
        that.setData({
          showDialogposter: false,
        });
      },
      fail: function (res) {
        wx.showToast({
          title: "失败",
          icon: 'none',
          duration: 2000
        })
      }
    })

    
  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {
    var that = this;
    //创建画布
    var context = wx.createCanvasContext('mycanvas');//选定canvas绘制对象
    context.setFillStyle("#ffd744")//设置背景色
    context.fillRect(0, 0, 750, 1334)//为画布填充一个矩形x,y=0,0 宽高为375*687
    //创建画布结束

 
    var path1 = that.data.posterbg_path//图片地址
    context.drawImage(path1, 0, 895, 750, 449);//绘画的图片位置和大小x,y=0,0  w,h=175,95
    //结束自定义图片绘入画布
    // 海报的图图的logo
    var path2 = that.data.tutulogoimgurl_path//图片地址
    context.drawImage(path2, 20, 10, 133, 72);//绘画的图片位置和大小x,y=0,0  w,h=175,95
    //结束自定义图片绘入画布


    //开始自定义文字绘入画布
    //多次应用本块代码可实现将自定义文字绘入画布进行布局
    //将自定义文字绘入画布
    var name = '小 / 学 / 英 / 语 / 趣 / 味 / 练 / 习';
    //绘制名字
    context.setFontSize(26);          //字体大小
    context.setFillStyle('#31669a');  //字体颜色
    context.setTextAlign('left');   //对齐方式（左对齐，右对齐，居中）
    context.fillText(name, 295, 66); //根据坐标将文字绘入画布 x,y=185,340
    context.stroke();                 //绘画边框（作用未知）
    //结束

    //开始自定义文字绘入画布
    //将自定义文字绘入画布
    var name = '敢来挑战我吗？';
    //绘制名字
    context.setFontSize(60);          //字体大小
    context.setFillStyle('#333');  //字体颜色
    context.setTextAlign('center');   //对齐方式（左对齐，右对齐，居中）
    context.fillText(name, 375, 184); //根据坐标将文字绘入画布 
    context.stroke();                 //绘画边框（作用未知）
    //结束

    //矩形圆角框
    context.beginPath()
    context.moveTo(65, 204);
    context.lineTo(685, 204);
    context.arc(685, 239, 35, 1.5 * Math.PI, 0.5 * Math.PI);
    context.lineTo(65, 274);
    context.arc(65, 239, 35, 0.5 * Math.PI, 1.5 * Math.PI);
    context.closePath()
    context.stroke();

    //绘制决高下
    context.setFontSize(34);          //字体大小
    context.setFillStyle('#333');  //字体颜色
    context.setTextAlign('center');   //对齐方式（左对齐，右对齐，居中）
    context.fillText("长按二维码进入闯关，我们一决高下！", 375, 251); //根据坐标将文字绘入画布 
    context.stroke();                 //绘画边框（作用未知）

    //矩形内容框
    context.beginPath()
    context.setFillStyle("#fff");
    context.setStrokeStyle("#fff");
    context.moveTo(40, 398);
    // context.lineTo(285, 398);
    // context.arc(375, 398, 90, 1 * Math.PI, 0 * Math.PI, true);
    // context.lineTo(710, 398);
    // context.arc(710, 408, 10, 1.5 * Math.PI, 0 * Math.PI, true);
    // context.lineTo(720, 1048);
    // context.arc(710, 1048, 10, 0 * Math.PI, 0.5 * Math.PI);
    // context.lineTo(40, 1058);
    // context.arc(40, 1048, 10, 0.5 * Math.PI, 1 * Math.PI);
    // context.lineTo(30, 408);
    // context.arc(40, 408, 10, 1 * Math.PI, 1.5 * Math.PI);
    // context.closePath()
    context.fill();

    //结束自定义图片绘入画布
    //绘入白色矩形
    var path10 = that.data.whitebg_path//图片地址
    context.drawImage(path10, 30, 400, 690, 680);//绘画的图片位置和大小x,y=0,0 w,h=175,95
    // context.drawImage(path10, 30, 400, 690, 800);
    //绘入黄色圆形背景
    var path9 = that.data.yellowcirclebg_path//图片地址
    context.drawImage(path9, 286, 309, 178, 178);//绘画的图片位置和大小x,y=0,0 w,h=175,95
    

    
    //结束自定义图片绘入画布

    //绘制恭喜
    context.setFontSize(38);          //字体大小
    context.setFillStyle('#333');  //字体颜色
    context.setTextAlign('center');   //对齐方式（左对齐，右对齐，居中）

    var kong = ''
    for (var i = 0; i < this.data.username.length; i++)
    {
      kong = kong + '　'
    }

    if (this.data.socre >= 60){
      var socre = '闯关成功'
    }else{
      var socre = '闯关结束'
    }
    context.fillText( kong + socre , 375, 543); //根据坐标将文字绘入画布 

    //绘制玩家名字
    context.setFontSize(38);          //字体大小
    context.setFillStyle('#ffa126');  //字体颜色
    context.setTextAlign('center');   //对齐方式（左对齐，右对齐，居中）
    context.fillText(this.data.username, 330, 543); //根据坐标将文字绘入画布 
   

    //绘入奖章
    var path4 = that.data.honor_path//图片地址
    context.drawImage(path4, 108, 580, 514, 265);//绘画的图片位置和大小x,y=0,0  w,h=175,95
    //结束自定义图片绘入画布

    //绘制得分
    context.setFontSize(60);          //字体大小
    context.setFillStyle('#09ce31');  //字体颜色
    context.setTextAlign('center');   //对齐方式（左对齐，右对齐，居中）
    context.fillText("得分 " + this.data.socre, 375, 920); //根据坐标将文字绘入画布 
    context.stroke();                 //绘画边框（作用未知）

    //绘制当前位置
    context.setFontSize(28);          //字体大小
    context.setFillStyle('#333333');  //字体颜色
    context.setTextAlign('center');   //对齐方式（左对齐，右对齐，居中）
    var jv = app.book.name + " > " + app.unit.name + " > " + app.card.name
    context.fillText(jv, 375, 980); //根据坐标将文字绘入画布 
    context.stroke();   

    //绘入长按二维码文字背景
    var path5 = that.data.codebtnimgurl_path;//图片地址
    context.drawImage(path5, 150, 1009, 449, 98);//绘画的图片位置和大小x,y=0,0  w,h=175,95
    //结束自定义图片绘入画布

    //绘制长按二维码文字
    context.setFontSize(32);          //字体大小
    context.setFillStyle('#333');  //字体颜色
    context.setTextAlign('center');   //对齐方式（左对齐，右对齐，居中）
    context.fillText("长按二维码一起来闯关吧", 375, 1070); //根据坐标将文字绘入画布 
              
    //绘入评价等级
    var path3 = that.data.score_path//图片地址
    context.drawImage(path3, 590, 388, 140, 140);//绘画的图片位置和大小x,y=0,0  w,h=175,95

    //二维码图片
    var path6 = that.data.codeimgurl_path;//图片地址
    context.drawImage(path6, 300, 1139, 150, 150);//绘画的图片位置和大小x,y=0,0  w,h=175,95
    //二维码图片绘入画布 

    //开始绘画头像
    //此处用来绘画头像，务必放在最后操作，裁剪后将只能在裁剪区域内操作
    //绘制头像
    var path7 = that.data.headimgurl_path;//头像地址
    context.arc(375, 398, 87, 0, 2 * Math.PI) //画出圆(x,y,半径,起始弧度,终止弧度)
    context.strokeStyle = "#ffd744";
    context.clip(); //裁剪上面的圆形(裁剪之后将只能在裁剪区域内操作)
    context.drawImage(path7, 288, 311, 174, 174); // 在刚刚裁剪的园上画图（头像）
    context.draw();
    //结束始绘画头像


    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          // console.log(res)
          var tempFilePath = res.tempFilePath;
          console.log(tempFilePath)//此为生成出来的图片地址 运用图片保存api（saveImageToPhotosAlbum）可以将海报保存至本地
          that.setData({
            imagesrc: tempFilePath
          });
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }, 200);
  },
})