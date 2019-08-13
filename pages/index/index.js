//index.js

//获取应用实例
//var app = getApp()
var QR = require('../../utils/qrCode.js');
var util = require('../../utils/util.js');
var isRefresh = false;
var timeoutId;

Page({
  data: {
    charOK: false ,
    qrCode: '',
    indicate_id: '',
    write_id: '',
    read_id: '',
    deviceId: '',
    service_id: '',
    isbluetoothready: false,  //蓝牙开关
    searchingstatus: false,    //可搜索
    canvasHidden: false,
    maskHidden: true,
    imagePath: '',
    pdleft: '132rpx',
    textQR: '开门码',
    redo: true,
    placeholder: 'www.hzxc.org'  //默认二维码生成文本
  },

  onLoad: function (options) {
    
    var that = this;
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      //&是我们定义的参数链接方式
      let userId = options.scene.split("&")[0];
      let recommendId = options.scene.split('&')[1];
      //其他逻辑处理。。。。。
      console.log('scene: index.onLoad ', options.scene);
      wx.showModal({
        content: userId + recommendId
      })
    }
    //BLE 开关打开
    that.setData({
      isbluetoothready: !that.data.isbluetoothready,
    })
    wx.onBluetoothAdapterStateChange(function (res) {
      console.log("蓝牙适配器状态变化", res)
      that.setData({
        isbluetoothready: res.available,
        searchingstatus: res.discovering
      })
    })



    // 页面初始化 options为页面跳转所带来的参数
    var size = this.setCanvasSize();//动态设置画布大小
    var CodeQR = 'QR';
    isRefresh = true;

    wx.showShareMenu({
      withShareTicket: true
    })
/*
    CodeQR = wx.getStorageSync('code2v');//wx.getStorageSync(key)，获取本地缓存

    if(CodeQR.length<3) {
     //若本地没有有效的 code2v ，则向服务器申请
      //CodeQR = that.data.placeholder;
      //that.createQrCode(CodeQR, "mycanvas", size.w, size.h);
      isRefresh = true;
    } else {
      var time = util.formatTime(new Date());
      var qrTime = CodeQR.split("|");
      console.log(qrTime,time);
      if(time > qrTime[2]) {  //当前时间超过 二维码的预定有效时间
        //申请新的二维码
        console.log(qrTime[2]);
        isRefresh = true;
        //显示新的二维码
        //that.createQrCode(CodeQR, "mycanvas", size.w, size.h);

      } else { //二维码在有效期内直接显示
        that.createQrCode(CodeQR, "mycanvas", size.w, size.h);
      }
    } */
    //that.createQrCode(CodeQR, "mycanvas", size.w, size.h);
    //getApp().getUserInfo().then(function (res) { //promise 用法有点问题
    //  console.log('[index.then]',res.globalData);
    //})

  },

  onShow: function () {

 


   var animation = wx.createAnimation({
      duration: 1000,
      transformOrigin: "50% 50% 0",
      timingFunction: "ease-in"
    });
    this.animation = animation;
    animation.scale(1.5, 1.5).step();
    this.setData({
      animationData: animation.export()
    })
  },
 
  onReady: function () {
    if(isRefresh)
      this.formSubmit(); 
  },

  //QR Code
  //适配不同屏幕大小的canvas
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 /res.windowWidth;// 686;//不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      width = 210;
      var height = width;//canvas画布为正方形
      size.w = width;//260; //width;
      size.h = height;//260; //height;
      var pdl =  (res.windowWidth - width) / 2 / scale; 
      //var pdl = (width - 260) / 2;
      //pdl = -200;
      this.data.pdleft = pdl.toString() + 'rpx';
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  createQrCode: function (url, canvasId, cavW, cavH) {
    var that = this;
    //var sbn = 0.5000;
   // QR.api.draw(url, canvasId, cavW, cavH);
    //调节屏幕亮度：保存现有亮度，加亮，5秒后恢复
/*    var sbn = 0.5000;
    wx.getScreenBrightness({
      success: function (res) {
        sbn = res.value;
        that.setData({
          screenBrightness: res.value
        })
        wx.setScreenBrightness({
          success: function (res) {
            value: 1;
          }
        })
      }
    });*/
/*
    timeoutId = setTimeout(function() {
      wx.setScreenBrightness({
        value: sbn
        //value: parseFloat(e.detail.value).toFixed(1)
      })
      //clearTimeout(timeoutId)
    }, 5000);*/
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(url, canvasId, cavW, cavH);
    setTimeout(() => { that.canvasToTempImage(); }, 1000);

  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function () {
    var that = this;

    var sbn = 0.5000;
    wx.getScreenBrightness({
      success: function (res) {
        sbn = res.value;
  //      that.setData({
  //        screenBrightness: res.value
   //     })
        wx.setScreenBrightness({
         
            value: 1
          
        })
      }
    })
    timeoutId = setTimeout(function () {
      wx.setScreenBrightness({
        value: sbn
        //value: parseFloat(e.detail.value).toFixed(1)
      })
      //clearTimeout(timeoutId)
    }, 10000);
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        console.log('[FilePath]',tempFilePath);
        that.setData({
          imagePath: tempFilePath,
          //canvasHidden:true  //本来是注释掉的
        });
      },
      fail: function (res) {
        console.log('[FilePath:Fail]',res);
      }
    });
  },
  //点击图片进行预览，长按保存分享图片
  previewImg: function (e) {
    var img = this.data.imagePath;
    console.log('[IMG]',img);
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  },
  
  // 接口调用失败处理，
  handleError: function(res, callback) {
    // 规定-3041和-3042分别代表未登录和登录态失效
    if(res.code == -3041 || res.code == -3042) {
      // 弹窗提示一键登录
      showLoginModal()
    } else if (res.msg) {
      // 弹窗显示错误信息
      wx.showToast({
        title: res.msg,
          icon: 'loading',
            duration: 2000
      })
    }
  },

  // 显示一键登录的弹窗
  showLoginModal: function () {
    wx.showModal({
      title: '提示',
      content: '你还未登录，登录后可获得完整体验 ',
      confirmText: '一键登录',
      success(res) {
        // 点击一键登录，去授权页面
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      }
    })
  },



  hexStringToArrayBuffer: function (str) {
    if (!str) {
      return new ArrayBuffer(0);
    }
    var buffer = new ArrayBuffer(str.length);
    let dataView = new DataView(buffer)
    let ind = 0;
    for (var i = 0, len = str.length; i < len; i += 2) {
      let code = parseInt(str.substr(i, 2), 16)
      dataView.setUint8(ind, code)
      ind++
    }
    return buffer;
  },

  ab2hext: function (buffer) {              //arrayBufferToHexString
    var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join('');
  },

  formSubmit: function () {  //按钮响应函数
    var that = this;

    //var qrcodeOK = false;
    //申请新的二维码
    //W3 START
    var tradeQR = {
      Txcode: 'W3',
      SessionID: 'W3'
    };
    //var url = this.data.placeholder;
 //   while (that.data.redo) {
 //     that.setData({
  //      redo: false
  //    })
    /*之前是公司测试的在线版本，现在要求每次都新申请二维码 begin*/
    tradeQR.SessionID = wx.getStorageSync('JSESSIONID');//获取本地缓存的请求码
    //tradeQR.SessionID = '0';//有了这一行程序，按照逻辑必须每次新申请
    /*之前是公司测试的在线版本，现在要求每次都新申请二维码 end*/

    if (tradeQR.SessionID.length < 3) { //没有有效的请求码，则先做 W2 交易以获取 请求码
      var tradeW2 = {
        Txcode: 'W2',
        JSCode: ''
      };
      var app = getApp();
      console.log(app);
      tradeW2.JSCode = app.globalData.jscode;
      wx.request({                                            //W2 获取请求码交易
        url: 'https://www.xcre.net/FromWeiXin/DataUP',
        data: JSON.stringify(tradeW2),
        header: {  
          'content-type': 'application/json'
        },
        method: 'POST',
        success: function (res) {
          console.log('[W2]',res);
          if ((res.statusCode === 200) && (res.data.state == 1)) { 
            tradeQR.SessionID = res.data.data.SessionID;
            wx.setStorageSync('JSESSIONID', res.data.data.SessionID); //保存 请求码 在本地
            
            wx.request({                                              //W3 申请二维码交易
              url: 'https://www.xcre.net/FromWeiXin/DataUP',
              data: JSON.stringify(tradeQR),
              header: {  
                'content-type': 'application/json'
              },
              method: 'POST',
              success: function (res) {
                console.log('[W3-1]',tradeQR,res);
                if ((res.statusCode === 200) && (res.data.state == 1)) {
                    
                  wx.setStorageSync('code2v', res.data.data.Code2V); //保存Code2V在本地  
                   
                  //that.data.textQR = res.data.data.Code2V;
                  var size = that.setCanvasSize();
                  that.createQrCode(res.data.data.Code2V, "mycanvas", size.w, size.h);
                }
              } //success
            }) // wx.request
          } else if ((res.statusCode === 200) && ((res.data.state == 8) || (res.data.state == 10))) {
            //W2交易失败处理
            wx.showToast({
              title: '请先绑定手机号',
              icon: 'warn',
              duration: 2000
            })
            setTimeout(function () {
              wx.switchTab({
                url: '/pages/login/login'
              })
            }, 2000);
            
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'loading',
              duration: 2000 
            })           
          }
        }
      })
    } 
    /*之前是公司测试的在线版本，现在要求每次都新申请二维码 begin*/
    
    else { //本地存有前次交易用过的请求码，直接做 W3 交易以获取 二维码
      wx.request({                                              //W3 申请二维码交易
        url: 'https://www.xcre.net/FromWeiXin/DataUP',
        data: JSON.stringify(tradeQR),
        header: {   
          'content-type': 'application/json'
        },
        method: 'POST',
        success: function (res) {
          console.log('[W3-2]',tradeQR,res);
          if ((res.statusCode === 200) && (res.data.state == 1)) {
            wx.setStorageSync('code2v', res.data.data.Code2V); //保存Code2V在本地
            var size = that.setCanvasSize();
            that.createQrCode(res.data.data.Code2V, "mycanvas", size.w, size.h);
          } else {
            //怀疑本地暂存的SessionID有问题，清空
            wx.setStorageSync('JSESSIONID', '');
            if (res.data.state == 9) {
              that.setData({
                redo: true
              })
            }
            else {
              wx.showToast({
                title: res.data.message,
                icon: 'loading',
                duration: 2000
              })
            }
          }
        }
      })
    } //else
    
    /*之前是公司测试的在线版本，现在要求每次都新申请二维码 end*/
