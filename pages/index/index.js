// index.js
import {
  createStoreBindings
} from 'mobx-miniprogram-bindings';
import {
  store
} from '../../store/store';

Page({
  data: {
    system: {},
    capsule: {},
    listItem: ["全部", "产品展示", "建筑漫游", "室内漫游", "自然空间"],
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
  onLoad: function () {
    //向后端发送get请求，获取作品数据
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
  }, 
  onUnload: function () {
    this.storeBindings.destroyStoreBindings();
  },
  toDetail(e) {
    const type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `/packageWorkDetail/pages/detail/detail?type=${type}`,
    })
  }
})