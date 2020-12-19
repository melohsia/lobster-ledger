import Taro from '@tarojs/taro'

//判断参数是否是object
export default function getType (para) {
    return Object.prototype.toString.call(para)
        .replace(/\[object (.*)\]/, '$1').toLowerCase()
}