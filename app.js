// app.js
import {
  promisifyAll
} from 'miniprogram-api-promise';
const wxp = wx.p = {};
// promisifyAll(wx, wxp);
App({
  onLaunch() {
    promisifyAll(wx, wxp);
  },
  globalData: {
    userInfo: null
  }
})