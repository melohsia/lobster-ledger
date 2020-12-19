import Taro,{ Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { getDetailList } from '../../service/api'

export default class ClassName extends Component{

    config = {
        navigationBarTitleText: '个人中心'
    }

    render(){
        return(
            <View>个人中心</View>
        )
    }
}