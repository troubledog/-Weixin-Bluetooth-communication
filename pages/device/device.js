// device.js
Page({

  data: {
    devSN:'',
    devName:'',
    scanname: '点击扫码',
    isReg: false,
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight) // 获取可使用窗口高度

        // 将高度乘以换算后的该设备的rpx与px的比例
        let windowHeight = (res.windowHeight * (750 / res.windowWidth));  

        console.log(windowHeight) //最后获得转化后得rpx单位的窗口高度
      }
    })
  
    var that = this;
    // 查看是否授权 
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
         // wx.getUserInfo({
          //  success: function (res) {
              //从数据库获取用户信息
            ////  that.queryUsreInfo();
              //用户已经授权过
            /*  wx.switchTab({
                //url: '/pages/index/index'
              }) */
          //  }
         // }); //getuserinfo
        }
      }
    })

  },

  handleError: function(errorMsg){
    wx.showToast({
      title: errorMsg,
      icon: 'warn',
      duration: 2000
    })
  },

//设备注册

  regDevInfo: function () {
    var _this = this;
    var app = getApp();
    var tradeW4 = {
      Txcode: 'W4',
      SessionID: 'W4',
      devSN: '',
      //devIMEI: '',
      devName: _this.data.devName
    };
    var snquery = {
      Barcode: ''
    };

    if (!(_this.data.devSN.length >= 5)) {
      wx.showToast({
        title: '填入有效序列号',
        icon: 'warn',
        duration: 2000
      })
    }  else {
     // if (tradeQR.SessionID.length < 3) { //没有有效的请求码，则先做 W2 交易以获取 请求码

        console.log(app);
        /**这里先插入一段查询SN历史数据的代码，可以从公司ERP数据库中得到销售维修数据 */
        // 2019.8.10 10:00
        snquery.Barcode = _this.data.devSN.substring(_this.data.devSN.length-5); //取最后五位作为SN
        //送至服务器
 
      wx.request({   //Barcode 
        url: 'https://www.xcre.net/QueryDevice/getCustomerinfo?Barcode=' + snquery.Barcode,
        //data: JSON.stringify(snquery),
        //header: {
          //'content-type': 'application/json'
        //},
        method: 'POST',
        success: function (res) {
          console.log(res);

          if (res.statusCode === 200) {
            switch (res.data.state) {
              case 1:
                wx.showModal({
                  title: snquery.Barcode.toUpperCase(),
                  content: res.data.data.CustomerCompany + '\r\n' + res.data.data.bm + '  ' + res.data.data.mc + '\r\n'+ res.data.data.DateTime + '\r\n',
                  icon: 'success',
                  showCancel: false,
                  confirmText: 'OK'
                })

                _this.setData({
                  devSN: '',
                  devName: '',
                  isReg:false
                })
                break;
              default:
                wx.showModal({
                  title: '提示',
                  content: res.data.message + '\r\n',
                  showCancel: false,
                  confirmText: '知道了'
                })
 ///////////////////////////////////////////////////////////////////////////////
                //组织数据 865352030207848BE732  8669710300497824J35H    865352030633753R8Y7G
                tradeW4.SessionID = wx.getStorageSync('JSESSIONID');//获取本地缓存的请求码 ;
                //tradeW4.devIMEI = _this.data.devSN.substr(0, 15);
                tradeW4.devSN = _this.data.devSN;
                console.log(tradeW4);
                wx.request({   //W4 
                  url: 'https://www.xcre.net/FromWeiXin/DataUP',
                  data: JSON.stringify(tradeW4),
                  header: {
                    'content-type': 'application/json'
                  },
                  method: 'POST',
                  success: function (res1) {
                    console.log(res1);

                    if (res1.statusCode === 200) {
                      switch (res1.data.state) {
                        case 1:
                          wx.showToast({
                            title: '设备已启用',
                            icon: 'success',
                            duration: 2000
                          })

                          // this.setData({
                          //  devSN: '',
                          //  devName: ''
                          // })
                          break;
                        default:
                          wx.showModal({
                            title: '提示',
                            content: res1.data.message + '\r\n',
                            showCancel: false,
                            confirmText: '知道了'
                          })
                          break;
                      }
                    } else {
                      _this.handleError('检查网络状况，再试一次');
                    }

                  },
                  fail: function (res1) {
                    console.log(res1);
                    _this.handleError('设备注册错误');
                  }
                }) //W4 request
                _this.setData({
                  devName: '',
                  devSN: '',
                  isReg: false
                })


 //////////////////////////////////////////////////////////////////////////////
                break;
            }
          } else {
            _this.handleError('检查网络状况，再试一次');
          }

        },
        fail: function (res) {
          console.log(res);
          _this.handleError('设备查询失败');
        }
      }) //Barcode






        /** 查询SN历史数据 到此结束*/
        if(this.data.isReg)  {
              //组织数据 865352030207848BE732  8669710300497824J35H    865352030633753R8Y7G
              tradeW4.SessionID = wx.getStorageSync('JSESSIONID');//获取本地缓存的请求码 ;
              //tradeW4.devIMEI = _this.data.devSN.substr(0, 15);
              tradeW4.devSN = _this.data.devSN;
              console.log(tradeW4);
              wx.request({   //W4 
                url: 'https://www.xcre.net/FromWeiXin/DataUP',
                data: JSON.stringify(tradeW4),
                header: {
                  'content-type': 'application/json'
                },
                method: 'POST',
                success: function (res) {
                  console.log(res);

                  if (res.statusCode === 200) {
                    switch (res.data.state) {
                      case 1:
                        wx.showToast({
                          title: '设备已启用',
                          icon: 'success',
                          duration: 2000
                        })

                       // this.setData({
                        //  devSN: '',
                        //  devName: ''
                       // })
                        break;
                      default:
                        wx.showModal({
                          title: '提示',
                          content: res.data.message + '\r\n',
                          showCancel: false,
                          confirmText: '知道了'
                        })
                        break;
                    }
                  } else {
                    _this.handleError('检查网络状况，再试一次');
                  }

                },
                fail: function (res) {
                  console.log(res);
                  _this.handleError('设备注册错误');
                }
              }) //W4 request
              _this.setData({
                devName:'',
                devSN:'',
                isReg:false
              })
        } //if isreg
    }  //else
  },

  devSNInput: function (e) {
    this.setData({
      devSN: e.detail.value
    })
  },
  devNameInput: function (e) {
    this.setData({
      devName: e.detail.value
    })
  },

 scanCode: function () {
   var that = this
   wx.scanCode({ onlyFromCamera: true,//仅仅相机
      success: (res) => {
        console.log(res);
        that.setData({
          devSN: res.result
        })
      }, 
      /*      
     fail: (res) => { //错误返回
         wx.showToast({
          title: '扫码失败', 
          icon: 'none', 
          duration: 1000 
         })
      }, 
      complete: function (res) {
        wx.showToast({
          title: 'complete', 
          icon: 'none',
          duration: 1000
        }) 
      },
      */
   })
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