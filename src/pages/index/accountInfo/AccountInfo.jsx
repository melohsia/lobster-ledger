import Taro,{ Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './AccountInfo.scss'

export default class AccountInfo extends Component{

    render(){
        return (
            <View className='account-info'>
                账户信息
            </View>
        )
    }   
}