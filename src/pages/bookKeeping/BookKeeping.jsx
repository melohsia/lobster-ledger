import Taro,{ Component } from '@tarojs/taro'
import { View, Picker, Image, Button } from '@tarojs/components'
import moment from 'moment'
import { AtForm, AtInput, AtList, AtListItem, AtToast }  from 'taro-ui'
import tagIcon from '../../assets/tag.png'
import itemIcon from '../../assets/item.png'
import dateIcon from '../../assets/date.png'
import moneyIcon from '../../assets/money.png'
import showToast from '../../assets/show_toast.png'
import payBg from '../../assets/paybg.png'
import incomeBg from '../../assets/incomebg.png'
import URL from '../../common/urls'
import {db} from '../../service/api'
import './BookKeeping.scss'

export default class BookKeeping extends Component{
    constructor () {
        super(...arguments)
        this.state = {
            tagName:'',
            type:null,
            money:'',
            itemName:'',
            dateSel:'',
            isShowToast:false
        }
      }

      componentWillMount(){
          this.setState({
              tagName:this.$router.params.tagName,
              type:this.$router.params.type,
              dateSel:moment().format('YYYY-MM-DD')
          })
      }

      onDateChange = e => {
        this.setState({
          dateSel: e.detail.value
        })
      }

      handleChangeItemName(itemName){
          this.setState({
            itemName
          })
          return itemName
      }

      handleChangeMoney(money){
          this.setState({
            money
          })
          return money
      }

      closeToast(){
        this.setState({
            isShowToast:false
        })
    }

      handleAdd(){
        Taro.showLoading({
          title: '加载中',
          mask:true
        })
        const {tagName, money, type, itemName, dateSel} = this.state
        let time = moment(dateSel).format('YYYY/MM/DD')
        let month = time.split('/')[0]+'/'+time.split('/')[1]
        let year =  time.split('/')[0]
        if(itemName&&money&&month&&tagName&&time&&type&&year){
          db.collection('detail').add({
            data: {
              item_name:itemName,
              money:money,
              month:month,
              tag_name:tagName,
              time:time,
              type:type,
              year:year
            },
            success: function(res) {
              console.log(res)
              Taro.hideLoading()
            }
          })
          console.log('URL.INDEX', URL.INDEX)
              Taro.reLaunch({
                url:URL.INDEX
              })
        }else{
          Taro.hideLoading()
          this.setState({
            isShowToast:true
          })
        }
      }

      render () {
          const {tagName, money, type, itemName, dateSel, isShowToast} = this.state
          return (
            <View className='add-ledger'>
              <View className='canvas'>
                <Image className='bg' src={type === '2'? payBg : incomeBg}></Image>
              </View>
              <AtForm>
                <View className='add-ledger-item'>
                  <AtInput
                    className='ledger-item_input'
                    name='tagName'
                    title='标签'
                    type='text'
                    disabled
                    value={tagName}
                  />
                  <Image className='add-ledger-icon' src={tagIcon}></Image>
                </View>
                <View className='add-ledger-item'>
                  <AtInput
                    className='ledger-item_input'
                    name='itemName'
                    title='事项'
                    type='text'
                    placeholder='请输入事项名称'
                    value={itemName}
                    border={false}
                    onChange={this.handleChangeItemName.bind(this)}
                  />
                  <Image className='add-ledger-icon' src={itemIcon}></Image>
                </View>
                  <View className='page-section'>
                    <View className='ledger-item_date'>
                      <Picker mode='date' onChange={this.onDateChange}>
                        <AtList>
                          <AtListItem title='请选择日期' extraText={dateSel} />
                        </AtList>
                      </Picker>
                    </View>
                      <Image className='add-ledger-icon' src={dateIcon}></Image>
                  </View>
                  <View className='add-ledger-item'>
                    <AtInput
                      className='ledger-item_input'
                      name='money'
                      title={type === '1'? '收入金额':'支出金额'}
                      type='digit'
                      placeholder='请输入金额'
                      value={money}
                      onChange={this.handleChangeMoney.bind(this)}
                    />
                    <Image className='add-ledger-icon' src={moneyIcon}></Image>
                  </View>
                </AtForm>
                <AtToast onClose={() => {this.closeToast()}} isOpened={isShowToast} text='内容输入不完整' image={showToast}></AtToast>
                <Button className='add-button' onClick={this.handleAdd.bind(this)}>添加</Button>
            </View>
          )
      }
}