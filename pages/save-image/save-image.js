const app = getApp();
Page({
  data: {
    isPicTwo: false,
    isShowOpenSetting: false,
    urlStr: 'http://wx.qlogo.cn/mmopen/98Nz5LFElxzjUXYDtia8tTpU3fQGqB80BasKdDFVMKibwNnIib3ZMD9Km53YM58sMFCdHxB74aicFVibyM37ZAYibmpNpQyYiafeibzu/0'
  },
  /****** 
   * 第一种方式
   */
  oneSaveImg: function () {
    wx.showLoading({
      title: '正在处理',
    })
    app.getSetting('scope.writePhotosAlbum').then((data) => {
      console.log(data)
      this.savePhoto()
      debugger
    }).catch((err) => {
      console.log('------', err)
      wx.hideLoading()
      this.setData({
        isShowOpenSetting: true
      })
    })
  },
  //取消事件
  cancelEvent() {
    wx.showModal({
      title: '警告',
      content: '不授权无法保存',
      showCancel: false
    })
    this.setData({
      isShowOpenSetting: false
    })
  },

  //确认事件
  confirmEvent(e) {
    if (e.detail.state && e.detail.scope === 'scope.writePhotosAlbum') {
      wx.showToast({
        title: '授权成功'
      })
      this.setData({
        isShowOpenSetting: false
      })
    }
  },


  /***
   *  第二种方式
   */
  twoSaveImg() {
    wx.showLoading({
      title: '正在处理',
    })
    wx.getSetting({
      success: (res) => {
        //不存在相册授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              this.savePhoto();
              this.setData({
                isPicTwo: false
              })
            },
            fail: (err) => {
              wx.hideLoading()
              this.setData({
                isPicTwo: true
              })
            }
          })
        } else {
          wx.hideLoading()
          this.savePhoto();
        }
      }
    })
  },
  handleSetting(e) {
    if (!e.detail.authSetting['scope.writePhotosAlbum']) {
      wx.showModal({
        title: '警告',
        content: '不授权无法保存',
        showCancel: false
      })
      this.setData({
        isPicTwo: true
      })
    } else {
      wx.showToast({
        title: '授权成功'
      })
      this.setData({
        isPicTwo: false
      })
    }
  },
  savePhoto() {
    let {
      urlStr
    } = this.data;

    wx.downloadFile({
      url: urlStr,
      success: (res) => {
        debugger
        this.saveImageToPhotosAlbum(res)
      }
    })
  },

  
  /**
   * 第三种方式
   */
  therrSaveImg: function () {
    let {
      urlStr
    } = this.data;
    wx.downloadFile({
      url: urlStr,
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: (data) => {
            wx.hideLoading()
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 1500
            })
          },
          fail: (err) => {
            wx.hideLoading()
            if (err.errMsg === "saveImageToPhotosAlbum:fail cancel") {
              console.log('保存失败');
            } else {
              this.setData({
                isShowOpenSetting: true
              })
            }
            console.log(err)
          }
        })
      }
    })
  },
  saveImageToPhotosAlbum: function (res) {
    wx.saveImageToPhotosAlbum({
      filePath: res.tempFilePath,
      success: (data) => {
        wx.hideLoading()
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 1500
        })
      },
      fail: (err) => {
        wx.hideLoading()
        wx.showModal({
          title: "保存失败"
        })
        console.log(err)
      }
    })
  }
})