wx. cloud. init()
export const db = wx.cloud.database()
export const getDetailList = () => {
    db.collection('detail').get({
        success: function(res) {
          console.log(res)
        }
      })
}

export const addDetailItem = (data) => {
    db.collection('detail').add({data})
}
