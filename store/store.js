import {
  observable,
  action
} from 'mobx-miniprogram';
export const store = observable({
  windowInfo: {},
  capsule: {},
  author: {},
  token:'',
  getSystemMessage: action(function () {
    this.windowInfo = wx.getWindowInfo();
    this.capsule = wx.getMenuButtonBoundingClientRect()
  }),
  getAuthorMessage: action(function (data) {
    this.author = data;    
  }),
  getToken:action(function(token){
    this.token=token;
  })
});