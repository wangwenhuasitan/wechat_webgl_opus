// pages/my/my.js
import {
  createStoreBindings
} from 'mobx-miniprogram-bindings';
import {
  store
} from '../../store/store';
Page({
 
  data: {
    system: {},
    capsule: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['windowInfo', 'capsule','author','token'],
      actions: ['getSystemMessage']
    })
    // 获取系统信息&获取胶囊信息
    this.getSystemMessage();
    this.setData({
      system: store.windowInfo,
      capsule: store.capsule
    });
  },
  onUnload: function () {
    this.storeBindings.destroyStoreBindings();
  },
  toLogin(e) {
    const type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `/pages/secondaryPages/login/login?type=${type}`,
    })
  },
  goToBasicInformation(){
    wx.navigateTo({
      url: `/pages/secondaryPages/basicInformation/basicInformation`,
    })
  }
})