import React,{Component} from 'react'
import {withRouter} from 'react-router-dom'
import { Modal ,message } from 'antd';


import './index.less'
import {formatDate} from '../../utils/dateUtils'
import {reqWeather} from '../../api/index'
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import LinkButton from '../link-button'
const { confirm } = Modal;

class Header extends Component{
  
  //状态
  state={
    dayPictureUrl:'',
    weather:'',
    currentDate:formatDate(Date.now())
  }
  
  //获取当前的时间
  getTime = ()=>{
    this.intervalId = setTimeout(()=>{
      const currentDate = formatDate(Date.now())
      this.setState({currentDate})
    },1000)
  }
  
  //获取天气
  getWeather = async ()=>{
    const {dayPictureUrl,weather} = await reqWeather('深圳')
    this.setState({dayPictureUrl,weather})
  }
  
  //获取标题
  getTitle = ()=>{
    //获取当前请求的路径
    const path = this.props.location.pathname
    let title = ''
    
    menuList.forEach(item=>{
      if(item.key===path){
        title = item.title
      }else if(item.children){
        const cItem = item.children.find(cItem=>{
          return cItem.key === path
        })
        if(cItem){
          title = cItem.title
        }
      }
    })
    return title
  }
  
  //退出登录
  logout = ()=>{
    confirm({
      content: '确定登出吗?',
      onOk:()=> {
        storageUtils.removeUser()
        memoryUtils.user = {}
        this.props.history.replace('/login')
        message.success('退出成功')
      },
      onCancel() {},
    });
  }
  //这在第一次render()之后执行,通常在此启用定时器/发ajax请求
  componentDidMount() {
    //获取当前时间
    this.getTime()
    //获取天气
    this.getWeather()
  }
  
  componentWillUnmount() {
    clearInterval(this.intervalId)
  }
  
  render(){
    const {dayPictureUrl , weather , currentDate } = this.state
    const username = memoryUtils.user.username
    const title = this.getTitle()
    return(
      <div className='header'>
        <div className='header-top'>
          <span>欢迎,{username}</span>
          <LinkButton onClick={this.logout}>登出</LinkButton>
        </div>
        <div className='header-bottom'>
          <div className='header-bottom-left'>{title}</div>
          <div className='header-bottom-right'>
            <span>{currentDate}</span>
            <img src={dayPictureUrl} alt="weather"/>
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)
