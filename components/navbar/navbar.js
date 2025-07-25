// components/navbar/navbar.js
/**
   * 实现思路
   * 自定义对外属性：高度和padding属性，通过外部传入来决定组件样式。
   * 设置一个插槽，允许外部放置内容元素。
   */
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {    
    navbarHeight:null,
    paddingTop:null,
    paddingLeft:null,
    paddingRight:null,   
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  lifetimes:{
    created(){      
    // 获取系统信息&获取胶囊信息
    const getSystem=wx.getWindowInfo();
    const getCapsule=wx.getMenuButtonBoundingClientRect();
    this.setData({      
      navbarHeight:(getCapsule.top-getSystem.statusBarHeight)*2+getCapsule.height,//capsule的上边距与下边距再加上capsule自身高度正好等于导航栏高度。
      paddingTop:getCapsule.top-getSystem.statusBarHeight,
      paddingLeft:getSystem.windowWidth-getCapsule.right,//屏幕宽度减去capsule右边距，这样可以使左右空白一样宽。
      paddingRight:(getSystem.windowWidth-getCapsule.right)*2+getCapsule.width,//capsule宽度加上两个相等的空白可以与其它元素保持同宽。      
    }); 
    }
  }
})
