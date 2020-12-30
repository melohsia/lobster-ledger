import Taro,{ Component } from '@tarojs/taro'
import { View, Image, Picker, Button } from '@tarojs/components'
import { AtForm, AtInput, AtList, AtListItem, AtToast }  from 'taro-ui'
import tagIcon from '../../assets/tag.png'
import itemIcon from '../../assets/item.png'
import dateIcon from '../../assets/date.png'
import moneyIcon from '../../assets/money.png'
import payBg from '../../assets/paybg.png'
import incomeBg from '../../assets/incomebg.png'
import showToast from '../../assets/show_toast.png'
import {db} from '../../service/api'
import URL from '../../common/urls'
import './LedgerEdit.scss'

export default class LedgerEdit extends Component{

    state={
        editItem:{},
        dateSel:'',
        itemName:'',
        money:null,
        isShowToast:false,
        selector: [],
        selectorChecked:''
    }

    componentWillMount(){
        Taro.showLoading({
            title: '加载中',
            mask:true
          })
        let editItem = JSON.parse(this.$router.params.editItem)
        this.getTagList(editItem.type)
        this.setState({
            editItem,
            dateSel:editItem.time,
            selectorChecked:editItem.tag_name,
            itemName:editItem.item_name,
            money:editItem.money
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

    onChange = e => {
        this.setState({
          selectorChecked: this.state.selector[e.detail.value]
        })
      }

    onDateChange = e => {
        this.setState({
          dateSel: e.detail.value
        })
      }

    handleUpdate(){
        const {editItem, dateSel, itemName, money, selectorChecked} = this.state
        Taro.showLoading({
            title: '加载中',
            mask:true
          })
        if(editItem && dateSel && itemName && money){
            db.collection('detail').doc(editItem._id).update({
                data: {
                    item_name:itemName,
                    money:money,
                    month:dateSel.split('-')[0]+'-'+dateSel.split('-')[1],
                    tag_name:selectorChecked,
                    time:dateSel,
                    year:dateSel.split('-')[0]
                },
                success: function(res) {
                  console.log(res.data)
                  Taro.hideLoading()
                }
              })
              Taro.reLaunch({
                url:URL.INDEX
              })
        }else{
            this.setState({
                isShowToast:true
            }, Taro.hideLoading())
        }
    }

    getTagList(type){
        let that = this
        let onList = []
        const _ = db.command
        db.collection('tags').where({
          type:_.eq(type)
        })
        .get({
            success: function(res) {
                res.data.map((tag) => {
                    onList.push(tag.value)
                })
                that.setState({
                    selector:onList
                }, Taro.hideLoading())
            }
        })
      }

      closeToast(){
        this.setState({
          isShowToast:false
        })
      }

    render(){
        const {editItem, dateSel, isShowToast, selectorChecked, selector} = this.state

        return(
            <View className='add-ledger'>
              <View className='canvas'>
                <Image className='bg' src={editItem.type === '2'? payBg : incomeBg}></Image>
              </View>
              <AtForm>
                <View className='page-section'>
                  <Picker className='ledger-item_date' mode='selector' range={selector} onChange={this.onChange}>
                        <AtList>
                            <AtListItem
                              title='标签'
                              extraText={selectorChecked}
                            />
                        </AtList>
                    </Picker>
                  <Image className='add-ledger-icon' src={tagIcon}></Image>
                </View>
                
                <View className='add-ledger-item'>
                  <AtInput
                    className='ledger-item_input'
                    name='itemName'
                    title='事项'
                    type='text'
                    placeholder='请输入事项名称'
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
                      title={editItem.type === '1'? '收入金额':'支出金额'}
                      type='digit'
                      placeholder='请输入金额'
                      value={editItem.money}
                      onChange={this.handleChangeMoney.bind(this)}
                    />
                    <Image className='add-ledger-icon' src={moneyIcon}></Image>
                  </View>
                </AtForm>
                <AtToast onClose={() => {this.closeToast()}} isOpened={isShowToast} text='内容输入不完整' image={showToast}></AtToast>
                <Button className='add-button' onClick={this.handleUpdate.bind(this)}>保存</Button>
            </View>
        )
    }
}