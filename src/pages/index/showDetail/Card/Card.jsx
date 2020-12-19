import Taro,{ Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './Card.scss'

export default class Card extends Component{

    

    render(){
        const {detailMap, month } = this.props
        return(
            <View className='show-detail-content' >
                {
                    detailMap&&Object.keys(detailMap).map((date) => (
                        date&&<View className='show-detail-block' key={date.id}>
                            <View className='show-detail-time'>{date.startsWith(month)?date:''}</View>
                            {
                                detailMap[date.startsWith(month)?date:''].map((item) => (
                                    <View className='show-detail-item' key={item.id}>
                                         <View className='show-detail-item-name'>{item.item_name}</View>
                                         {
                                             item.type ===1 ?
                                             <View className='show-detail-item-value'>
                                                <View className='point' />
                                                    {item.money}
                                            </View>
                                            :
                                            <View className='show-detail-item-value-pay'>
                                                <View className='point-pay' />
                                                    {item.money}
                                            </View>
                                         }
                                     </View>
                                ))
                            }
                        </View>
                    ))
                }
            </View>
        )
    }
}