import Taro,{ Component } from '@tarojs/taro'
import { View, Picker, Image, Button } from '@tarojs/components'
import moment from 'moment'
import { AtForm, AtInput, AtList, AtListItem, AtToast, AtModal, AtModalHeader, AtModalContent, AtModalAction }  from 'taro-ui'
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
            isShowToast:false,
            action:'',
            editItem:{},
            isShowDelet:false
        }
      }

      componentWillMount(){
          this.$router.params.action==='edit'?
          this.setState({
              action:this.$router.params.action,
              editItem:JSON.parse(this.$router.params.item),
          })
          :
          this.setState({
            tagName:this.$router.params.tagName,
            type:this.$router.params.type,
            action:this.$router.params.action,
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
            isShowToast:false,
            isShowDelet:false
        })
    }

      handleAdd(){
        Taro.showLoading({
          title: '加载中',
          mask:true
        })
        const {tagName, money, type, itemName, dateSel} = this.state
        let time = moment(dateSel).format('YYYY-MM-DD')
        let month = time.split('-')[0]+'-'+time.split('-')[1]
        let year =  time.split('-')[0]
        if(itemName&&money&&month&&tagName&&time&&type&&year){
          Taro.getStorage({
            key: 'userId',
            success: function (user) {
              db.collection('detail').add({
                data: {
                  item_name:itemName,
                  money:money,
                  month:month,
                  tag_name:tagName,
                  time:time,
                  type:type,
                  year:year,
                  user_id:user.data
                },
                success: function(res) {
                  console.log(res)
                  Taro.hideLoading()
                  Taro.reLaunch({
                    url:URL.INDEX
                  })
                }
              })
            }
          })
          
        }else{
          Taro.hideLoading()
          this.setState({
            isShowToast:true
          })
        }
      }

      handleDelet(id, operating){
        if(operating === 'show'){
          this.setState({
            isShowDelet:true
          })
        }else{
          Taro.showLoading({
              title: '加载中',
              mask:true
            })
          db.collection('detail').doc(id).remove({
              success: function(res) {
                Taro.hideLoading()
                console.log(res)
                Taro.reLaunch({
                  url:URL.INDEX
                })
              }
            })
        }
      }

      gotoLedgerEdit(editItem){
          Taro.navigateTo({
            url:URL.LEDGEREDIT+'?editItem='+JSON.stringify(editItem)
          })
      }

      render () {
          const {tagName, money, type, itemName, dateSel, isShowToast, action, editItem, isShowDelet } = this.state
          return (
            <View className='add-ledger'>
              <View className='canvas'>
                <Image className='bg' src={editItem.type === '2'? payBg : incomeBg}></Image>
              </View>
              {
                  action==='edit'?
                  <AtForm>
                    <View className='add-ledger-item'>
                      <AtInput
                        className='ledger-item_input'
                        name='tagName'
                        title='标签'
                        type='text'
                        disabled
                        value={editItem.tag_name}
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
                        disabled
                        value={editItem.item_name}
                        border={false}
                        onChange={this.handleChangeItemName.bind(this)}
                      />
                      <Image className='add-ledger-icon' src={itemIcon}></Image>
                    </View>
                    <View className='page-section'>
                      <View className='ledger-item_date'>
                        <Picker mode='date' onChange={this.onDateChange}>
                          <AtList>
                            <AtListItem title='请选择日期' extraText={editItem.time} />
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
                      value={editItem.money}
                      disabled
                      onChange={this.handleChangeMoney.bind(this)}
                    />
                    <Image className='add-ledger-icon' src={moneyIcon}></Image>
                  </View>
                </AtForm>
                :
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
              }
              {
                  action==='edit'?
                  <View>
                    <Button className='delet-button' onClick={this.handleDelet.bind(this, editItem._id, 'show')}>删除</Button>
                    <Button className='edit-button' onClick={this.gotoLedgerEdit.bind(this, editItem)}>编辑</Button>
                  </View>
                  :
                  <Button className='add-button' onClick={this.handleAdd.bind(this)}>添加</Button>
                }
                <AtToast onClose={() => {this.closeToast()}} isOpened={isShowToast} text='内容输入不完整' image={showToast}></AtToast>
                <AtModal isOpened={isShowDelet} onClose={() => {this.closeToast()}}>
                <AtModalHeader>提示</AtModalHeader>
                  <AtModalContent>
                    <View style={{textAlign:'center',fontSize:'16px'}}>
                      确认删除这条记账?
                    </View>
                  </AtModalContent>
                <AtModalAction> <Button onClick={() => {this.closeToast()}}>取消</Button> <Button onClick={this.handleDelet.bind(this, editItem._id, 'delet')}>确定</Button> </AtModalAction>
              </AtModal>
            </View>
          )
      }
}