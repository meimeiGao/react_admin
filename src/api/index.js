/*
要求:能根据接口文档定义接口请求
包含应用中所有接口请求的模块
每个函数的返回值都是promise
 */

import ajax from './ajax'

const BASE = ''
//方法一  (统一暴露)
/*export default {
  xx(){
  
  },
  yy(){
  
  }
  
}*/


//方法二  (分别暴露)
//登录
/*export function reqLogin(username, password) {
  return ajax('/login', {username, password}, 'POST')
}*/


//登录
export const reqLogin = (username, password) => ajax(BASE+'/login', {username, password}, 'POST')

//添加用户
export const reqAddUser = (user)=>ajax(BASE+'/manage/user/add', user, 'POST')