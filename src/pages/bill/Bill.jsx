import Taro,{ Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

export default class ClassName extends Component{

    config = {
        navigationBarTitleText: '账单'
      }

    render(){
        return(
            <View>账单</View>
        )
    }
}   