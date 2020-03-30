import React,{Component} from 'react'
import {Link,withRouter} from 'react-router-dom'
import { Menu} from 'antd';
import {
  PieChartOutlined,
  DesktopOutlined,
} from '@ant-design/icons';


import './index.less'
import logo from "../../assets/images/logo.png";
import menuList from "../../config/menuConfig"
import memoryUtils from '../../utils/memoryUtils'


const { SubMenu } = Menu;


class LeftNav extends Component{
  
  //判断当前用户是否包含item权限
  hasAuth = (item)=>{
    /*
      1.如果当前用户是admin是则为true
      2.如果当前key包含isPublic 是则为true
      3.当用户的menus里是否包含当前key.是则为true
          -- 是则为true
          -- 否
            如果menus 包含item 的children 的key 则为true
     */
    
    const key = item.key
    const menus = memoryUtils.user.role.menus
    const username = memoryUtils.user.username
    
    if(item.isPublic || username==='admin' || menus.indexOf(key)!==-1){
      return true
    }else if(item.children){ //
      return !!item.children.find(child=>menus.indexOf(child.key)!==-1)
    }
    
    return false
  }
  /*
    根据menu的数据数组生成对应的标签数组
    使用map()+递归调用
   */
  getMenuNodes_map = (menuList)=>{
    return menuList.map(item=>{
      if(!item.children){
        return (
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <PieChartOutlined />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        )
      }else{
        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                <DesktopOutlined />
                <span>{item.title}</span>
              </span>
            }
          >
            {this.getMenuNodes(item.children)}
          </SubMenu>
        )
      }
    })
  }
  /*
    根据menu的数据数组生成对应的标签数组
    使用reduce()+递归调用
   */
  getMenuNodes = (menuList)=>{
    const path = this.props.location.pathname
    return menuList.reduce((pre,item)=>{
      //向pre添加<Menu.Item>
      if(this.hasAuth(item)){
      // if(true){
        if(!item.children){
          pre.push( (
            <Menu.Item key={item.key}>
              <Link to={item.key}>
                <PieChartOutlined />
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          ))
        }else{
          //查找一个与当前请求路径匹配的子Item
          const cItem = item.children.find(cItem=>path.indexOf(cItem.key)===0)
          if(cItem){
            this.openKey = item.key
            // this.selectKey =cItem.key
          }
          console.log(item)
          pre.push((
            <SubMenu
              key={item.key}
              title={
                <span>
                <DesktopOutlined />
                <span>{item.title}</span>
              </span>
              }
            >
              {this.getMenuNodes(item.children)}
            </SubMenu>
          ))
        }
      }
      return pre
    },[])
  }
  
  /*
    在第一次render()之前执行一次
    为第一次render()准备数据(必须是同步)
   */
  componentWillMount() {
    this.menuNodes = this.getMenuNodes(menuList)

  }
	

	
	render(){
  
    //得到当前请求的路由路径
    let path = this.props.location.pathname
    // let path = this.selectKey
    //需要打开菜单项的key
    const openKey = this.openKey
    // if(path.indexOf(openKey)===0){
    //   path = openKey
    // }
    return(
      <div className='left-nav'>
        <Link to='/' className='left-nav-header'>
          <img src={logo} alt="logo"/>
          <h1>后台系统</h1>
        </Link>
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
        >
          {this.menuNodes}
        </Menu>
        
      </div>
    )
  }
}
/*
  withRouter高阶组件:
  包装非路由组件,返回一个新的组件
  新的组件向非路由组件传递3个属性:history/location/match
 */
export default withRouter(LeftNav)
