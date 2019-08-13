// me.js
Page({
  data: {
    account: '',
    identify: '',
    codename: '获取短信验证码',
    num: 0,
    redo: true,
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function (options) {
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight) // 获取可使用窗口高度
        //将高度乘以换算后的该设备的rpx与px的比例

        let windowHeight = (res.windowHeight * (750 / res.windowWidth)); 
        console.log(windowHeight) //最后获得转化后得rpx单位的窗口高度
      }
    })
  
 /*   var that = this;
    // 查看是否授权 
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
         // wx.getUserInfo({
          //  success: function (res) {
              //从数据库获取用户信息
            ////  that.queryUsreInfo();
              //用户已经授权过
            ////  wx.switchTab({
                ////url: '/pages/index/index'
            ////  }) 
          //  }
         // }); //getuserinfo 
        }
      }
    })*/

  },

  //我的个人信息
  meInfo: function (e) {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },


  meHistory:function(){
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },


  meApply: function(){
    wx.navigateTo({
      url: '/pages/apply/apply'
    })
  }
})