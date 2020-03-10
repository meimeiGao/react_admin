/*
进行local数据存储管理的工具模块
 */

/*
  原生的localStorage可以有存在兼容性问题,所以使用库store,在github 上搜索store,
  使用 marcuswestin/store.js这个库,解决浏览器的兼容性问题,而且使编码更加简洁

 */

import store from 'store'
const USER_KEY = 'user_key'
export default {
  /*
  保存user
   */
  
  saveUser(user){
    // localStorage.setItem(USER_KEY,JSON.stringify(user))
    store.set(USER_KEY, user)
  },
  
  /*
  读取user
   */
  
  getUser(){
    // return JSON.parse(localStorage.getItem(USER_KEY) || "{}")
    return store.get(USER_KEY)
  },
  
  /*
  删除user
   */
  removeUser(){
    // localStorage.removeItem(USER_KEY)
    store.remove(USER_KEY)
  }
}