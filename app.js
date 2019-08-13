//app.js
App({

  /* 当小程序初始化完成时，会触发 onLaunch（全局只触发一次） */

  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '发现新版本',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }

    this.Promise = this.getUserInfo();
  },

  getUserInfo: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      // 调用登录接口
      wx.login({
        success: function (res) {
          console.log('[LOGIN]',res);
          if (res.code) {
            that.globalData.jscode = res.code;
            setTimeout(function () {
              resolve(res);
            }, 1000);
            //调用登录接口
           /* wx.getUserInfo({
              withCredentials: true,
              success: function (res1) {
                that.globalData.userInfo = res1.userInfo;
                console.log('[getUserInfo]',res1.userInfo);
                resolve(res1);
                setTimeout(function () {
                  resolve(res1);
                }, 1000);
              }
            })*/
          } else {
            console.log('获取用户登录态失败！' + res.errMsg);
            var res = {
              status: 300,
              data: '错误'
            }
            reject('error');
          }
        }
      })
    });

  },

  /**
     * 设置全局变量
     */
  globalData: {
    UserRes: null,
    jscode: null,
    userInfo: null,
    JSESSIONID: null,
    code2v: null
  }
})