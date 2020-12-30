import Taro from '@tarojs/taro'

//判断参数是否是object
export const getType = (para) => {
    return Object.prototype.toString.call(para)
        .replace(/\[object (.*)\]/, '$1').toLowerCase()
}

export const dealOpenId = (key, value) => {
    Taro.setStorageSync(key, value)
    Taro.setStorageSync('time', new Date().getTime())
}

export const isLogin = () => {
    const inteval = 1000*60
    let isVaild = false
    let currentTime = new Date().getTime()
    Taro.getStorage({
        key: 'time',
        success: function (res) {
            Taro.hideLoading()
            isVaild = (currentTime - res.data) < inteval ? true : false
            console.log('s', isVaild)
            if(!isVaild){
                Taro.clearStorage()
            }
        },
        fail: function() {
          Taro.hideLoading()
          isVaild = false
          console.log('t', isVaild)
        }
    })
    console.log(0, isVaild)
    return isVaild
}