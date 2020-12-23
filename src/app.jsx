import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {



  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  config = {
    pages: [
      'pages/index/index',
      'pages/bookKeeping/BookKeeping',
      'pages/personalCenter/PersonalCenter',
      'pages/bill/Bill',
      'pages/showTagPage/ShowTagPage',
      'pages/ledgerEdit/LedgerEdit',
      'pages/register/Register'
    ],
    tabBar: {
      color: '#999999',
      selectedColor: '#333333',
      // backgroundColor: '#fff',
      // borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/bill/Bill',
        text: '账单',
        iconPath: 'assets/book_default.png',
        selectedIconPath: 'assets/book_click.png'
      },{
        pagePath: 'pages/index/index',
        text: '记账',
        iconPath: 'assets/add_default.png',
        selectedIconPath: 'assets/add_click.png'
      },{
        pagePath: 'pages/personalCenter/PersonalCenter',
        text: '个人中心',
        iconPath: 'assets/personal_default.png',
        selectedIconPath: 'assets/personal_click.png'
      }]
    },
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
