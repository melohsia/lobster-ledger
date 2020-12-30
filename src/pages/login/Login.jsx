import Taro, { Component } from '@tarojs/taro'
import {connect} from '@tarojs/redux'
import { View, Image, Button, Text } from '@tarojs/components'
import { AtForm, AtInput, AtMessage } from 'taro-ui'
import {updateLoginStatus} from '../../store/user/action'
import loginbg from '../../assets/login_bg.png'
import {dealOpenId} from '../../common/tools'
import URL from '../../common/urls'
import {db} from '../../service/api'
import './Login.scss'

@connect(
  ({user}) => ({
    loginStatus:user.loginStatus
  }),
  {
    dispatchUpdateLoginStatus:updateLoginStatus
  }
)

export default class Login extends Component {
  constructor () {
    super(...arguments)
    this.state = {
        uname:'',
        pwd:''
    }
  }
  handleChangeUname (uname) {
    this.setState({
        uname
    })
    return uname
  }

  handleChangePwd (pwd) {
    this.setState({
        pwd
    })
    return pwd
  }

  gotoRegister(){
    Taro.navigateTo({
      url:URL.REGISTER
    })
  }

  login(){
    Taro.showLoading({
      title: '加载中',
      mask:true
    })
    const {uname, pwd} = this.state
    let that = this
    if(uname&&pwd){
      db.collection('user').where({
          user_name:uname,
          password:pwd
      })
      .get({
        success: function(res) {
          Taro.hideLoading()
          if(res.data.length===0){
            Taro.atMessage({
              'message': '账号或密码错误',
              'type': 'error',
              'duration': 1000
            })
          }else{
            Taro.atMessage({
              'message':'登陆成功',
              'type': 'success',
              'duration': 1000
            })
            dealOpenId('userId', res.data[0]._id)
            that.props.dispatchUpdateLoginStatus(true)
          }
        }
      })
    }else{
      Taro.hideLoading()
      Taro.atMessage({
        'message': '账号或密码为空',
        'type': 'warning',
        'duration': 1000
      })
    }
  }

  render () {
      console.log(1, this.pro)
      const {uname, pwd} = this.state
      return (
          <View className='login-background'>
              <AtMessage />
              <View className='login-bg'>
                  <Image className='login-bg-icon' src={loginbg}></Image>
              </View>
              <View className='login-content'>
                  <AtForm >
                      <AtInput 
                        name='value' 
                        title='用户名' 
                        type='text' 
                        placeholder='请输入用户名' 
                        value={uname} 
                        onChange={this.handleChangeUname.bind(this)} 
                      />
                      <AtInput 
                        name='value' 
                        title='密码' 
                        type='password' 
                        placeholder='请输入密码' 
                        value={pwd} 
                        onChange={this.handleChangePwd.bind(this)} 
                      />
                  </AtForm>
              </View>
              <Button className='log-button' onClick={this.login.bind(this)} >登录</Button>
              <View className='register'>
                <Text onClick={this.gotoRegister.bind(this)}>3秒光速注册</Text>
              </View>
          </View>
        
      )
    }
}