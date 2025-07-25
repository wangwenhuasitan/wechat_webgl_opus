// pages/secondaryPages/uploadOpus/uploadOpus.js
import {
  createStoreBindings
} from 'mobx-miniprogram-bindings';
import {
  store
} from '../../../store/store';
import referenceData from '../../../config/referenceData';
Page({
  data: {
    typeArray: ['产品展示', '建筑漫游', '自然环境', '室内空间'],
    opusType: 0,
    jsfileList: [],
    modelfileList: [],
    resourcefileList: [],
    thumbnailfileList: [],
  },
  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['author', 'token']
    })
    console.log(store.author.authorId)
  },
  onUnload: function () {
    this.storeBindings.destroyStoreBindings();
  },
  changeType(e) {
    this.setData({
      opusType: e.detail.value
    });
  },
  resourceafterRead(event) {
    const {
      file
    } = event.detail;
    this.setData({
      resourcefileList: file
    })
  },
  deleteJS(e) {
    const index = e.detail.index;
    const {
      jsfileList
    } = this.data;
    jsfileList.splice(index, 1);
    this.setData({
      jsfileList
    })
  },
  deleteModel(e) {
    const index = e.detail.index;
    const {
      modelfileList
    } = this.data;
    modelfileList.splice(index, 1);
    this.setData({
      modelfileList
    })
  },
  deleteThumbnail(e) {
    const index = e.detail.index;
    const {
      thumbnailfileList
    } = this.data;
    thumbnailfileList.splice(index, 1);
    this.setData({
      thumbnailfileList
    })
  },
  deleteResource(e) {
    const index = e.detail.index;
    const {
      resourcefileList
    } = this.data;
    resourcefileList.splice(index, 1);
    this.setData({
      resourcefileList
    })
  },
  uploadJs() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success: (res) => {
        const file = res.tempFiles[0]
        this.setData({
          jsfileList: [file]
        })
      }
    })
  },
  uploadModel() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success: (res) => {
        const file = res.tempFiles[0]
        this.setData({
          modelfileList: [file]
        })
      }
    })
  },
  uploadResource() {
    wx.chooseMessageFile({
      count: 100,
      type: 'all',
      success: (res) => {
        const file = res.tempFiles
        const target = file.map((item, index) => {
          return {
            url: item.path,
            ...item
          }
        })
        this.setData({
          resourcefileList: target
        })
      }
    })
  },
  uploadThumbnail() {
    wx.chooseMessageFile({
      count: 1,
      type: 'image',
      success: (res) => {
        const file = res.tempFiles[0]
        const merge = {
          url: file.path,
          ...file
        }
        this.setData({
          thumbnailfileList: [merge]
        })
      }
    })
  },
  async goToUpload(e) {
    //在oss中创建文件夹
    const resourceFolder = await wx.p.request({
      url: `${referenceData.BasicUrl}/opus/createFolder`,
      method:'POST',
      data:{authorId:store.author.authorId}
    });
    if (resourceFolder.statusCode !== 200) {
      console.log('创建文件夹失败')
      return;
    };
    //收集数据开始上传
    const {
      resourceFolderName
    } = resourceFolder.data;
    const {
      title,
      descriptionOfTheWork,
      techStack
    } = e.detail.value;
    let opusType = e.detail.value.opusType + 1;
    const {
      jsfileList,
      modelfileList,
      thumbnailfileList,
      resourcefileList
    } = this.data;
    const handlerList = [];
    const uploadJs = new Promise((resolve, reject) => {
      wx.uploadFile({
        url: `${referenceData.BasicUrl}/opus/uploadOpus`,
        filePath: `${jsfileList[0].path}`,
        name: 'three',
        formData: { 
          authorId: store.author.authorId ,         
          originalname: jsfileList[0].name
        },
        success: resolve,
        fail: reject
      });
    })
    handlerList.push(uploadJs);
    const uploadModel = new Promise((resolve, reject) => {
      wx.uploadFile({
        url: `${referenceData.BasicUrl}/opus/uploadOpus`,
        filePath: `${modelfileList[0].path}`,
        name: 'model',
        formData: {
          originalname: modelfileList[0].name,
          resourceFolderName
        },
        success: resolve,
        fail: reject
      });
    })
    handlerList.push(uploadModel);
    const uploadThumbnail = new Promise((resolve, reject) => {
      wx.uploadFile({
        url: `${referenceData.BasicUrl}/opus/uploadOpus`,
        filePath: `${thumbnailfileList[0].url}`,
        name: 'thumbnail',
        formData: {  
          authorId: store.author.authorId ,      
          originalname: thumbnailfileList[0].name,         
        },
        success: resolve,
        fail: reject
      });
    })
    handlerList.push(uploadThumbnail);
    const uploadResource = resourcefileList.map(filePath => {
      return new Promise((resolve, reject) => {
        wx.uploadFile({
          filePath: `${filePath.url}`,
          name: 'resource',
          url: `${referenceData.BasicUrl}/opus/uploadOpus`,
          formData: {
            originalname: filePath.name,
            resourceFolderName
          },
          success: resolve,
          fail: reject
        })
      })
    });
    const results = await Promise.all([...handlerList, ...uploadResource]) 
    if (results.length == 0) {
      console.log('上传失败');
      return;
    };
    const opusDetail = {
      title,
      descriptionOfTheWork,
      typeId: opusType,
      techStack,
      thumbnailUrl: '',
      modelUrl: '',
      authorId: store.author.authorId,
      workUrl: ''
    };
    results.map((item, index) => {
      const urls=JSON.parse(item.data);
      switch (urls.name) {
        case 'JavaScript':
          opusDetail.workUrl = urls.url;
          break;
        case 'Resource':
          opusDetail.modelUrl = urls.url;
          break;
        case 'Thumbnail':
          opusDetail.thumbnailUrl = urls.url;
          break;       
      }
    })
    //上传完成，删除临时文件
    const deleteFiles = await wx.p.request({
      url: `${referenceData.BasicUrl}/opus/deleteFiles`,
      method: 'POST',
      data: opusDetail
    });
    if (deleteFiles.statusCode !== 200) {
      console.log('删除文件失败')
      return;
    };
    console.log('删除临时文件完成');
  }
})