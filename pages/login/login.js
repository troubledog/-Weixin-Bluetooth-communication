// login.js
Page({
  /**
   * 页面的初始数据
   */
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
        let windowHeight = (res.windowHeight * (750 / res.windowWidth)); //将高度乘以换算后的该设备的rpx与px的比例

        console.log(windowHeight) //最后获得转化后得rpx单位的窗口高度
      }
    })
  
    var that = this;
    // 查看是否授权 
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              console.log(res.userInfo)
            }
          })
        }
      }
    })

  },

  //绑定 / 解绑 按钮动作
  bindGetUserInfo: function (e) {
    var that = this;
    var app = getApp();
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    console.log(app);
    console.log(e.detail.userInfo);
    console.log(e.detail.rawData);
    while(that.data.redo) {
      that.setData({
        redo: false
      })
    /*if (that.data.account.length === 0) {
      wx.showToast({
        title: '手机号空',
        icon: 'warn',
        duration: 2000
      })
    } else if (!myreg.test(that.data.account)) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'warn',
        duration: 2000
      })
    } else if (that.data.identify.length != 6){
      wx.showToast({
        title: '验证码错误',
        icon: 'warn',
        duration: 2000
      })
    }else*/ {
      if (e.detail.userInfo) { //用户按了允许授权按钮
  
        var tradeContent = {
          Txcode: 'W1',
          Phone: '',
          JSCode: '',
          VerifyCode:''
        };
        app.getUserInfo().then(function (res) { //promise 用法有点问题
          tradeContent.JSCode = res.code;
        })
        //W1  绑定手机号码
        tradeContent.JSCode = app.globalData.jscode;
        tradeContent.VerifyCode = that.data.identify;
        tradeContent.Phone = that.data.account;
        wx.request({
          url: 'https://www.xcre.net/FromWeiXin/DataUP',
          data: JSON.stringify(tradeContent),
          header: {  //'x-www-form-urlencoded'
            'content-type': 'application/json'
          },
          method: 'POST',
          success: function (res) {
            console.log(res);
            if (res.statusCode === 200) { 
              switch(res.data.state) {
                case 1:   //绑定成功    //要定义返回码的含义：成功，已绑定，手机号码未注册，失败
                  wx.setStorageSync('JSESSIONID', res.data.data.SessionID); // 保存服务器分配的 SessionID 在本地
                  wx.showToast({
                    title: '绑定成功',
                    icon: 'success',
                    duration: 2000
                  })
                  setTimeout(function () {
                    wx.switchTab({
                      url: '/pages/index/index'   //绑定成功自动跳到二维码界面
                    })
                  }, 2000);
                  break;
                case 8:
                  that.setData({
                    redo: true
                  })
                  break;
                default: 
                  wx.setStorageSync('JSESSIONID', ''); // 保存服务器分配的 SessionID 在本地  
                  wx.showModal({
                    title: '提示',
                    content: res.data.message+'\r\n',
                    showCancel: false,
                    confirmText: '知道了'
                  })
              }
            } else {
              //that.handleError('手机号/验证码有误');
              wx.showModal({
                title: '提示',
                content:  '网络似乎不太稳定......\r\n别急，再试一次！',
                showCancel: false,
                confirmText: '知道了'
              })
            }
          },
          fail: function (res) {
            console.log(res);
            //that.handleError('绑定/解绑出错');
            wx.showToast({
              title: '绑定/解绑出错',
              icon: 'warn',
              duration: 2000
            })
            
          }
        })   
        //授权成功后，跳转进入小程序首页
        /*wx.switchTab({
          url: '/pages/index/index'
        })*/
      } else {
        //用户按了拒绝按钮
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
          showCancel: false,
          confirmText: '返回授权',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击了“返回授权”')
            }
          }
        })
      }
    } 
    } //while
  },

  phoneInput: function (e) {
    this.setData({
      account: e.detail.value
    })
  },
  identifyInput: function (e) {
    this.setData({
      identify: e.detail.value
    })
  },
/*
  transformRequest: function (obj) {
    var str = [];
    
    for (var p in obj)
      str.push('"'+encodeURIComponent(p) + '"' + ":" + '"' + encodeURIComponent(obj[p]) + '"');
    return str.join(",");
  },
*/
  handleError: function(errorMsg){
    wx.showToast({
      title: errorMsg,
      icon: 'warn',
      duration: 2000
    })
  },

  identifySMS:function(){
    var _this = this;
    var postContent = {
      Txcode: 'W0',
      Phone: _this.data.account
    };

    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;

    if (_this.data.account.length === 0 ) {
      wx.showToast({
        title: '手机号空',
        icon: 'warn',
        duration: 2000
      })
    } else if (!myreg.test(this.data.account)) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'warn',
        duration: 2000
      })
    } else {
      wx.request({
        url: 'https://www.xcre.net/FromWeiXin/DataUP', 
        data: JSON.stringify(postContent),
        header: {  
          'content-type': 'application/json'
        },
        method: 'POST',
        success: function (res) { 
          console.log(res);
 /********* */
          _this.setData({
            num: 61
          })
          var timer = setInterval(function () {
            _this.data.num--;
            if (_this.data.num <= 0) {
              clearInterval(timer);
              _this.setData({
                codename: '获取短信验证码',
                disabled: false
              })

            } else {
              _this.setData({
                codename: "重新获取验证码(" + _this.data.num + "s)"
              })
            }
          }, 1000)
/***** */
          if (res.statusCode === 200) { 
            //短信发送成功提示
            //1、已经绑定手机号，无需绑定，需要解绑吗？
            //2、请及时查验手机短消息，若没有收到，60秒后可重新获取

            switch (res.data.state) {
              case 1:
                wx.showToast({
                  title: '验证码已发送',
                  icon: 'success',
                  duration: 2000
                })
                break;
              case 3:
              case 4:
                _this.setData({  //中止验证码倒计时
                  num: 0
                })
                //break;
              default:
                wx.showModal({
                  title: '提示',
                  content: res.data.message + '\r\n',
                  showCancel: false,
                  confirmText: '知道了'
                })
             }
          } else {
            _this.handleError('检查网络状况，再试一次');
          }

        },
        fail: function (res) {
          console.log(res);
          _this.handleError('验证码请求错误');
        }
      })
      
      _this.setData({
        disabled: true
      })

    }  //else
  }

})

/**
 * 

  login: function () {
    var that = this;

    var postContent = {
      loginParam: that.data.account,
      identify: that.data.identify
    };

    if (that.data.account.length === 0 || that.data.identify.length === 0) {
      wx.showToast({
        title: '手机号或验证码空',
        icon: 'loading',
        duration: 2000
      })
    } else {
      wx.request({
        url: 'https://www.xcre.net/FromWeiXin/DataUP',
        // JSON.stringify(postContent),
        data:  '{'+that.transformRequest(postContent) + '}',
        header: {  //'application/json'
          'content-type': 'application/json'
        },
        method: 'POST',
        success: function (res) {         //appid       wxab84bab99e287da5
          console.log(res);
          if (res.statusCode === 200) {   //appsecret   25400bcb2cc74a2276ffd782c3fb5057
            wx.setStorageSync('JSESSIONID', res.data.sessionId); //登陆服务器成功，保存sessionID 在本地
            wx.switchTab({
              url: '/pages/index/index'
            })
          }else{
            that.handleError('用户名或密码错误');
          }
        },
        fail: function (res) {
          console.log(res);
          that.handleError('请求错误');
        }
      })
    }
  },
 */