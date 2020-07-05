import React, {Component} from 'react'
/*
	图片上传
 */

import {Upload, Modal, message} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {SUCCESS_MESSAGE, ERROR_MESSAGE,UPLOAD_IMG_URL} from "../../utils/constants";
import PropTypes from 'prop-types'
import {reqDeleteImg} from '../../api'
import {BASE_IMG_URL} from '../../utils/constants'

export default class PicturesWall extends React.Component {
	constructor(props){
		super(props)
		let fileList = []
		const {imgs} = this.props
		
		if(imgs && imgs.length > 0){
			fileList = imgs.map((img,index)=>({
				uid: -index,      // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
				name: img,   // 文件名
				status: 'done', // 状态有：uploading done error removed
				url:BASE_IMG_URL+img //图片地址
			}))
		}
		this.state = {
			previewVisible: false, //modal显示与隐藏
			previewImage: '', //modal的图片
			fileList, //图片列表
		};
		
	}
	state = {
		previewVisible: false, //modal显示与隐藏
		previewImage: '', //modal的图片
		fileList: [], //图片列表
	};
	
	static propTypes = {
		setImgs: PropTypes.func.isRequired,
		imgs:PropTypes.array
	}
	
	componentWillUpdate(nextProps, nextState, nextContext) {
		this.props.setImgs(nextState.fileList)
	}
	
	componentWillMount() {

	}
	
	componentDidMount() {
	}
	
	
	getBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = error => reject(error);
		});
	}
	
	//获取图片name的数组
	getImgs = () => {
		return this.state.fileList.map(file => file.name)
	}
	
	//隐藏Modal
	handleCancel = () => this.setState({previewVisible: false});
	
	//显示Modal
	handlePreview = async file => {
		if (!file.url && !file.preview) {
			file.preview = await this.getBase64(file.originFileObj);
		}
		
		this.setState({
			previewImage: file.url || file.preview,
			previewVisible: true,
		});
	};
	
	//上传/删除图片
	handleChange = async ({file, fileList}) => {
		if (file.status === 'done') {
			
			const reslut = file.response
			if (reslut.status === 0) {
				file = fileList[fileList.length - 1]
				const {name, url} = reslut.data
				file.name = name
				file.url = url
				message.success(SUCCESS_MESSAGE)
			} else if (file.status === 'error') {
				message.error(ERROR_MESSAGE)
			}
			
		}else if(file.status==='removed'){
			
			const result = await reqDeleteImg(file.name)
			if(result.status===0){
				message.success(SUCCESS_MESSAGE)
			}else{
				message.error(ERROR_MESSAGE)
			}
		
		}
		this.setState({fileList})
		this.props.setImgs(this.state.fileList)
	};
	
	render() {
		const {previewVisible, previewImage, fileList} = this.state;
		const uploadButton = (
			<div>
				<PlusOutlined/>
				<div className="ant-upload-text">Upload</div>
			</div>
		);
		return (
			<div>
				<Upload
					accept='image/*' /*限制上传的格式*/
					action={UPLOAD_IMG_URL}/*上传图片的地址*/
					name='image'/*上传的参数名*/
					listType="picture-card"/*卡片样式*/
					fileList={fileList}/*所有已上传的数组对象*/
					onPreview={this.handlePreview}
					onChange={this.handleChange}
				>
					{fileList.length >= 8 ? null : uploadButton}
				</Upload>
				<Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
					<img alt="example" style={{width: '100%'}} src={previewImage}/>
				</Modal>
			</div>
		);
	}
}
