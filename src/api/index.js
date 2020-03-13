/*
要求:能根据接口文档定义接口请求
包含应用中所有接口请求的模块
每个函数的返回值都是promise
 */
import {message} from "antd";
import ajax from './ajax'
import json from 'jsonp'

//登录
const login_url = '/login'
//添加用户
const add_user_url = '/manage/user/add'
//获取一级/二级分类
const category_list = '/manage/category/list'
//添加分类
const add_category = '/manage/category/add'
//修改分类
const update_category = '/manage/category/update'

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
export const reqLogin = (username, password) => ajax(BASE + login_url, {username, password}, 'POST')

//添加用户
export const reqAddUser = (user) => ajax(BASE + add_user_url, user, 'POST')

//获取一级/二级分类   不写类型默认是GET请求
export const reqCategorys = (parentId) => ajax(BASE + category_list, {parentId})

//添加分类  参数传两个,分别传
export const reqAddCategory = (parentId, categoryName) => ajax(BASE + add_category, {parentId, categoryName}, "POST")

//修改分类   参数传一个分类对象,对象必须包含parentId,categoryName 这两个属性,然后解构出来
export const reqUpdateCategory = ({parentId, categoryName}) => ajax(BASE + update_category, {
  parentId,
  categoryName
}, "POST")


//json请求的接口请求函数
export const reqWeather = (city) => {
  
  return new Promise((resolve, reject) => {
    const weather_url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    json(weather_url, {}, (err, data) => {
      if (!err && data.status === 'success') {
        const {dayPictureUrl, weather} = data.results[0].weather_data[0]
        resolve({dayPictureUrl, weather})
      } else {
        message.error('获取天气预报出错了')
      }
    })
    
  })
}

