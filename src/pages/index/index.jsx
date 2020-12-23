import Taro, { Component } from '@tarojs/taro'
import {View, Button} from '@tarojs/components'
import Login from '../login/Login'
import Home from '../home/Home'

export default class Index extends Component {
  
  render () {
    return (
      <Login />
    )
  }
}
 