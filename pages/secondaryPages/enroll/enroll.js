// pages/secondaryPages/enroll/enroll.js
import {
  createStoreBindings
} from 'mobx-miniprogram-bindings';
import {
  store
} from '../../../store/store';
import referenceData from '../../../config/referenceData';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: referenceData.defaultAvatarUrl,
    basicUrl: referenceData.BasicUrl,
    nickname: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['author', 'token'],
      actions: ['getAuthorMessage', 'getToken']
    })
  },
  onUnload: function () {
    this.storeBindings.destroyStoreBindings();
  },
  onChooseAvatar(e) {
    const tempFilePath = e.detail.avatarUrl; // 临时路径
    this.setData({
      avatarUrl: tempFilePath
    });
  },
  async goToEnroll(e) {
    const nickname = e.detail.value.nickname;
    if (nickname && this.data.avatarUrl) {
      const res = await wx.p.login();
      if (res.code) {
        // 将res.code发送到后端
        const uploadFileRes = await wx.p.uploadFile({
          url: `${this.data.basicUrl}/login/enroll`,
          filePath: this.data.avatarUrl,
          name: 'avatar',
          formData: {
            code: res.code,
            nickname: nickname
          }
        });
        if (uploadFileRes.statusCode == 200) {
          const res = uploadFileRes.data;
          const resobj = JSON.parse(res);
          this.getAuthorMessage(resobj.author);
          this.getToken(resobj.token);
          wx.switchTab({
            url: `/pages/my/my`,
          })
        } else {
          console.log('上传失败', uploadFileRes)
        }
      }
    }else{
      wx.showToast({
        title: '请填写数据',
        icon:'error'
      })
    }

  }
})