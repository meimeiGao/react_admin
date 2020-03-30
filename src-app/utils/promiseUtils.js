
import {message} from "antd";

export function formatPromise(promise) {
   return new Promise((resolve,reject)=>{
      // 2.请求成功时
     promise.then((response)=>{
        resolve(response)
      // 3. 请求出错时,不调用reject(reason),而是提示异常信息
    }).catch(err=>{
      //reject(error)  不能这样写,如果这样写会调用catch,就等于白瞎了
        message.error('验证不通过')
    })
    
  })
  
}