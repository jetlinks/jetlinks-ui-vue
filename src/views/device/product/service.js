import apis from '@/api/index'
import { groupBy } from 'lodash'
/**
 * @description 处理新建产品 --- 所属品类领域数据
 */
export function HandleCategoryList (data) {
  const { result } = data
  if (!result.length) return []
  return result
}

/**
 * @description 处理新建产品 --- 所属品类数据
 */
export function HandleCategoryListData (data) {
  const { result } = data
  const ListData = []
  if (!result.length) return []
  result.map(item => {
    if (item.children) {
      item.children.map((i) => {
        if (i.children) {
          i.children.map((data) => {
            data['superParentName'] = item.name
            data['parentName'] = i.name
            data['categoryId'] = [item.id, i.id, data.id]
            ListData.push(data)
          })
        } else {
          i['parentName'] = item.name
          i['categoryId'] = [item.id, i.id]
          ListData.push(i)
        }
      })
    }
  })
  return ListData
}

/**
 * @description 处理产品列表数据
 */
export async function HandleProductList (data) {
  const { result } = data
  if (!result.data && !result.data.length) {
    return []
  }
  const deviceCount = {}
  for (let index = 0; index < result.data.length; index++) {
    if (result.data[index].id) {
      await apis.deviceProduct.GetDeviceNum({ terms: { 'productId': result.data[index].id } })
       .then(res => {
         if (res.status === 200) {
           deviceCount[result.data[index].id] = res.result
          //  return res.result
         } else {
           deviceCount[result.data[index].id] = '/'
         }
       })
       .catch()
    }
  }
  // result.data.map(async (item) => {
  //   if (item.id) {
  //      await apis.deviceProduct.GetDeviceNum({ terms: { 'productId': item.id } })
  //       .then(res => {
  //         if (res.status === 200) {
  //           deviceCount[item.id] = res.result
  //           // return res.result
  //         } else {
  //           deviceCount[item.id] = '/'
  //         }
  //       })
  //       .catch()
  //   }
  // })
  // console.log('res', res)
  return {
    productData: result.data,
    deviceCount
  }
}

/**
 * @description 处理单位数据
 */
export function handleunitsData (data) {
  const result = groupBy(data, unit => unit.type)
  return result
}
