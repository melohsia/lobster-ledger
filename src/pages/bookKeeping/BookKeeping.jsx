import Taro,{ Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabBar }  from 'taro-ui'
import {db} from '../../service/api'
import './BookKeeping.scss'


export default class BookKeeping extends Component{
    constructor () {
        super(...arguments)
        this.state = {
          
        }
      }

      componentWillMount(){
        console.log(1, this.$router.params)
      }

      render () {
          // const {current, onList, type} = this.state
          return (
            <View>
              记账
            </View>
            
          )
      }
}