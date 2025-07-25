// pages/login/login.js
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
  async goToLogin() {
    const res = await wx.p.login();
    if (res.code) {
      // 将res.code发送到后端
      const loginRes = await wx.p.request({
        method: 'POST',
        url: `${this.data.basicUrl}/login/login`,
        data: {
          code: res.code
        }
      })
      if (loginRes.statusCode == 200) {
        const res = loginRes.data;       
        if (res.length!=0) {          
          this.getAuthorMessage(res.author);
          this.getToken(res.token);
          wx.switchTab({
            url: `/pages/my/my`,
          })
        }else {          
          wx.navigateTo({
            url: '/pages/secondaryPages/enroll/enroll',
          })
        }
      }     
    }
  }
})