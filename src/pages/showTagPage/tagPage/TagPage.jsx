import Taro,{ Component } from '@tarojs/taro'
import { Block, Button, View } from '@tarojs/components'
import { AtGrid, AtModal, AtModalHeader, AtModalAction, AtModalContent, AtInput, AtToast } from "taro-ui"
import URL from '../../../common/urls'
import tag2 from '../../../assets/tag2.png'
import tag1 from '../../../assets/tag1.png'
import showToast from '../../../assets/show_toast.png'
import addTag from '../../../assets/add_tag.png'
import {db} from '../../../service/api'
import './TagPage.scss'

export default class TagPage extends Component{

    state={
        data:{},
        isOpened:false,
        isShowToast:false,
        type:null,
        tagInput:''
    }

    componentWillReceiveProps(nextProps){
        if(nextProps&&(nextProps != this.props)){
            this.setState({
                type:nextProps.type
            })
            this.dataDeal(nextProps.tagList,nextProps.type)
        }
    }

    dataDeal(tagList, type){
        let currentTagList=[]
        let data ={}
        tagList.map((tag) => {
            type===1?currentTagList.push({image:tag1,value:tag.value}):currentTagList.push({image:tag2,value:tag.value})
        })
        currentTagList.push({image:addTag,value:'添加新标签'})
        data={currentTagList}
        this.setState({
            data
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

    click(){
        console.log('click')
    }

    render(){
        const {data, type, isOpened, tagInput, isShowToast} = this.state
        return(
            <Block>
                <View onLongPress={() => {this.click()}}>
                    <AtGrid data={data['currentTagList']} onClick={(item) => {this.gotoBookKeeping(item.value,type)}} />
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