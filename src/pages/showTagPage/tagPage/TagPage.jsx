import Taro,{ Component } from '@tarojs/taro'
import { Block, Button, View, Image } from '@tarojs/components'
import { AtModal, AtModalHeader, AtModalAction, AtModalContent, AtInput, AtToast } from "taro-ui"
import URL from '../../../common/urls'
import tag2 from '../../../assets/tag2.png'
import tag1 from '../../../assets/tag1.png'
import showToast from '../../../assets/show_toast.png'
import addTag from '../../../assets/add_tag.png'
import deletTag from '../../../assets/delet_tag.png'
import {db} from '../../../service/api'
import './TagPage.scss'

export default class TagPage extends Component{

    state={
        currentTagList:[],
        isOpened:false,
        isShowToast:false,
        isShowDeletIcon:false,
        type:null,
        tagInput:''
    }

    componentWillReceiveProps(nextProps){
        if(nextProps&&(nextProps != this.props)){
            this.setState({
                type:nextProps.type,
            })
            this.dataDeal(nextProps.tagList,nextProps.type)
        }
    }

    dataDeal(tagList, type){
        let currentTagList=[]
        tagList.map((tag) => {
            type===1?currentTagList.push({image:tag1,value:tag.value}):currentTagList.push({image:tag2,value:tag.value})
        })
        currentTagList.push({image:addTag,value:'添加新标签'})
        this.setState({
            currentTagList:currentTagList
        })
    }

    addTagConfirm(value, type){
        if(value&&type){
            db.collection('tags').add({
                data: {
                  type:type,
                  value:value
                }
              })
              .then(res => {
                Taro.hideLoading()
                console.log(res)
                this.setState({
                    tagInput:''
                })
                this.props.onGetPayTags(type)
              })

        }else{
            this.setState({
                isShowToast:true
            },Taro.hideLoading())
        }
    }

    gotoBookKeeping(tagName,type){
        if(tagName === '添加新标签'){
            this.setState({
                isOpened:true,
            })
        }else{
            Taro.navigateTo({
                url:URL.BOOKKEEPING+'?tagName='+tagName+'&type='+type
              })
        }
    }

    handleClick(operating,tagName,type){
        this.setState({
            isOpened:false
        })
        if(operating === 1){
            Taro.showLoading({
                title: '加载中',
                mask:true
              })
            this.addTagConfirm(tagName,type)
        }
    }

    handleChange (tagInput) {
        this.setState({
            tagInput
        })
        // 在小程序中，如果想改变 value 的值，需要 `return value` 从而改变输入框的当前值
        return tagInput
    }
    closeToast(){
        this.setState({
            isShowToast:false
        })
    }

    showDeletIcon(){
        this.setState({
            isShowDeletIcon:true
        })
    }

    render(){
        const {currentTagList, type, isOpened, tagInput, isShowToast, isShowDeletIcon} = this.state
        return(
            <Block>
                <View className='tag-block-list'>
                    {
                        currentTagList&&currentTagList.map((item) => (
                            <View className='tag-block' key={item.id} 
                              onClick={() => {this.gotoBookKeeping(item.value,type)}}
                              onLongPress={this.showDeletIcon.bind(this, item.value)}
                            >
                                <Image className='tag-img' src={item.image} />
                                {
                                    isShowDeletIcon&&
                                    <View className='tag-img-delet'>
                                        <Image className='tag-img-delet-icon' src={deletTag} />
                                    </View>
                                }
                                
                                <View className='tag-name'>{item.value}</View>
                            </View>
                        ))
                    }
                </View>
                <AtModal isOpened={isOpened}>
                    <AtModalHeader>添加新标签</AtModalHeader>
                    <AtModalContent>
                        <AtInput
                          name='value'
                          title='新标签名'
                          type='text'
                          value={tagInput}
                          placeholder='请输入新标签名'
                          onChange={this.handleChange.bind(this)}
                        />
                    </AtModalContent>
                    <AtModalAction> 
                        <Button onClick={this.handleClick.bind(this, 0, tagInput, type)}>取消</Button> 
                        <Button onClick={this.handleClick.bind(this, 1, tagInput, type)}>提交</Button> 
                    </AtModalAction>
                </AtModal>
                <AtToast onClose={() => {this.closeToast()}} isOpened={isShowToast} text='请输入标签名' image={showToast}></AtToast>
            </Block>
        )
    }
}