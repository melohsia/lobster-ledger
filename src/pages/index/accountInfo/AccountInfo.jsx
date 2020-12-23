import Taro,{ Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import homebg from '../../../assets/home_bg.png'
import tx2 from '../../../assets/touxiang2.png'
import tx3 from '../../../assets/touxiang3.png'
import './AccountInfo.scss'

export default class AccountInfo extends Component{

    render(){
        const {userInfo} = this.props
        return (
            <View className='account-info'>
                <View className='home-bg'>
                    <Image className='home-bg-img' src={homebg}></Image>
                </View>
                <View className='card'>
                    <View className='show-name'>{userInfo.nick_name}</View>
                    <View className='is'>的</View>
                    <View className='show-tips'>
                        个人钱包
                        <Image className='tx-icon2' src={userInfo.balance >0 ? tx2 : tx3}></Image>
                    </View>
                    <View className='show-balance'>{'余额 '+userInfo.balance}</View>
                </View>
            </View>
        )
    }   
}