/*
要求:能根据接口文档定义接口请求
包含应用中所有接口请求的模块
每个函数的返回值都是promise
 */
import {message} from "antd";
import ajax from './ajax'
import json from 'jsonp'


const BASE = ''
//登录
const login_url = '/login'
//获取一级/二级分类
const category_list = '/manage/category/list'
//添加分类
const add_category = '/manage/category/add'
//修改分类
const update_category = '/manage/category/update'
//商品一般列表
const products_list = '/manage/product/list'
//搜索分类列表
const search_products_list = '/manage/product/search'
//根据分类id获取分类
const category_by_categoryId = '/manage/category/info'
//对商品进行上架/下架处理
const update_product_status = '/manage/product/updateStatus'
//添加/修改商品
const add_or_update_product = '/manage/product/'
//删除图片
const delete_img = '/manage/img/delete'
//角色列表
const roles_list = 'manage/role/list'
//添加角色
const add_role = '/manage/role/add'
//修改用户
const update_role = '/manage/role/update'
//用户列表
const user_list = '/manage/user/list'
//删除用户
const delete_user = '/manage/user/delete'
//添加用户
const add_user = '/manage/user/add'
//修改用户
const update_user = '/manage/user/update'


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

//添加/修改用户
export const reqAddOrUpdateUser = (user) => ajax(BASE +(user._id?update_user:add_user), user, 'POST')

//获取一级/二级分类   不写类型默认是GET请求
export const reqCategorys = (parentId) => ajax(BASE + category_list, {parentId})

//添加分类  参数传两个,分别传
export const reqAddCategory = (parentId, categoryName) => ajax(BASE + add_category, {parentId, categoryName}, "POST")

//修改分类   参数传一个分类对象,对象必须包含parentId,categoryName 这两个属性,然后解构出来
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax(BASE + update_category, {
	categoryId,
	categoryName
}, "POST")

//获取商品列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + products_list, {
	pageNum,
	pageSize
})

//搜索分面列表  通过对象这种传参的方式要求参数名要一致
export const reqSearchProducts = ({pageNum, pageSize, productType, searchName}) => ajax(BASE + search_products_list, {
	pageNum,
	pageSize,
	[productType]: searchName
})

//根据分类ID获取分类
export const reqCategory = (categoryId) => ajax(BASE + category_by_categoryId, {categoryId})

//对商品进行上架/下架处理   通过多个参数这种传参的方式要求参数的顺序要一致
export const reqUpdateStatus = (productId, status) => ajax(BASE + update_product_status, {productId, status}, "POST")

//删除图片
export const reqDeleteImg = (name) => ajax(BASE + delete_img, {name}, "POST")

//添加/修改商品  这种要求product是个对象
export const reqAddOrUpdateProduct = (product) => ajax(BASE + `${add_or_update_product}${product._id ? 'update' : 'add'}`, product, 'POST')

//获取roels列表
export const reqRoles = () => ajax(BASE + roles_list)

//添加角色  /manage/role/add
export const reqAddRole = (roleName) => ajax(BASE + add_role, {roleName}, "POST")

//修改角色
export const reqUpdateRole = (role) => ajax(BASE + update_role, role, "POST")

//用户列表
export const reqUsers = ()=>ajax(BASE+user_list)

//删除用户
export const reqDeleteUser =(user)=>ajax(BASE+delete_user,{user},'POST')


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

