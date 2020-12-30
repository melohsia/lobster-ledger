import Taro, { Component } from '@tarojs/taro'
import {connect} from '@tarojs/redux'
import {updateLoginStatus} from '../../store/user/action'
import {isLogin} from '../../common/tools'
import Login from '../login/Login'
import Home from '../home/Home'

@connect(
  ({user}) => ({
    loginStatus:user.loginStatus
  }),
  {
    dispatchUpdateLoginStatus:updateLoginStatus
  }
)

export default class Index extends Component {

  state = {
    isVaild:false
  }

  componentWillMount(){
    const userId = Taro.getStorageSync('userId')
    if(userId){
      this.setState({
        isVaild:true
      })
    }
  }

  onSetIsVaild(){
    this.setState({
      isVaild:true
    })
  }
  
  render () {
    // const {isVaild} = this.state
    // console.log('isVaild', isVaild)
    const {loginStatus} = this.props
    // console.log('loginStatus', loginStatus)
    return (
      loginStatus ?
      <Home />
      :
      <Login onSetIsVaild={this.onSetIsVaild.bind(this)} />
    )
  }
}
 