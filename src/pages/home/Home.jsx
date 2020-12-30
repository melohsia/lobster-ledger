import Taro, { Component } from '@tarojs/taro'
import {View, Button} from '@tarojs/components'
import {connect} from '@tarojs/redux'
import AccountInfo from './accountInfo/AccountInfo'
import ShowDetail from './showDetail/ShowDetail'
import {updateLoginStatus} from '../../store/user/action'
import {db} from '../../service/api'
import URL from '../../common/urls'
import './Home.scss'

@connect(
  ({user}) => ({
    loginStatus:user.loginStatus
  }),
  {
    dispatchUpdateLoginStatus:updateLoginStatus
  }
)

export default class Home extends Component {

  state={
    onList:[],
    userInfo:{},
  }

  componentWillMount(){
    Taro.showLoading({
      title: '加载中',
      mask:true
    })
    this.homeInit()
  }

  homeInit(){
    let that = this
    Taro.getStorage({
      key: 'userId',
      success: function (res) {
        that.getUserInfo(res.data)
        that.getDetailList(res.data)
      }
    })
  }

  onSwitchStatus(status){
    // this.setState({
    //   status
    // }, this.detailListSwitch(status))
    this.detailListSwitch(status)
  }

  getDetailList(userId){
    let that = this
    const _ = db.command
    db.collection('detail').where({
      user_id:_.eq(userId)
    })
    .orderBy('time', 'desc')
    .get({
        success: function(res) {
          that.setState({
            onList:res.data
          }, Taro.hideLoading())
        }
    })
  }

  getUserInfo(userId){
    let that = this
    db.collection('user').doc(userId)
    .get({
        success: function(res) {
          that.setState({
            userInfo:res.data
          })
        }
    })
  }

  getDetailListByType(type, userId){
    let that = this
    const _ = db.command
    db.collection('detail').where({
      type:_.eq(type),
      user_id:userId
    }).orderBy('time', 'desc')
    .get({
        success: function(res) {
          that.setState({
            onList:res.data
          }, Taro.hideLoading())
        },
        fail: function() {
          Taro.hideLoading()
          that.props.dispatchUpdateLoginStatus(false)
          Taro.navigateTo({
            url:URL.INDEX
          })
        }
    })
  }

  config = {
    navigationBarTitleText: '首页'
  }

  detailListSwitch(status){
    let that = this
    switch(status){
      case 1 :
        Taro.getStorage({
          key: 'userId',
          success: function (res) {
            that.getDetailListByType('1', res.data)
          },
          fail: function() {
            Taro.hideLoading()
            that.props.dispatchUpdateLoginStatus(false)
            Taro.navigateTo({
              url:URL.INDEX
            })
          }
        })
        break
      case 2:
        Taro.getStorage({
          key: 'userId',
          success: function (res) {
            that.getDetailListByType('2', res.data)
          },
          fail: function() {
            Taro.hideLoading()
            that.props.dispatchUpdateLoginStatus(false)
            Taro.navigateTo({
              url:URL.INDEX
            })
          }
        })
        break
      default:
        Taro.getStorage({
          key: 'userId',
          success: function (res) {
            that.getDetailList(res.data)
          },
          fail: function() {
            Taro.hideLoading()
            that.props.dispatchUpdateLoginStatus(false)
            Taro.navigateTo({
              url:URL.INDEX
            })
          }
        })
        break
    }
  }

  gotoShowTagPage(){
    Taro.navigateTo({
      url:URL.SHOWTAGPAGE
    })
  }
  
  render () {
    const {onList, userInfo} = this.state
    return (
      <View className='background'>
          <AccountInfo userInfo={userInfo} />
          <ShowDetail detailList={onList} onSwitchStatus={(status) => {this.onSwitchStatus(status)}} />
          <View className='add-button-fill'></View>
          <Button className='add-button' onClick={this.gotoShowTagPage.bind(this)}>添加</Button>
      </View>
    )
  }
}