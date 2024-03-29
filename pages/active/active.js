// pages/active/active.js
//获取应用实例
const app = getApp()

//计数器
var interval = null;

//值越大旋转时间越长  即旋转速度
var intime = 50;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timer:"",
    ewm:"",
    hasData:false,
    wxcode:"",
    isOld:false, 
    activeId:0, 
    oneId:0,
    secondId:0,
    shareOneId: 0,
    shareSecondId: 0,
    shareTitle:"",
    act:"",
    animationData: {},
    animationData1: {},
    animationData2: {},
    animationData3: {},
    animationData4: {},
    timer: "",
    bzHouse: { EndTime:""},
    house:"",
    active:{},
    datetime: {},
    isActive:true,
    isShare:false,
    showF:true,
    color: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    //奖品金额
    money: [],
    moneyNum:"",//抽中的金额
    zjgl:[],//中将概率
    // btnconfirm: '/img/dianjichoujiang.png',
    // clickLuck: 'clickLuck',
    luckPosition: 0,
    isHas: false,
    show: true,
    utoken: "",
    uid: "",
    role: "",
    mobile:"",
    secondCj:false,
    oneAction:0,
    hasEwm:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log(e);
    if (e.scene) {
      let scene = decodeURIComponent(e.scene);
      if (scene.indexOf(",") < 0) {
        this.setData({
          isShare: true,
          activeId: scene
        })
      } else {
        var arr = scene.split(",");
        this.setData({
          isShare: true,
          activeId: arr[0],
          oneId: arr[1],
          secondId: arr[2],
        })
      }  
    }
    if(e.Id){
          if(e.Id.indexOf(",")<0){
            this.setData({
              activeId: e.Id
            })
          }else{
            var arr=e.Id.split(",");
            this.setData({
              isShare:true,
              activeId: arr[0],
              oneId: arr[1],
              secondId: arr[2],
            })        
          }
    }      
      this.getCode(); 
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
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        if (res.data.HeadImg != '' && res.data.HeadImg != null && res.data.NickName != '' && res.data.NickName != null) {
          that.setData({
            utoken: res.data.Token,
            uid: res.data.UserId,
            role: res.data.RoleType,
            mobile: res.data.Mobile,
            show: false,
            oneAction: that.data.oneAction+1
          })
          setTimeout(function () {
            that.getCj();
          }, 10)
          if (res.data.RoleType == 5 || res.data.RoleType == 4) {//是经纪人
            that.setData({
              shareOneId: res.data.UserId,
              shareSecondId: res.data.UserId,
            })
          } else {//不是经纪人
            if (that.data.oneId > 0) {
              that.setData({
                shareOneId: that.data.oneId,
                shareSecondId: res.data.UserId,
              })
            } else {
              that.setData({
                shareOneId: res.data.UserId,
                shareSecondId: res.data.UserId,
              })
            }
          }
        } else {
          that.setData({
            show: true
          })
        }
      },
      fail(e) {
        that.setData({
          show: true
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("hid");
    clearInterval(this.data.act);
    clearInterval(this.data.timer);
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
    clearInterval(this.data.act);
    clearInterval(this.data.timer);    
    var that = this;
    wx.stopPullDownRefresh();
    //显示动画
    wx.showNavigationBarLoading();
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        if (res.data.HeadImg != '' && res.data.HeadImg != null && res.data.NickName != '' && res.data.NickName != null) {
          that.setData({
            utoken: res.data.Token,
            uid: res.data.UserId,
            role: res.data.RoleType,
            mobile: res.data.Mobile,
            show: false,
            oneAction:1
          })
          setTimeout(function () {
            that.getCj();
          }, 10)
          if (res.data.RoleType == 5 || res.data.RoleType == 4) {//是经纪人
            that.setData({
              shareOneId: res.data.UserId,
              shareSecondId: res.data.UserId,
            })
          } else {//不是经纪人
            if (that.data.oneId > 0) {
              that.setData({
                shareOneId: that.data.oneId,
                shareSecondId: res.data.UserId,
              })
            } else {
              that.setData({
                shareOneId: res.data.UserId,
                shareSecondId: res.data.UserId,
              })
            }
          }
        } else {
          that.setData({
            show: true
          })
        }
      },
      fail(e) {
        that.setData({
          show: true
        })
      }
    })

    setTimeout(function () {
      //隐藏动画
      wx.hideNavigationBarLoading()
    }, 500)    

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
    console.log('/pages/active/active?Id=' + this.data.activeId + "," + this.data.shareOneId + "," + this.data.shareSecondId)
    return {
      title: this.data.shareTitle,
      path: '/pages/active/active?Id=' + this.data.activeId +","+ this.data.shareOneId + "," + this.data.shareSecondId
    }

  },
  goIndex(){
    wx.switchTab({
      url: '../index/index',
    })
  },
  am(){
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: "linear",
      delay: 0
    })
    var that = this;
      setTimeout(function () {
        animation.translateX(0)
        animation.opacity(1).step()
        that.setData({
          animationData: animation.export(),
        })
        setTimeout(function () {
          animation.translateX(-200)
          animation.opacity(0).step()
          that.setData({
            animationData: animation.export()
          })
        }, 2000)
      }, 1000)
  },
  am1() {
    // 显示遮罩层 
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: "linear",
      delay: 0
    })
    var that = this;
    setTimeout(function () {
      animation.translateX(0)
      animation.opacity(1).step()
      that.setData({
        animationData1: animation.export(),
      })
      setTimeout(function () {     
        animation.translateX(-200)
        animation.opacity(0).step()
        that.setData({
          animationData1: animation.export()
        })
      }, 2000)
    }, 1000)    
  },
  am2() {
    // 显示遮罩层 
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: "linear",
      delay: 0
    })
    // this.animation = animation
    var that = this;
    setTimeout(function () {
      animation.translateX(0)
      animation.opacity(1).step()
      that.setData({
        animationData2: animation.export(),
      })
      setTimeout(function () {
        animation.translateX(-200)
        animation.opacity(0).step()
        that.setData({
          animationData2: animation.export()
        })
      }, 2000)
    }, 1000) 

  },
  am3() {
    // 显示遮罩层 
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: "linear",
      delay: 0
    })
    // this.animation = animation
    var that = this;
    setTimeout(function () {
      animation.translateX(0)
      animation.opacity(1).step()
      that.setData({
        animationData3: animation.export(),
      })
      setTimeout(function () {
        animation.translateX(-200)
        animation.opacity(0).step()
        that.setData({
          animationData3: animation.export()
        })
      }, 2000)
    }, 1000) 

  },
  am4() {
    // 显示遮罩层 
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: "linear",
      delay: 0
    })
    // this.animation = animation
    var that = this;
    setTimeout(function () {
      animation.translateX(0)
      animation.opacity(1).step()
      that.setData({
        animationData4: animation.export(),
      })
      setTimeout(function () {
        animation.translateX(-200)
        animation.opacity(0).step()
        that.setData({
          animationData4: animation.export()
        })
      }, 2000)
    }, 1000) 

  },       
  goHb(){
    wx.navigateTo({
      url: '/pages/acHb/acHb?Id='+ this.data.activeId + "&OneStartUserId=" + this.data.shareOneId + "&StartUserId=" + this.data.shareSecondId,
    })
  },
  // 倒计时
  djsList: function () {
    // 倒计时时间转换为时间戳
    var dates = "";
      if (this.data.bzHouse.EndTime != "") {
        var end_time = new Date((this.data.bzHouse.EndTime).replace(/-/g, '/')).getTime();//月份是实际月份-1  
        // console.log(end_time);
        var current_time = new Date().getTime();
        var sys_second = (end_time - new Date().getTime());
        
        dates={ dat: sys_second };
      }
    this.setData({
      datetime: dates
    })
    // 倒计时执行
    let that = this;
      var intDiff = that.data.datetime.dat;//获取数据中的时间戳
      if (intDiff > 0) {//转换时间
        that.data.datetime.dat -= 1000;
        var day = Math.floor((intDiff / 1000 / 3600) / 24);
        var hour = Math.floor(intDiff / 1000 / 3600);
        var minute = Math.floor((intDiff / 1000 / 60) % 60);
        var second = Math.floor(intDiff / 1000 % 60);

        if (hour <= 9) hour = '0' + hour;
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
        var str = day + "," + hour + ',' + minute + ',' + second
        that.data.datetime.difftime = str;//在数据中添加difftime参数名，把时间放进去
        that.data.bzHouse.djs = that.data.datetime.difftime;

        that.setData({
          bzHouse: that.data.bzHouse
        })
      } else {
        // var str = "已结束！";
        // clearInterval(that.data.timer);
      }

  }, 
  goFriend(e){
    var id=e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../friends/friends?id='+id,
    })
  },
  goMoney(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../money/money?id=' + id,
    })
  },
  goJjr(){
    wx.navigateTo({
      url: '../applyJjr/applyJjr',
    })
  },
  go(){
    wx.reLaunch({
      url: '../index/index',
    })
  },
  call(e){
    var that=this;
    var num=e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: num,
    })
  },

