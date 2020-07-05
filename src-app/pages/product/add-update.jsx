import React,{Component} from 'react'
import {
	Form,
	Card,
	Input,
	Button,
	Cascader,
	message
} from 'antd'
import LinkButton from '../../components/link-button'
import './css/add-update.less'
import {ArrowLeftOutlined} from '@ant-design/icons';
import {reqCategorys,reqAddOrUpdateProduct} from "../../api";
import PicturesWall from './picture_wall'
import RichTextEditor from './rich_text_editor'
import {ERROR_MESSAGE, SUCCESS_MESSAGE} from "../../utils/constants";

const { TextArea } = Input;
const { Item } = Form;

export default class ProductAddUpdate extends Component{
	formRef = React.createRef(); //创建表单的容器
	pw = React.createRef(); //创建图片的容器
	rte = React.createRef() //创建富文本编辑的容器
	state = {
		options:[],
		imgs:[],//商品图片列表
	}
	
	
	//初始化一级分类数据
	initOptions = async (categorys)=>{
		//根据category生成options
		let options = categorys.map(c=>({
			value: c._id,
			label: c.name,
			isLeaf: false,
		}))
		
		const {product,isUpdate} = this
		const {pCategoryId} = product
		var aa = (pCategoryId!=="0")
		if(isUpdate && pCategoryId!=='0'){
			//获取对应的二级分类列表
			const subCategorys = await this.getCategorys(pCategoryId)
			//把对应的二级分类列表转成对应的options
			const subOptions = subCategorys.map(c=>({
				value: c._id,
				label: c.name,
				isLeaf: true,
			}))
		
			const targetOption = options.find(option=>option.value===pCategoryId)
			targetOption.children = subOptions
		}
		
		this.setState({
			options
		})
	}
	
	//获取一级/二级分类
	getCategorys = async (parentId)=>{//async 函数默认返回一个新promise对象,promise 的结果和值由async的结果来决定
		const result = await reqCategorys(parentId)
		if(result.status===0){
			const categorys = result.data
			if(parentId==='0'){//获取一级分类列表
				this.initOptions(categorys)
			}else { //获取二级分类列表  当前async 函数返回的promise就会成功且value为categorys
				return categorys
			}
			
		}
		
	}
	
	//动态加载二级菜单
	loadData  = async selectedOptions => {
		const targetOption = selectedOptions[0];
		targetOption.loading = true;
		const subCategorys = await this.getCategorys(targetOption.value)
		targetOption.loading = false;
		
		if(subCategorys && subCategorys.length){//有二级分类
			const childrenOptions = subCategorys.map(c=>({
				value: c._id,
				label: c.name,
				isLeaf: true,
			}))
			targetOption.children=childrenOptions
		}else{ //没有二级分类
			targetOption.isLeaf = true
		}
		
		this.setState({
			options: [...this.state.options],
		});
	};
	
	//自定义验证价格
	validatePrice = (rule, value)=>{
		if(!value){
			return Promise.reject('商品价格必须输入')
		}else if(value*1 < 1){
			return Promise.reject('价格必须大于0') ;// 验证没通过
		} else {
			return Promise.resolve(); // 验证通过
		}
	}
	
	//自定验证商品分类
	validateCategoryIds = (rule, value)=>{
		if(value && value.length){
			return Promise.resolve(); // 验证通过
		}else{
			return Promise.reject('请指定商品分类')
		}
	}
	
	//自定义验证图处
	validateImgs =(rule, value)=>{
		if(!value || value.length===0){
			return Promise.reject('请上传商品图片')
		
		}else{
			return Promise.resolve(); // 验证通过
		}
	}
	
	//设置form表单的值  setFieldsValue
	setProductFieldsValue=(product)=>{
		
		if(this.isUpdate){
			const {pCategoryId,categoryId}= product
			this.formRef.current.setFieldsValue({
				name:product.name,
				desc:product.desc,
				price:product.price,
				categoryIds:[pCategoryId,categoryId],
				detail:product.detail
				
			});
		}
		
	}
	
