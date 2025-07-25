// pages/authors/authors.js
import {
  createStoreBindings
} from 'mobx-miniprogram-bindings';
import {
  store
} from '../../store/store';
import referenceData from '../../config/referenceData';
Page({

  data: {
    system: {},
    capsule: {},
    listItem: ["综合排名", "技能排名", "作品排名"],
    authorsList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
 async onLoad(options) { 
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['windowInfo', 'capsule'],
      actions: ['getSystemMessage']
    })
    // 获取系统信息&获取胶囊信息
    this.getSystemMessage();
    this.setData({
      system: store.windowInfo,
      capsule: store.capsule
    });
    const authorRes=await wx.p.request({
      url: `${referenceData.BasicUrl}/author`,
    });
    if(authorRes.statusCode==200){
      if(authorRes.data.lenght!==0){
        this.setData({
          authorsList:authorRes.data
        });
      }
    }else{
      wx.showToast({
        title: '服务器错误',
      })
    }
  },
  onReady(){

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.storeBindings.destroyStoreBindings();
  },
})