//抽奖
  //点击抽奖按钮
  clickLuck: function () {
    console.log(this.data.luckPosition);
    var e = this;
    //清空计时器
    clearInterval(interval);
    var index = 0;
    //循环设置每一项的透明度
    interval = setInterval(function () {
      if (index > 5) {
        index = 0;
        e.data.color[5] = 0.5
      } else if (index != 0) {
        e.data.color[index - 1] = 0.5
      }
      e.data.color[index] = 1
      e.setData({
        color: e.data.color,
      })
      index++;
    }, intime);

    //模拟网络请求时间  设为两秒
    var stoptime = 1000;
    setTimeout(function () {
      e.stop(e.data.luckPosition);
    }, stoptime)

  },

  //也可以写成点击按钮停止抽奖
  // clickStop:function(){
  //   var stoptime = 2000;
  //   setTimeout(function () {
  //     e.stop(1);
  //   }, stoptime)
  // },

  stop: function (which) {
    var e = this;
    //清空计数器
    clearInterval(interval);
    //初始化当前位置
    var current = -1;
    var color = e.data.color;
    for (var i = 0; i < color.length; i++) {
      if (color[i] == 1) {
        current = i;
      }
    }
    //下标从1开始
    var index = current + 1;

    e.stopLuck(which, index, intime, 10);
  },


  /**
   * which:中奖位置
   * index:当前位置
   * time：时间标记
   * splittime：每次增加的时间 值越大减速越快
   */
  stopLuck: function (which, index, time, splittime) {
    var e = this;
    //值越大出现中奖结果后减速时间越长
    var color = e.data.color;
    setTimeout(function () {
      //重置前一个位置
      if (index > 5) {
        index = 0;
        color[5] = 0.5
      } else if (index != 0) {
        color[index - 1] = 0.5
      }
      //当前位置为选中状态
      color[index] = 1
      e.setData({
        color: color,
      })
      //如果旋转时间过短或者当前位置不等于中奖位置则递归执行
      //直到旋转至中奖位置
      if (time < 300 || index != which) {
        //越来越慢
        splittime++;
        time += splittime;
        //当前位置+1
        index++;
        e.stopLuck(which, index, time, splittime);
      } else {
        //1秒后显示弹窗
        setTimeout(function () {
          e.setData({
            isHas: true
          })
          // if (which == 1 || which == 3 || which == 5) {
          //   //中奖
          //   wx.showModal({
          //     title: '提示',
          //     content: '恭喜中奖',
          //     showCancel: false,
          //     success: function (res) {
          //       if (res.confirm) {
          //         //设置按钮可以点击
          //         e.setData({
          //           btnconfirm: '/img/dianjichoujiang.png',
          //           clickLuck: 'clickLuck',
          //         })
          //         e.loadAnimation();
          //       }
          //     }
          //   })
          // } else {
          //   //中奖
          //   wx.showModal({
          //     title: '提示',
          //     content: '很遗憾未中奖',
          //     showCancel: false,
          //     success: function (res) {
          //       if (res.confirm) {
          //         //设置按钮可以点击
          //         e.setData({
          //           btnconfirm: '/img/dianjichoujiang.png',
          //           clickLuck: 'clickLuck',
          //         })
          //         e.loadAnimation();
          //       }
          //     }
          //   })
          // }
        }, 1000);
      }
    }, time);
    // console.log(time);
  },
  //进入页面时缓慢切换
  loadAnimation: function () {
    var e = this;
    var index = 0;
    // if (interval == null){
    interval = setInterval(function () {
      if (index > 5) {
        index = 0;
        e.data.color[5] = 0.5
      } else if (index != 0) {
        e.data.color[index - 1] = 0.5
      }
      e.data.color[index] = 1
      e.setData({
        color: e.data.color,
      })
      index++;
    }, 1000);
    // }  
  },
  getCode: function () {
    var that = this;
    wx.login({
      success(res) {
        console.log(res);
        that.setData({
          wxcode: res.code
        })
      }
    })
  },
  //获取头像昵称
  getUserInfo: function (e) {
    var ivObj = e.detail.iv
    var telObj = e.detail.encryptedData;
    var that = this;
    console.log(that.data.wxcode);
    console.log(e);
    //-----------------是否授权，授权通过进入主页面，授权拒绝则停留在登陆界面
    if (e.detail.errMsg == 'getUserInfo:fail auth deny') { //用户点击拒绝
      wx.showToast({
        title: "授权后才能进入活动哦",
        icon: "none"
      })      
    } else { //授权通过执行跳转
      if (that.data.wxcode!=''){
        wx.showLoading({
          title: '授权中',
          mask: true
        })
        
        wx.request({
          url: 'https://spapi.centaline.com.cn/zyzapi/Users/UserLogin', //接口地址
          data: {
            code: that.data.wxcode,
            encryptedData: telObj,
            iv: ivObj,
            Type: 4,
            AuthorizeType: 2
          },
          method: "post",
          success: function (res) {
            console.log(res);
            if (res.data.code == 1001) {
              wx.setStorage({   //存储数据并准备发送给下一页使用
                key: "userInfo",
                data: res.data.data,
              })
              that.setData({
                utoken: res.data.data.Token,
                uid: res.data.data.UserId,
                role: res.data.data.RoleType,
                mobile: res.data.data.Mobile,                
                show: false
              })
              // this.loadAnimation();
              setTimeout(function(){
                that.getCj();
              },100)                   
            }
            else {
              wx.showToast({
                title: "授权失败，请稍后再试",
                icon: "none"
              })
            }
            wx.hideLoading();
          }
        })
      }
    }

  }, 
  //通过绑定手机号登录
  getPhoneNumber: function (e) {
    console.log(e);
    var ivObj = e.detail.iv
    var telObj = e.detail.encryptedData;
    var that = this;
    console.log(ivObj);

    //-----------------是否授权，授权通过进入主页面，授权拒绝则停留在登陆界面
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') { //用户点击拒绝
      wx.showToast({
        title: "同意后才能升级为经纪人哦",
        icon: "none"
      })   
    } else { //授权通过执行跳转 
      if (that.data.wxcode != '') {  
        wx.showLoading({
          title: '授权中',
          mask: true
        })     
        wx.request({
          url: 'https://spapi.centaline.com.cn/zyzapi/Users/UserLogin', //接口地址
          data: {
            code: that.data.wxcode,
            encryptedData: telObj,
            iv: ivObj,
            Type: 4,
            AuthorizeType: 1
          },
          method: "post",
          success: function (res) {
            console.log(res);
            if (res.data.code == 1001) {
              wx.setStorage({   //存储数据并准备发送给下一页使用
                key: "userInfo",
                data: res.data.data,
              })
              wx.navigateTo({
                url: '../applyJjr/applyJjr',
              })
            }
            else {
              wx.showToast({
                title: "授权失败，请稍后再试",
                icon: "none"
              })
            }
            wx.hideLoading();
          }
        })
      }
    }
  },
  goJjr(){
    wx.navigateTo({
      url: '../applyJjr/applyJjr',
    })
  },  
  action(){
    var that=this;
    that.am();
    setTimeout(function () {
      that.am1();
      setTimeout(function () {
        that.am2();
        setTimeout(function () {
          that.am3();
          setTimeout(function () {
            that.am4();
          }, 3000)
        }, 3000)
      }, 3000)
    }, 3000)    
  }, 
  action1() {
    var that = this;
    that.am();
    setTimeout(function () {
      that.am1();
      setTimeout(function () {
        that.am2();
        setTimeout(function () {
          that.am3();
        }, 3000)
      }, 3000)
    }, 3000)
  }, 
  action2() {
    var that = this;
    that.am();
    setTimeout(function () {
      that.am1();
      setTimeout(function () {
        that.am2();
      }, 3000)
    }, 3000)
  }, 
  action3(){
    var that = this;
    that.am();
    setTimeout(function () {
      that.am1();
    }, 3000)   
  }, 
  action4() {
    var that = this;
    that.am();
  },          
  // 获取详情
  getCj(){
    wx.showLoading({
      title: '数据加载中',
      mask: true
    })    
    var that=this;
    console.log(that.data.activeId);
    console.log(that.data.oneId);
    console.log(that.data.secondId);
    wx.request({
      url: 'https://spapi.centaline.com.cn/zyzapi/Rotate/GetRotateById',
      method:"post",
      data:{
        Id:that.data.activeId,
        OneStartUserId: that.data.oneId,
        StartUserId: that.data.secondId
      },
      header:{
        'token': that.data.utoken
      },
      success:res=>{
        console.log(res);
        if(res.data.code==1001){
          that.setData({
            house:res.data.data,
            ewm: res.data.data.WxQRcode,
            shareTitle: res.data.data.ShareTitle,
            active: res.data.data.RotateUserAmount,
            bzHouse: { EndTime: res.data.data.EndTime},
            hasData:true,
          })
          console.log(that.data.house.RotateStartUserAmountList.length);
          if (that.data.house.RotateStartUserAmountList.length > 4){
            
            if (that.data.oneAction == 1){
              that.action();
            }
                
            that.setData({
              act: setInterval(function () {
                that.action();
              }, 15000)
            })            
          } else if (that.data.house.RotateStartUserAmountList.length > 3){
            if (that.data.oneAction == 1) {
              that.action1();
            }
            that.setData({
              act: setInterval(function () {
                        that.action1();
                      }, 12000) 
            })
                        
          } else if (that.data.house.RotateStartUserAmountList.length > 2) {
            console.log(3);
            if (that.data.oneAction == 1) {
              that.action2();
            }
            that.setData({
              act: setInterval(function () {
                that.action2();
              }, 9000)
            })            
                                    
          } else if (that.data.house.RotateStartUserAmountList.length > 1) {
            if (that.data.oneAction == 1) {
              that.action3();
            } 
            that.setData({
              act: setInterval(function () {
                that.action3();
              }, 6000) 
            })                     
                 
          } else if (that.data.house.RotateStartUserAmountList.length > 0) {
            if (that.data.oneAction == 1) {
              that.action4();
            }
            that.setData({
              act: setInterval(function () {
                that.action4();
              }, 3000) 
            })            
                       
          }
          // 设计定时器
          that.setData({
            timer: setInterval(function () {
              that.djsList();
            }, 1000)
          })          
          wx.setStorageSync("activeData", res.data.data);
          wx.setStorageSync("clickList", res.data.data.RotateHelpUserClickList);
          wx.setStorageSync("moneyList", res.data.data.RotateStartUserAmountList);
          if (res.data.data.UserMaxAmountBl){
            that.setData({
              isOld:true
            })
            if (res.data.data.RotateAmountType == 1) {
              that.setData({
                isHas:true,
                secondCj: true
              })
            } else if (res.data.data.RotateAmountType == 2) {//转盘抽奖
              that.setData({
                isHas: false,
                money: res.data.data.RotateMaxAmountConfigList,
                moneyNum: res.data.data.UserMaxAmount,
                zjgl: res.data.data.RotateMaxAmountArr[Math.floor(Math.random() * 100)]
              })
              var arr = [];
              for (var i in res.data.data.RotateMaxAmountConfigList) {
                arr.push(res.data.data.RotateMaxAmountConfigList[i].Amount)
              }
              var idx = arr.indexOf(that.data.zjgl);
              that.setData({
                luckPosition: idx
              })
              // 抽奖

              setTimeout(function(){
                that.clickLuck()
              },500)
            }            
          }
        }else if(res.data.code==1101){
          that.setData({
            show: true
          })
        }else{
          wx.showToast({
            title: '网络异常,请稍后~',
            icon: 'none'
          }) 
        }
        wx.hideLoading() 
      },
      fail:error=>{
        wx.showToast({
          title: '网络异常,请稍后再进~',
          icon: 'none'
        })         
      }
    })
  },
  setMoney(e){
    var that=this;
    var num=e.currentTarget.dataset.num;
    wx.request({
      url: 'https://spapi.centaline.com.cn/zyzapi/Rotate/AddRotateStartUserAmount',
      method: "post",
      data: {
        RotateId: that.data.activeId,
        UserMaxAmount:num
      },
      header: {
        'token': that.data.utoken
      }, 
      success:res=>{
        console.log(res);
        if(res.data.code==1001){
          that.setData({
            isOld: false
          }) 
          that.getCj();         
        }else{
          wx.showToast({
            title: '网络异常,请稍后~',
            icon: 'none'
          })          
        }
      }     
    })
  },
  closeShow(){
    this.setData({
      showF:false
    })
  },
  //显示二维码 
  mBig(e) {
    wx.previewImage({
      current: this.data.ewm,
      urls: [this.data.ewm]
    })
  },
  showEwm(e) {
    this.data.hasEwm = !this.data.hasEwm;
    var that = this;
    // 显示遮罩层 
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: "linear",
      delay: 0
    })
    // this.animation = animation
    // animation.translateY(300).step()
    animation.opacity(0.5).step()
    this.setData({
      animationEwm: animation.export(),
      hasEwm: that.data.hasEwm
    })
    // setTimeout(function () {
    // animation.translateY(0).step()
    animation.opacity(1).step()
    this.setData({
      animationEwm: animation.export()
    })
    // }.bind(this), 200)     
  },

})