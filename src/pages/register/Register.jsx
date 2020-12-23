import Taro from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import { AtForm, AtInput, AtToast } from 'taro-ui'
import registerbg from '../../assets/register_bg.png'
import URL from '../../common/urls'
import showToast from '../../assets/show_toast.png'
import './Register.scss'

export default class Register extends Taro.Component {
  constructor () {
    super(...arguments)
    this.state = {
        uname:'',
        pwd:'',
        nname:'',
        isShowToast:false
    }
  }
  handleChangeUname (uname) {
    this.setState({
        uname
    })
    return uname
  }

  handleChangeNname (nname) {
    this.setState({
        nname
    })
    return nname
  }

  handleChangePwd (pwd) {
    this.setState({
        pwd
    })
    return pwd
  }

  register(){
    const {uname, pwd, nname} = this.state
    if(uname&&pwd&&nname){
        console.log(uname, pwd, nname)
    }else{
        this.setState({
            isShowToast:true
        })
    }
  }

  closeToast(){
    this.setState({
        isShowToast:false
    })
  }
  render () {
      const {uname, pwd, nname, isShowToast} = this.state
      console.log(this.state)
      return (
          <View className='login-background'>
              <View className='login-bg'>
                  <Image className='login-bg-icon' src={registerbg}></Image>
              </View>
              <View className='login-content'>
                  <AtForm >
                      <AtInput 
                        name='value' 
                        title='用户名' 
                        type='text' 
                        placeholder='请设置一个好记的用户名' 
                        value={uname} 
                        onChange={this.handleChangeUname.bind(this)} 
                      />
                      <AtInput 
                        name='value' 
                        title='昵称' 
                        type='text' 
                        placeholder='请给自己取一个可爱的昵称' 
                        value={nname} 
                        onChange={this.handleChangeNname.bind(this)} 
                      />
                      <AtInput 
                        name='value' 
                        title='密码' 
                        type='text' 
                        placeholder='请设置一个好记的密码' 
                        value={pwd} 
                        onChange={this.handleChangePwd.bind(this)} 
                      />
                  </AtForm>
              </View>
              <Button className='log-button'onClick={this.register.bind(this)} >注册</Button>
              <AtToast onClose={() => {this.closeToast()}} isOpened={isShowToast} text='请将信息补充完整' image={showToast}></AtToast>
          </View>
        
      )
    }
}