import Taro,{ Component } from '@tarojs/taro'
import { Block, Button, View, Image } from '@tarojs/components'
import { AtModal, AtModalHeader, AtModalAction, AtModalContent, AtInput, AtToast } from "taro-ui"
import {connect} from '@tarojs/redux'
import {updateLoginStatus} from '../../../store/user/action'
import URL from '../../../common/urls'
import tag2 from '../../../assets/tag2.png'
import tag1 from '../../../assets/tag1.png'
import showToast from '../../../assets/show_toast.png'
import addTag from '../../../assets/add_tag.png'
import deletTag from '../../../assets/delet_tag.png'
import cancelDelet from '../../../assets/cancel_delet.png'
import {db} from '../../../service/api'
import './TagPage.scss'

@connect(
    ({user}) => ({
      loginStatus:user.loginStatus
    }),
    {
      dispatchUpdateLoginStatus:updateLoginStatus
    }
  )
export default class TagPage extends Component{

    state={
        currentTagList:[],
        isOpened:false,
        isShowToast:false,
        isShowDeletIcon:false,
        type:'',
        tagInput:'',
        toastText:''
    }

    componentWillReceiveProps(nextProps){
        if(nextProps&&(nextProps != this.props)){
            this.setState({
                type:nextProps.type,
                isShowDeletIcon:nextProps.isShowDeletIcon
            })
            this.dataDeal(nextProps.tagList,nextProps.type)
        }
    }

    dataDeal(tagList, type){
        let currentTagList=[]
        tagList.map((tag) => {
            type==='1'?currentTagList.push({id:tag._id,image:tag1,value:tag.value}):currentTagList.push({id:tag._id,image:tag2,value:tag.value})
        })
        currentTagList.push({image:addTag,value:'添加新标签'})
        this.setState({
            currentTagList:currentTagList
        })
    }

    addTagConfirm(value, type){
        let that = this
        if(value&&type){
            Taro.getStorage({
                key: 'userId',
                success:  (user) => {
                    db.collection('tags').add({
                        data: {
                          type:type,
                          value:value,
                          user_id:user.data
                        }
                      })
                      .then(res => {
                        Taro.hideLoading()
                        console.log(res)
                        that.setState({
                            tagInput:'',
                            toastText:''
                        })
                        that.props.onGetPayTags(type, user.data)
                      })
                },
                fail:function(){
                  that.props.dispatchUpdateLoginStatus(false)
                  Taro.navigateTo({
                    url:URL.INDEX
                  })
                }
              })
        }else{
            that.setState({
                isShowToast:true,
                toastText:'请输入标签名'
            },Taro.hideLoading())
        }
    }

    gotoBookKeeping(tagName,type){
        const {isShowToast, isShowDeletIcon} = this.state
        if(tagName === '添加新标签'){
            this.setState({
                isOpened:true,
            })
        }else if(!(isShowToast||isShowDeletIcon)){
            Taro.navigateTo({
                url:URL.BOOKKEEPING+'?tagName='+tagName+'&type='+type+'&action=add'
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
            let tagList = []
            this.props.tagList.map((tag) => {
                tagList.push(tag.value)
            })
            if(tagList.indexOf(tagName)>-1){
                this.setState({
                    isShowToast:true,
                    toastText:'标签已存在',
                    tagInput:''
                },Taro.hideLoading())
            }else{
                this.addTagConfirm(tagName,type)
            }
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

    handleCancel(){
        this.setState({
            isShowDeletIcon:false
        })
    }

    handleDeletTag(id){
        let that = this
        Taro.showLoading({
            title: '加载中',
            mask:true
          })
          Taro.getStorage({
            key: 'userId',
            success: (user) => {
                db.collection('tags').doc(id).remove({
                    success: (res) => {
                      Taro.hideLoading()
                      console.log(res)
                      that.setState({
                          isShowDeletIcon:false,
                      })
                      that.props.onGetPayTags(that.state.type, user.data)
                    }
                  })
            },
            fail:function(){
              that.props.dispatchUpdateLoginStatus(false)
              Taro.navigateTo({
                url:URL.INDEX
              })
            }
          })
        
    }

    render(){
        const {currentTagList, type, isOpened, tagInput, isShowToast, isShowDeletIcon, toastText} = this.state
        return(
            <Block>
                <View className='tag-block-list'>
                    {
                        currentTagList&&currentTagList.map((item) => (
                            <View className='tag-block' key={item.id} 
                              onLongPress={this.showDeletIcon.bind(this, item.value)}
                            >
                                <Image className='tag-img' src={item.image} onClick={() => {this.gotoBookKeeping(item.value,type)}} />
                                {
                                    isShowDeletIcon&&(item.value!=='添加新标签')&&
                                    <View className='tag-img-delet'>
                                        <Image className='tag-img-delet-icon' src={deletTag} onClick={this.handleDeletTag.bind(this, item.id)} />
                                    </View>
                                }
                                
                                <View className='tag-name' onClick={() => {this.gotoBookKeeping(item.value,type)}}>
                                    {item.value}
                                </View>
                                {
                                    isShowDeletIcon&&(item.value!=='添加新标签')&&
                                    <View className='tag-img-cancel-delet' onClick={this.handleCancel.bind(this)}>
                                        <Image className='tag-img-cancel-delet-icon' src={cancelDelet} />
                                    </View>
                                }
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
                <AtToast onClose={() => {this.closeToast()}} isOpened={isShowToast} text={toastText} image={showToast}></AtToast>
            </Block>
        )
    }
}