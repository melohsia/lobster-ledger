import Taro from '@tarojs/taro'
import { View, Image, Button, Text } from '@tarojs/components'
import { AtForm, AtInput } from 'taro-ui'
import loginbg from '../../assets/login_bg.png'
import URL from '../../common/urls'
import './Login.scss'

export default class Login extends Taro.Component {
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
  }

  handleChangePwd (pwd) {
    this.setState({
        pwd
    })
  }

  gotoRegister(){
    Taro.navigateTo({
      url:URL.REGISTER
    })
  }

  render () {
      const {uname, pwd} = this.state
      return (
          <View className='login-background'>
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
                        onChange={this.handleChangeUname.bind(this, uname)} 
                      />
                      <AtInput 
                        name='value' 
                        title='密码' 
                        type='text' 
                        placeholder='请输入密码' 
                        value={pwd} 
                        onChange={this.handleChangePwd.bind(this, pwd)} 
                      />
                  </AtForm>
              </View>
              <Button className='log-button' >登录</Button>
              <View className='register'>
                <Text onClick={this.gotoRegister.bind(this)}>3秒光速注册</Text>
              </View>
          </View>
        
      )
    }
}