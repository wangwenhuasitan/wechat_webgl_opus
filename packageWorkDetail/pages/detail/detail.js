// packageWorkDetail/pages/detail/detail.js
// 定义一个类加载器对象，存储所有可能的类
const classLoader = {
  type1: require('../../utils/vrhall.js'),
  type2: require('../../utils/vrhall2.js')  
};

Page({

  data: {
    vr_platform: null,
    vr: null,
    instance: null,
    type: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('导入的内容:');
    const type = options.type;
    this.setData({ type });
     // 动态加载对应的类并实例化
     if (classLoader[type]) {
      const InstanceClass = classLoader[type];
      const instance = InstanceClass.__esModule ? InstanceClass.VRHall || InstanceClass.default : InstanceClass;
      // const instance = new Constructor();
      this.setData({ instance });
      console.log(instance);
  
      // 可以在这里调用实例的方法或进行其他操作
      // instance.someMethod();
    } else {
      console.error(`未找到类型为 ${type} 的类`);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  async onReady() {
    wx.createSelectorQuery().select('#gl').node().exec((res) => {
      const canvas = res[0].node;    
      this.vr = new this.data.instance({
        container: canvas
      })
      this.vr.loadScene({
        url: "https://webgl-resource.oss-cn-beijing.aliyuncs.com/vrhall/gltf_room.gltf", 
        onProgress: (p) => {
          // console.log(p);
        },
        floorName: "地面"
      });
      this.vr_platform = this.vr.wechatPlatform
    })
  },
  onTouchStart(e) {
    // this.vr.pickEvent(e);
    this.vr_platform.dispatchTouchEvent(e)
  },
  onTouchEnd(e) {
    this.vr_platform.dispatchTouchEvent(e)
  },
  onTouchMove(e) {
    // this.vr.pickEvent(e);
    this.vr_platform.dispatchTouchEvent(e)
  },
  onTap(e) {
    this.vr.pickEvent(e);
    this.vr_platform.dispatchTouchEvent(e)
  },
  onLongpress(e) {
    this.vr.pickEvent(e);
    this.vr_platform.dispatchTouchEvent(e)
  }, 
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },
})