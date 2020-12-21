import Taro,{ Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtAccordion } from 'taro-ui'
import {Card} from './Card/Card'
import {SWITCH_INDEX} from '../../../common/const'
import './ShowDetail.scss'

export default class ClassName extends Component{
    constructor () {
        super(...arguments)
        this.state = {
          current: 0,
          open:[],
          detailList:[],
          detailMap:null
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps&&(nextProps != this.props)){
            this.dataDeal(nextProps.detailList)
        }
    }

    handleSwitch (value) {
        Taro.showLoading({
            title: '加载中',
            mask:true
          })
        this.setState({
          current: value
        })
        this.props.onSwitchStatus(value)
    }

    handleClick (value) {
        const {open} = this.state
        open[value]= !open[value]
        this.setState({
          open
        })
      }

    dataDeal(detailList){
        if(!detailList){
            return
        }
        let monthList = []
        let detailMap = []
        let open =[true]
        detailList.map((item) => {
            monthList.push(item.time.substring(0,7))
            detailMap[item.time] = []
        })


        detailList.map((item) => {
            Object.keys(detailMap).map((key) => {
                if(item.time === key){
                    detailMap[item.time].push(item)
                }
            })
        })

        monthList = Array.from(new Set(monthList))
        for(let i=1; i<monthList.length; i++){
            open[i] = false
        }

        this.setState({
            detailList,
            detailMap,
            open,
            monthList
        })
    }

    render () {
        const { monthList, open, detailList, detailMap} = this.state
        const tabList = [{ title: '全部' }, { title: '收入' }, { title: '支出' }]
        return (
            <View className='show-detail'>
                <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleSwitch.bind(this)}>
                    {
                        SWITCH_INDEX.map((index) => (
                            <AtTabsPane current={this.state.current} index={index} key={index.id}>
                                <ScrollView
                                  className='scrollview'
                                  scrollY
                                  scrollWithAnimation
                                >
                                    <View className='accordion-list' key={index.id}>
                                        { 
                                            monthList&&monthList.map((month) => (
                                                <AtAccordion
                                                  key={month.id}
                                                  open={open[monthList.findIndex((value) => {return value==month})]}
                                                  onClick={this.handleClick.bind(this, monthList.findIndex((value) => {return value==month}))}
                                                  title={month.split('/')[0]+'年'+month.split('/')[1]+'月'}
                                                  isAnimation={false}
                                                >   
                                                    <ScrollView
                                                      className='scrollview'
                                                      scrollY
                                                      scrollWithAnimation
                                                    >
                                                        <Card detailMap={detailMap} detailList={detailList} month={month} />
                                                    </ScrollView>
                                                </AtAccordion>
                                            ))
                                        }
                                    </View>
                                </ScrollView>
                            </AtTabsPane>
                        ))
                    }
                </AtTabs>
            </View>
        )
    }
}