//    } //while
  }, //formSubmit



  qrUnlock: function () {  //扫码蓝牙开门函数
    var that = this;

    wx.scanCode({
      onlyFromCamera: true,//仅仅相机
      success: (res) => {
        console.log(res);
        that.setData({
          qrCode: res.result
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
    /******************************************
     * 这里先处理一下蓝牙门锁自动连接
     */
    wx.closeBluetoothAdapter({
      complete: function (res) {
        console.log(res)
        wx.openBluetoothAdapter({
          success: function (res) {
            console.log(res)
            wx.getBluetoothAdapterState({
              success: function (res) {
                console.log(res)
              }
            })
          },
          fail: function (res) {
            //关闭蓝牙
            //wx.closeBluetoothAdapter();
            wx.showModal({
              content: '请开启手机蓝牙后再试'
            })
          }
        }) //open
      }
    }) //close

    if (that.data.isbluetoothready) {
      setTimeout(function () {
        //开始搜索蓝牙
        wx.startBluetoothDevicesDiscovery({
          success: function (res) {
            console.log('search', res)
          },
          fail: function (res) {
            console.log('searchf', res)
          }
        })
      }, 1500);
      //发现设备
      wx.getBluetoothDevices({
        success: function (res) {
          console.log('发现设备', res)
          if (res.devices[0]) {
            console.log(that.ab2hext(res.devices[0].advertisData))
          }
          //2s内未搜索到设备，关闭搜索，关闭蓝牙模块
          setTimeout(function () {
            if (!that.data.deviceId) {
              wx.hideLoading()
              app.showToast('搜索设备超时', 'none');
              //关闭搜索
              wx.stopBluetoothDevicesDiscovery();
              //关闭蓝牙
              wx.closeBluetoothAdapter();
            }
          }, 2000)
        },
        fail: function (res) {
          console.log('search1f', res)
        }
      })
      //监听发现设备
      //    setTimeout(function () {
      wx.onBluetoothDeviceFound(function (devices) {
        console.log('发现设备:', devices.devices)
        for (let i = 0; i < devices.devices.length; i++) {
          //检索指定设备
          if (devices.devices[i].name == 'XCRE') {
            that.setData({
              deviceId: devices.devices[i].deviceId
            })
            //关闭搜索
            wx.stopBluetoothDevicesDiscovery();
            console.log('已找到指定设备:', devices.devices[i].deviceId);
            /********************************************************开始连接 */
            wx.createBLEConnection({
              deviceId: that.data.deviceId,//搜索设备获得的蓝牙设备 id
              success: function (res) {
                console.log('连接蓝牙:', res.errMsg);
              },
              fail: function (res) {
                app.showToast('连接超时,请重试', 'none');
                that.closeBluetoothAdapter();
              }
            })
            setTimeout(function () {
              wx.getBLEDeviceServices({
                deviceId: that.data.deviceId,//搜索设备获得的蓝牙设备 id
                success: function (res) {
                  let service_id = "";
                  for (let i = 0; i < res.services.length; i++) {
                    if (res.services[i].uuid.toUpperCase().indexOf("FFE0") != -1) {
                      service_id = res.services[i].uuid;
                      that.setData({
                        service_id: service_id
                      })
                      break;
                    }
                  }
                  console.log('FFE0-service_id:', that.data.service_id);
                },
                fail(res) {
                  console.log(res);
                }
              })
            }, 500);

            //获取特征值
            setTimeout(function () {
              wx.getBLEDeviceCharacteristics({
                deviceId: that.data.deviceId,     //搜索设备获得的蓝牙设备 id
                serviceId: that.data.service_id,  //服务ID
                success: function (res) {
                  console.log('device特征值:', res.characteristics)
                  that.setData({ charOK: false });
                  for (let i = 0; i < res.characteristics.length; i++) {
                    let charc = res.characteristics[i];
                    if (charc.properties.notify) {
                      that.setData({ indicate_id: charc.uuid });
                      console.log('notify_id:', that.data.indicate_id);
                    }
                    if (charc.properties.write) {
                      that.setData({ write_id: charc.uuid });
                      console.log('写write_id:', that.data.write_id);
                    }
                    /*             if (charc.properties.read) {
                                   that.setData({ read_id: charc.uuid });
                                   console.log('读read_id:', that.data.read_id);
                                 }*/
                    if (res.characteristics[i].uuid.toUpperCase().indexOf("FFE1") != -1) {
                      that.setData({ charOK: true });
                      break;  //这个uuid可读可写
                    }
                  }
                  if (that.data.charOK) {
                    wx.notifyBLECharacteristicValueChange({
                      state: true, // 启用 notify 功能
                      deviceId: that.data.deviceId,//蓝牙设备id
                      serviceId: that.data.service_id,//服务id
                      characteristicId: that.data.indicate_id,//服务特征值indicate
                      success: function (res) {
                        console.log('开启notify', res.errMsg)
                        //监听低功耗蓝牙设备的特征值变化
                        wx.onBLECharacteristicValueChange(function (res) {
                          console.log('特征值变化', that.ab2hext(res.value));
                        })
                        //写入数据
                        //let buffer = that.hexStringToArrayBuffer(ArrayBuffer);
                        let buffer = that.hexStringToArrayBuffer('www.xcre.net');
                        //写入数据
                        // setTimeout(function () {            //这个时间要等一下的
                        wx.writeBLECharacteristicValue({
                          deviceId: that.data.deviceId,//设备deviceId
                          serviceId: that.data.service_id,//设备service_id
                          characteristicId: that.data.write_id,//设备write特征值
                          value: buffer,//写入数据
                          success: function (res) {
                            console.log('发送数据:', res.errMsg)
                            wx.showModal({
                              content: '开锁成功'
                            })
                          }
                        })
                        //   }, 2000);


                      },
                      fail: function (res) {
                        console.log('开启notify失败:', res.errMsg)
                      }
                    });
                  }  //if charOK 



                },
                fail: function (res) {
                  console.log('获取device特征值失败:', res.errMsg)
                }
              })
            }, 1500);

            //开启notify
            /*              if(that.data.charOK) {
                          wx.notifyBLECharacteristicValueChange({
                            state: true, // 启用 notify 功能
                            deviceId: that.data.deviceId,//蓝牙设备id
                            serviceId: that.data.service_id,//服务id
                            characteristicId: that.data.indicate_id,//服务特征值indicate
                            success: function (res) {
                              console.log('开启notify', res.errMsg)
                              //监听低功耗蓝牙设备的特征值变化
                              wx.onBLECharacteristicValueChange(function (res) {
                                console.log('特征值变化', that.ab2hext(res.value));
                              })
                              //写入数据
                              //let buffer = that.hexStringToArrayBuffer(ArrayBuffer);
                              let buffer = that.hexStringToArrayBuffer('www.xcre.net');
                              //写入数据
                              setTimeout(function () {            //这个时间要等一下的
                                wx.writeBLECharacteristicValue({
                                  deviceId: that.data.deviceId,//设备deviceId
                                  serviceId: that.data.service_id,//设备service_id
                                  characteristicId: that.data.write_id,//设备write特征值
                                  value: buffer,//写入数据
                                  success: function (res) {
                                    console.log('发送数据:', res.errMsg)
                                  }
                                })
                              },2000);
            
            
                            },
                            fail: function (res) {
                              console.log('开启notify失败:', res.errMsg)
                            }
                          });
                          }  //if charOK 
            */
            /*****结束连接 */
          }
        }
      })
      //     },1500);
    }


    /******************************************
     * 蓝牙门锁问题到此结束
     */

  }, //qrUnlock


/**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: 'XCRE',
      path: '/pages/index/index',
      imageUrl: '',
      success: function (shareTickets) {
        console.info(shareTickets + '成功');
        // 转发成功
      },
      fail: function (res) {
        console.log(res + '失败');
        // 转发失败
      },
      complete: function (res) {
        // 不管成功失败都会执行
      }
    }
  }

})
