// pages/serviceCenter/serviceCenter.js
import referenceData from '../../config/referenceData';
Page({

  data: {
    listItem: ["帮助文档", "用户反馈"],
    fileList: [],
    activeNames: ['1'],
    flag: false,     
    activeIndex: 0
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  onTabItemClick(e) {   
    const index = e.currentTarget.dataset.index;
    this.setData({
      flag: !this.data.flag,
      activeIndex: index
    })
  },
  afterRead(event) {
    const {file} = event.detail; 
    
    console.log(file)  
    this.setData({
      fileList: [file]
    });     
  },
  deleteSelected(e){
const index= e.detail.index;
 const {fileList}=this.data;
 fileList.splice(0,1);
 this.setData({
  fileList
 })
  },
  //用户反馈接口
  goToFeedback(e){
const {title,content}=e.detail.value;
    wx.uploadFile({
      url: `${referenceData.BasicUrl}/feedback/create`, 
      filePath: this.data.fileList[0].tempFilePath,
      name: 'referenceImage',
      formData: {
        title,
        content
      },
      success(res) {
        console.log(res)
      },
      fail(err){
        console.log(err)
      }
    });
  },
})