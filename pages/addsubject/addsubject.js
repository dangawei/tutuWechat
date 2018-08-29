const util = require("../../utils/config.js");

const app = getApp()
const http_host = util.http_host;
const img_url = util.img_url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //激活状态
    tag_active: 0,
    //分类总数0开始
    allnum: 3,
    //移动方向
    movefx: 1,
    tocheY: 0,
    grades: [1, 2, 3]

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log(e)
    this.setData({
      book_id:e.book_id
    })
    var that = this
    for (var i = 0; i < this.data.allnum; i++) {
      wx.createIntersectionObserver().relativeToViewport().observe('#dataindex' + i, (res) => {
       
        if (this.data.movefx == 0) {
          if (this.data.tag_active < this.data.allnum) {
            this.setData({
              tag_active: this.data.tag_active + 1
            })
          }

        } else if (this.data.movefx == 1) {
          if (this.data.tag_active > 0) {
            this.setData({
              tag_active: this.data.tag_active - 1
            })
          }
        }
      })
    }
    // var a = { "code": 0, "data": { "groupBooks": [{ "grade": 1, "books": [{ "id": "123", "book_cover_url": "http://www.tutukids.com/人教版/三年年级上_3/1_unit/1_part/1_听音看图学习/1_question_1/2_content_image_3.jpeg", "book_name": "人教版三年年级上", "book_publish_company": "人教版", "book_grade": 1, "contain_unit_number": 8 }, { "id": "456", "book_cover_url": "", "book_name": "人教版三年年级下", "book_publish_company": "人教版", "book_grade": 1, "contain_unit_number": 8 }] }, { "grade": 2, "books": [{ "id": "223", "book_cover_url": "http://www.tutukids.com/人教版/三年年级上_3/2_unit/2_part/2_听音看图学习/2_question_2/2_content_image_3.jpeg", "book_name": "人教版三年年级上", "book_publish_company": "人教版", "book_grade": 2, "contain_unit_number": 8 }, { "id": "456", "book_cover_url": "", "book_name": "人教版三年年级下", "book_publish_company": "人教版", "book_grade": 2, "contain_unit_number": 8 }] }], "grades": [1, 2, 3] }, "errMsg": "success" }
 
    // that.setData({
    

    //   groupBooks: a.data.groupBooks
    // })

    
 
    // 逻辑层

    //获取所有教材
    wx.request({
      url: http_host + '/user/choose/bookVersion/' + wx.getStorageSync('basicInfo').bookVersionId,
      data: {
        bookVersionId: wx.getStorageSync('basicInfo').bookVersionId
      },
      header: {
        'token': wx.getStorageSync('basicInfo').token,
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // 判断是否正确传回数据
        if(res.data.code == 0)
        {
          that.setData({
            //数据
            groupBooks: res.data.data.groupBooks
          })

          console.log(2)
          console.log(that.data.groupBooks)

        }else{
          //返回数据失败
          app.tanchuang('获取数据错误！')
        }
      }
    })

  },

  //添加到个人教材中
  add:function (e)
  { 

    // console.log(e)
    // return;

    // wx.navigateTo({
    //   url: '/pages/afterindex/afterindex?id=' + e.currentTarget.dataset.id
    // })

    // return;
    //发送后台添加
    wx.request({
      url: http_host + 'addbook',
      data: {
        //从app中取出用户数据
        token: app.user.token,
        uid: app.user.uid,
        book_id: e.currentTarget.dataset.id
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        
        // 判断是否正确传回数据
        if (res.data.code == 0) {
          wx.navigateTo({
            url: '/pages/afterindex/afterindex?id=' + e.currentTarget.dataset.id
          })

        } else {
          //返回数据失败
          app.tanchuang('添加数据错误！')
        }
      }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: app.globalData.userInfo.nickName + '  邀请你来闯关啦~图图小学英语课后趣味练习！',
      desc: '转发描述',
      path: '/pages/index/index',
      imageUrl:"http://tutu-resource-base.test.upcdn.net/a/%E8%BD%AC%E5%8F%91%E6%B5%B7%E6%8A%A5.png",
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  //页面内跳转到指定教材处
  selectdataindex: function (event) {
    this.setData({
      movefx: 2
    })
    var height = 0;
    var index = parseInt(event.target.dataset.index);
    var query = wx.createSelectorQuery()
    for (var i = 0; i < index; i++) {
      var thisid = '#dataindex' + i;
      query.select(thisid).boundingClientRect(function (res) {
        height = height + res.height;
      });
    }
    if (index == 0) {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      })
    } else {
      query.exec(function () {
      
        wx.pageScrollTo({
          scrollTop: height,
          duration: 0
        })
      })
    }
    this.setData({
      tag_active: index
    });


  },
  touchdataindex: function (e) {
    if (e.touches[0].clientY < this.data.tocheY) {
      this.setData({
        movefx: 0
      })
    } else {
      this.setData({
        movefx: 1
      })
    }
    this.setData({
      tocheY: e.touches[0].clientY
    })
  }
})

