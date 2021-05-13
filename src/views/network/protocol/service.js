export const StaticProviders = [{ id: 'script', text: 'script' }]

/**
 * @description 协议列表数据---处理接口数据，返回页面所需数据格式
 * @param {*} data
 */
export function HandleProtocolList (data) {
  const { result } = data
  if (!result.data.length) return
  return {
    data: result.data,
    current: result.pageIndex,
    pageSize: result.pageSize,
    total: result.total
  }
}
/**
 * @description 协议类型---处理接口数据，返回页面所需数据格式
 * @param {*} data
 */
export function HandleProviders (data) {
  const { result } = data
  const resData = []
  result.forEach(element => {
    resData.push({
      id: element,
      text: element
    })
  })
  return {
    data: resData.concat(StaticProviders)
  }
}
