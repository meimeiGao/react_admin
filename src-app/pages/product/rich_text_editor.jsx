/*
	添加和修改商品的富文本组件
 */

import React,{Component} from 'react'
import { EditorState, convertToRaw,ContentState} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './css/rich_text_editor.less'

export default class RichTextEditor extends Component{
	
	constructor(props){
		super(props)
		const {detail} = this.props
		const contentBlock = htmlToDraft(detail);
		if (contentBlock) {
			const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
			const editorState = EditorState.createWithContent(contentState);
			this.state = {
				editorState,
			};
		}else{
			this.state = {
				editorState: EditorState.createEmpty(),
			}
		}
		
	}
	uploadImageCallBack=(file)=> {
		return new Promise(
			(resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.open('POST', '/manage/img/upload');
				xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
				const data = new FormData();
				data.append('image', file);
				xhr.send(data);
				xhr.addEventListener('load', () => {
					const response = JSON.parse(xhr.responseText);
					const url = response.data.url
					resolve({ data: { link:url} });
				});
				xhr.addEventListener('error', () => {
					const error = JSON.parse(xhr.responseText);
					reject(error);
				});
			}
		);

	}
	
	state = {
		editorState: EditorState.createEmpty(),
	}
	
	onEditorStateChange = (editorState) => {
		this.setState({
			editorState,
		});
	};
	
	getDetail = ()=>{
		const {editorState} = this.state
		return draftToHtml(convertToRaw(editorState.getCurrentContent()))
	}
	
	render() {
		const { editorState } = this.state;
		return (
			<Editor
				editorState={editorState}
				wrapperClassName="wrapper"
				editorClassName="rich_editor"
				onEditorStateChange={this.onEditorStateChange}
				toolbar={{
					image: {
						uploadCallback: this.uploadImageCallBack,
					},
				}}
			/>
		);
	}
}