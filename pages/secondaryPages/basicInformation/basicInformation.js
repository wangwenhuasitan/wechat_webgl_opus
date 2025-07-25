// pages/basicInformation/basicInformation.js
import {
  createStoreBindings
} from 'mobx-miniprogram-bindings';
import {
  store
} from '../../../store/store';
import referenceData from '../../../config/referenceData';
Page({

  data: {
    biography: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['windowInfo', 'capsule', 'author', 'token'],
      actions: ['getSystemMessage','getAuthorMessage']
    })
    // 获取系统信息&获取胶囊信息
    this.getSystemMessage();
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.storeBindings.destroyStoreBindings();
  },
  async goToRevise(e) {   
    const ReviseRes=await wx.p.request({
      url: `${referenceData.BasicUrl}/author/reviseBiography`,
      method:'POST',
      header:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.data.token}`
      },
      data:{
        biography:this.data.biography
      }
    })
    if(ReviseRes.data){      
      this.getAuthorMessage(ReviseRes.data.author);
      wx.showToast({
        title: '修改成功',
        icon:"success"
      })
    }
  },
  getInput(e) {
    this.setData({
      biography: e.detail.value
    })
  }
})