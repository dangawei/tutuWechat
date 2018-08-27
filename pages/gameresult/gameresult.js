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
      'https://www.chengxuyuantoutiao.com/a/centerbgexcellent.png',
      "https://www.chengxuyuantoutiao.com/a/centerbggood.png",
      "https://www.chengxuyuantoutiao.com/a/centerbggood.png",
      'https://www.chengxuyuantoutiao.com/a/centerbgbad.png',
    ],
    typeimg: [
      'https://www.chengxuyuantoutiao.com/a/exelent.png',
      'https://www.chengxuyuantoutiao.com/a/good.png',
      'https://www.chengxuyuantoutiao.com/a/notbad.png',
      'https://www.chengxuyuantoutiao.com/a/bad.png',
    ],
    musicsrc: [
      'https://www.chengxuyuantoutiao.com/a/sound/perfect.mp3',
      'https://www.chengxuyuantoutiao.com/a/sound/good.mp3',
      'https://www.chengxuyuantoutiao.com/a/sound/good.mp3',
      'https://www.chengxuyuantoutiao.com/a/sound/comeonletstryagain_1.mp3',
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {



    var that = this

    this.setData({
      xuhao: app.partList.xia + 1,
      username: app.globalData.userInfo.nickName,
      user_img: app.globalData.userInfo.avatarUrl,
      socre:options.fenshu,
      unit_name: app.unit.name,
      part_name:app.part.name,
      card_name:app.card.name,
      type:app.card.type
    })

    var title = "0" + that.data.xuhao +" "+ app.card.name

    wx.setNavigationBarTitle({
      title: title
    })

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

    innerAudioContext.src = this.data.musicsrc[this.data.types]
    innerAudioContext.play();
    var that = this
    console.log(3)
    console.log(app.globalData.userInfo.avatarUrl)
    // app.globalData.userInfo.avatarUrl
    // 头像换成本地路径
    wx.getImageInfo({
      src: app.globalData.userInfo.avatarUrl,
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
      src: 'https://www.chengxuyuantoutiao.com/a/bg.png',
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
      src: 'https://www.chengxuyuantoutiao.com/a/yellowcircle.png',
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
    // https://www.chengxuyuantoutiao.com/a/logoposter.png
    wx.getImageInfo({
      src: 'https://www.chengxuyuantoutiao.com/a/logoposter.png',
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
      src: 'https://www.chengxuyuantoutiao.com/a/gameresultbg.png',
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
      src: 'https://www.chengxuyuantoutiao.com/a/minderweima.png',
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
      src: 'https://www.chengxuyuantoutiao.com/a/gameresultnext.png',
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
  xiayiguan:function ()
  {
   

  if(this.data.stops == 1)
  {
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
      // 找出当前点击题型的下一个题型
      for (var i in app.partList.arr) {
 
        if (stop == 1) {
          app.card.id = app.partList.arr[i].id

          var next_pass = app.partList.arr[i]
         
          break;
        }
        if (app.card.id == app.partList.arr[i].id) {
          stop = 1
        }
      }

      console.log(next_pass)

      app.partList.xia = next_pass.xia
     

      //循环出下一题的连接
      // 判断题型属于哪个页面
      switch (next_pass.card_type) {
        case 1:
          var next_url = 'levelone/levelone?card_id=' + next_pass.id + '&number=' + next_pass.contain_question_number + '&xuhao=1'

          break;
        case 2:
          var next_url = 'leveltwo/leveltwo?card_id=' + next_pass.id + '&number=' + next_pass.contain_question_number + '&xuhao=1'
          break;
        case 3:
          var next_url = 'levelthree/levelthree?card_id=' + next_pass.id + '&number=' + next_pass.contain_question_number + '&xuhao=1'
          break;
        case 4:
          var next_url = 'levelfour/levelfour?card_id=' + next_pass.id + '&number=' + next_pass.contain_question_number + '&xuhao=1'
          break;
        case 5:
          var next_url = 'levelfive/levelfive?card_id=' + next_pass.id + '&number=' + next_pass.contain_question_number + '&xuhao=1'
          break;
        default:
        // 所有不符合条件执行代码

      }

      //将下一题的连接存入app中  在用户通关后 点击下一关会取出
      app.next_pass.url = next_url
      app.again.url = next_url

      app.card.id = next_pass.id

      app.card.name = next_pass.card_name

      app.card.type = next_pass.card_type
      wx.redirectTo({
        url: "/pages/" + app.next_pass.url
      })
    }else{
      wx.redirectTo({
        url: "/pages/" + app.next_pass.url
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
 
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
    var that = this
    console.log(that.data.socre)
    return {
      title: app.globalData.userInfo.nickName + '  在图图英语闯关获得了' + that.data.socre+'分！你敢和我挑战吗？',
      desc: '转发描述',
      path: '/pages/index/index',
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