	//提交表单事件
	onFinish = async (values)=>{
		
		//搜集数据
		const imgs = this.pw.current.getImgs()
		this.setState({imgs})
		const detail = this.rte.current.getDetail()
		
		const {name,price,desc,categoryIds} = values
		
		let pCategoryId ,categoryId
		if(categoryIds.length===1){
			 pCategoryId = '0'
			 categoryId =categoryIds[0]
		}else{
			 pCategoryId =categoryIds[0]
			 categoryId =categoryIds[1]
		}
		
		if(this.isUpdate){
			const {_id} = this.product
		}else{
			const _id = ''
		}
		
		const product = {name,price,desc,pCategoryId,categoryId ,imgs,detail}
		//发请求
		const result = await reqAddOrUpdateProduct(product)
		
		if(result.status === 0){
			message.success(SUCCESS_MESSAGE)
			this.props.history.goBack()
		}else {
			message.error(ERROR_MESSAGE)
		}
		
	}
	
	componentWillUpdate(nextProps, nextState, nextContext) {
		var aa = this.formRef.current.getFieldValue('imgs')
	}
	
	componentWillMount() {
		const {product} = this.props.location.state
		this.isUpdate = !!product //两个!! 是强行转成boolean
		this.product = product || {}
	}
	
	componentDidMount() {
		this.getCategorys('0')
		this.setProductFieldsValue(this.product)
	}
	
	render(){
  	const detail = this.product.detail || ''
		const layout = {
			labelCol: { span: 2 },
			wrapperCol: { span: 8 },
		}
  
		const title =(
			<span>
				<LinkButton>
					<ArrowLeftOutlined className='arrow_left' onClick={()=>this.props.history.goBack()}/>
				</LinkButton>
				<span className='title'>{this.isUpdate?'修改商品':'添加商品'}</span>
			</span>
		)
    return(
      <Card title={title} className='add_update_card'>
				
        <Form {...layout} ref={this.formRef} onFinish={this.onFinish}>
					
					<Item
						label="商品名称"
						name='name'
						rules={[
							{ required: true ,message:'商品名称为必填项'},
							{ max:'10',message:'超出限制长度'}
							]}
					>
						<Input placeholder='请输入商品名称'/>
					</Item>
					
					<Item
						label="商品描述"
						name='desc'
						rules={[
							{ required: true ,message:'商品描述为必填项'},
							{ max:1000,message:'超出限制长度'}
						]}
					>{/* autoSize={{ minRows: 2, maxRows: 6 }}*/}
						<TextArea placeholder='请输入商品描述' />
					</Item>
					
					<Item
						label="商品价格"
						name='price'
						rules={[
							{ required: true ,validator:this.validatePrice},
						]}
					>
						<Input addonAfter="元" placeholder='请输入商品价格' type='number'/>
					</Item>
					
					<Item label="商品分类"
						name='categoryIds'
						rules={[
							{ required: true ,validator:this.validateCategoryIds},
						]}
					>
						<Cascader
							placeholder='请指定商品分类'
							options={this.state.options}
							loadData={this.loadData}
						/>
					</Item>
					
					<Item label="商品图片"
						name='imgs'
					
					>{/*	rules={[
							{ required: true ,validator:this.validateImgs},
						]}
						
						<PicturesWall ref={this.pw} setImgs={(fileList)=>{
							this.formRef.current.setFieldsValue({imgs:fileList})
						}}
						*/}
						<PicturesWall ref={this.pw} setImgs={(fileList)=>this.state.imgs= fileList} imgs={this.product.imgs}/>
		
					</Item>
					
					<Item label="商品详情" name='detail' labelCol={{ span: 2 }} wrapperCol={{ span: 20 }} >
						<RichTextEditor ref={this.rte} detail={detail}/>
					</Item>
					
					<Item>
						<Button type='primary' htmlType="submit">
							提交
						</Button>
					</Item>
					
        </Form>
				
      </Card>
    )
  }
}
