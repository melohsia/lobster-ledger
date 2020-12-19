import Taro,{ Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabBar }  from 'taro-ui'
import TagPage from './tagPage/TagPage'
import {db} from '../../service/api'
import './ShowTagPage.scss'


export default class ShowTagPage extends Component{
    constructor () {
        super(...arguments)
        this.state = {
          current: 0,
          onList:[],
          type:2
        }
      }

      componentWillMount(){
        Taro.showLoading({
          title: '加载中',
          mask:true
        })
        this.getPayTags(2)
      }

      getPayTags(type){
        let that = this
        const _ = db.command
        db.collection('tags').where({
          type:_.eq(type)
        })
        .get({
            success: function(res) {
              that.setState({
                onList:res.data
              }, Taro.hideLoading())
            }
        })
      }

      handleClick (value) {
        Taro.showLoading({
          title: '加载中',
          mask:true
        })
        const type = value?1:2
        this.getPayTags(type)
        this.setState({
          current: value,
          type
        })
      }

      render () {
          const {current, onList, type} = this.state
          return (
            <View>
              <AtTabBar
                tabList={[
                { title: '支出', iconType:'shopping-bag-2'},
                { title: '收入', iconType:'credit-card'}
              ]}
                onClick={this.handleClick.bind(this)}
                current={current}
              />
              <View>
                <TagPage tagList={onList} type={type} onGetPayTags={(typeParam) => {this.getPayTags(typeParam)}} />
              </View>
            </View>
            
          )
      }
}