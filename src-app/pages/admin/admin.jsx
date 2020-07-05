import React,{Component} from 'react'
import {Redirect,Route,Switch} from 'react-router-dom'
import { Layout } from 'antd';

import memoryUtils from "../../utils/memoryUtils";
import './admin.less'
/*
后台管理的路由组件
 */


import loadable from '../../utils/loadable'
const LeftNav = loadable(()=>import('../../components/left-nav'))
const MyHeader = loadable(()=>import('../../components/header'))
const Home = loadable(()=>import('../home/home'))
const Category = loadable(()=>import('../category/category'))
const Product = loadable(()=>import('../product/product'))
const User = loadable(()=>import('../user/user'))
const Role = loadable(()=>import('../role/role'))
const Bar = loadable(()=>import('../charts/bar'))
const Line = loadable(()=>import('../charts/line'))
const Pie = loadable(()=>import('../charts/pie'))



/*import LeftNav from '../../components/left-nav'
import MyHeader from '../../components/header'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import User from '../user/user'
import Role from '../role/role'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'*/

const { Header, Footer, Sider, Content } = Layout;
export default class Admin extends Component{
  
  render(){
    const user = memoryUtils.user
    if(!user || !user._id){
      //自动跳转到登录(在render()中)
      return <Redirect to='/login'/>
    }
    return(
      <Layout className='container'>
        <Sider>
          <LeftNav />
        </Sider>
        <Layout className='content'>
          <Header>
            <MyHeader />
          </Header>
          <Content className='content-main'>
            <Switch>
              <Route path='/home' component={Home} />
              <Route path='/category' component={Category}/>
              <Route path='/product' component={Product} />
              <Route path='/user' component={User} />
              <Route path='/role' component={Role} />
              <Route path='/charts/bar' component={Bar} />
              <Route path='/charts/line' component={Line}/>
              <Route path='/charts/pie' component={Pie}/>
              <Redirect to='/home' />
            </Switch>
          </Content>
          <Footer>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
        </Layout>
      </Layout>
    )
  }
}
