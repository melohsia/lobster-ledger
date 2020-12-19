import Taro, { Component } from '@tarojs/taro'
import {View, Button} from '@tarojs/components'
import AccountInfo from './accountInfo/AccountInfo'
import ShowDetail from './showDetail/ShowDetail'
import {db} from '../../service/api'
import URL from '../../common/urls'
import './index.scss'

export default class Index extends Component {

  state={
    onList:[],
    // status:0
  }

  componentWillMount(){
    Taro.showLoading({
      title: '加载中',
      mask:true
    })
    this.getDetailList()
  }

  onSwitchStatus(status){
    // this.setState({
    //   status
    // }, this.detailListSwitch(status))
    this.detailListSwitch(status)
  }

  getDetailList(){
    let that = this
    db.collection('detail').orderBy('time', 'desc')
    .get({
        success: function(res) {
          that.setState({
            onList:res.data
          }, Taro.hideLoading())
        }
    })
  }

  getDetailListByType(type){
    let that = this
    const _ = db.command
    db.collection('detail').where({
      type:_.eq(type)
    }).orderBy('time', 'desc')
    .get({
        success: function(res) {
          that.setState({
            onList:res.data
          }, Taro.hideLoading())
        }
    })
  }

  config = {
    navigationBarTitleText: '首页'
  }

  detailListSwitch(status){
    switch(status){
      case 1 :
        this.getDetailListByType(1)
        break
      case 2:
        this.getDetailListByType(2)
        break
      default:
        this.getDetailList()
        break
    }
  }

  gotoShowTagPage(){
    Taro.navigateTo({
      url:URL.SHOWTAGPAGE
    })
  }
  
  render () {
    const {onList} = this.state
    return (
      <View className='background'>
          <AccountInfo />
          <ShowDetail detailList={onList} onSwitchStatus={(status) => {this.onSwitchStatus(status)}} />
          <View className='add-button-fill'></View>
          <Button className='add-button' onClick={this.gotoShowTagPage.bind(this)}>添加</Button>
      </View>
    )
  }
}
 