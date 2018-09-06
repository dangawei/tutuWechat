
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exercise: 1,
    mind: 0,

  },
  exercise: function () {
    var that = this;
    that.setData({
      exercise: 0,
      mind: 1,
    })
  },
  mind: function () {
    var that = this;
    that.setData({
      exercise: 1,
      mind: 0,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarColor({

      frontColor: '#000000',

      backgroundColor: '#f7f7f7'

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

  },
  copy: function (e) {
    console.log(e);
    var self = this;
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        // self.setData({copyTip:true}),
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 1500
        });
      }
    });
  }
})