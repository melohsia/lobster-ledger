import Taro,{ Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabBar }  from 'taro-ui'
import {connect} from '@tarojs/redux'
import {updateLoginStatus} from '../../store/user/action'
import TagPage from './tagPage/TagPage'
import {db} from '../../service/api'
import URL from '../../common/urls'
import './ShowTagPage.scss'

@connect(
  ({user}) => ({
    loginStatus:user.loginStatus
  }),
  {
    dispatchUpdateLoginStatus:updateLoginStatus
  }
)
export default class ShowTagPage extends Component{
    constructor () {
        super(...arguments)
        this.state = {
          current: 0,
          onList:[],
          type:'2',
          isShowDeletIcon:null
        }
      }

      componentWillMount(){
        Taro.showLoading({
          title: '加载中',
          mask:true
        })
        this.init()
      }

      config = {
        navigationBarTitleText: '选择标签'
      }

      init(){
        let that = this
        Taro.getStorage({
          key: 'userId',
          success: function (res) {
            that.getPayTags('2', res.data)
          },
          fail:function(){
            that.props.dispatchUpdateLoginStatus(false)
            Taro.navigateTo({
              url:URL.INDEX
            })
          }
        })
      }

      getPayTags(type, userId){
        let that = this
        const _ = db.command
        db.collection('tags').where({
          type:_.eq(type),
          user_id:userId
        })
        .get({
            success: function(res) {
              that.setState({
                onList:res.data
              }, Taro.hideLoading())
            }
        })
      }

      handleClick (value) {
        let that = this
        Taro.showLoading({
          title: '加载中',
          mask:true
        })
        const type = value ? '1':'2'
        Taro.getStorage({
          key: 'userId',
          success: function (res) {
            that.getPayTags(type, res.data)
          },
          fail:function(){
            that.props.dispatchUpdateLoginStatus(false)
            Taro.navigateTo({
              url:URL.INDEX
            })
          }
        })
        this.setState({
          current: value,
          isShowDeletIcon:false,
          type
        })
      }

      render () {
          const {current, onList, type, isShowDeletIcon} = this.state
          return (
            <View className='tag-page'>
              <AtTabBar
                tabList={[
                { title: '支出', iconType:'shopping-bag-2'},
                { title: '收入', iconType:'credit-card'}
              ]}
                onClick={this.handleClick.bind(this)}
                current={current}
              />
              <View>
                <TagPage isShowDeletIcon={isShowDeletIcon} tagList={onList} type={type} onGetPayTags={(typeParam, userId) => {this.getPayTags(typeParam, userId)}} />
              </View>
            </View>
            
          )
      }
}