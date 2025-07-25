// pages/secondaryPages/worksManagement/worksManagement.js
import {
  createStoreBindings
} from 'mobx-miniprogram-bindings';
import {
  store
} from '../../../store/store';
Page({
  data: {
    system: {},
    listData: [{
      id: 1,
      name: '功能1',
      type: 'type1'
    },
    {
      id: 2,
      name: '功能2',
      type: 'type2'
    }
  ]
  },
  onLoad(options) {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['author', 'token']
    })   
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.storeBindings.destroyStoreBindings();
  },  
})