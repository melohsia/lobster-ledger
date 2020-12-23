import Taro,{ Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import tagImg from '../../../../assets/tag.png'
import URL from '../../../../common/urls'
import './Card.scss'

export default class Card extends Component{

    gotoBookKeeping(item){
        Taro.navigateTo({
            url:URL.BOOKKEEPING+'?item='+JSON.stringify(item)+'&&action=edit'
        })
    }

    render(){
        const {detailMap, month } = this.props
        return(
            <View className='show-detail-content' >
                {
                    detailMap&&Object.keys(detailMap).map((date) => (
                        date&&<View className='show-detail-block' key={date.id}>
                            <View className='show-detail-time'>{date.startsWith(month)?date.replace(new RegExp('-','g'),'/'):''}</View>
                            {
                                detailMap[date.startsWith(month)?date:''].map((item) => (
                                    <View className='show-detail-item' key={item.id} onClick={this.gotoBookKeeping.bind(this, item)}>
                                         <View className='show-detail-item-tag'>
                                             <Image className='show-detail-item-tag-img' src={tagImg}></Image>
                                             <View className='show-detail-item-tag-content'>{item.tag_name}</View>
                                         </View>
                                         <View className='show-detail-item-name'>{item.item_name}</View>
                                         {
                                             item.type === '1' ?
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