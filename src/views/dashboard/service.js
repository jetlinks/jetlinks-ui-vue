import moment from 'moment'
/**
 * @description 设备信息获取传递的data
 */
export const deviceInfoParams = [
  // 设备状态信息-在线
  {
    'dashboard': 'device',
    'object': 'status',
    'measurement': 'record',
    'dimension': 'current',
    'group': 'deviceOnline',
    'params': {
      'state': 'online'
    }
  }, // 设备状态信息-总数
  {
    'dashboard': 'device',
    'object': 'status',
    'measurement': 'record',
    'dimension': 'current',
    'group': 'deviceCount'
  }, // 设备状态信息-未激活
  {
    'dashboard': 'device',
    'object': 'status',
    'measurement': 'record',
    'dimension': 'current',
    'group': 'deviceNotActive',
    'params': {
      'state': 'notActive'
    }
  }, // 设备状态信息-历史在线
  {
    'dashboard': 'device',
    'object': 'status',
    'measurement': 'record',
    'dimension': 'aggOnline',
    'group': 'aggOnline',
    'params': {
      'limit': 20,
      'time': '1d',
      'format': 'yyyy-MM-dd'
    }
  }
]

const calculationDate = () => {
  const dd = new Date()
  dd.setDate(dd.getDate() - 30)
  const y = dd.getFullYear()
  const m = (dd.getMonth() + 1) < 10 ? `0${dd.getMonth() + 1}` : (dd.getMonth() + 1)
  const d = dd.getDate() < 10 ? `0${dd.getDate()}` : dd.getDate()
  return `${y}-${m}-${d} 00:00:00`
}
/**
 * @description 设备消息获取传递的data
 */
export const deviceMessageInfoParams = [
    {
      'dashboard': 'device',
      'object': 'message',
      'measurement': 'quantity',
      'dimension': 'agg',
      'group': 'sameDay',
      'params': {
        'time': '1d',
        'format': 'yyyy-MM-dd'
      }
    },
    {
      'dashboard': 'device',
      'object': 'message',
      'measurement': 'quantity',
      'dimension': 'agg',
      'group': 'sameMonth',
      'params': {
        'limit': 30,
        'time': '1d',
        'format': 'yyyy-MM-dd',
        'from': calculationDate(),
        'to': moment(new Date()).format('YYYY-MM-DD') + ' 23:59:59'
      }
    },
    {
      'dashboard': 'device',
      'object': 'message',
      'measurement': 'quantity',
      'dimension': 'agg',
      'group': 'month',
      'params': {
        'time': '1M',
        'format': 'yyyy-MM-dd',
        'from': calculationDate(),
        'to': moment(new Date()).format('YYYY-MM-DD') + ' 23:59:59'
      }
    }
]

/**
 * @description 查询时间段的设备消息数据
 * @param {*} from 开始时间
 * @param {*} to 结束时间
 * @param {*} time 时间显示格式
 */
export const deviceMessageDateParams = (from, to, time) => {
  let formatData = ''
  if (time === '1m') {
    formatData = 'HH时mm分'
  } else if (time === '12h') {
    formatData = 'MM月dd日HH时'
  } else {
    formatData = 'MM月dd日HH时mm分'
  }
  const params = [
    {
      'dashboard': 'gatewayMonitor',
      'object': 'deviceGateway',
      'measurement': 'received_message',
      'dimension': 'agg',
      'group': 'sameDay',
      'params': {
        'time': time || '1m',
        'limit': 60,
        'format': formatData,
        'from': from,
        'to': to
      }
    }
  ]
  return params
}

/**
 * @description 模拟历史设备在线数据
 */
export const defaultHistoryData = [
  {
    'group': 'aggOnline',
    'data': {
      'value': 10006.0,
      'timeString': '2021-03-08',
      'timestamp': 1615132800000
    }
  },
  {
    'group': 'aggOnline',
    'data': {
      'value': 10002.0,
      'timeString': '2021-03-07',
      'timestamp': 1615046400000
    }
  },
  {
    'group': 'aggOnline',
    'data': {
      'value': 9999.0,
      'timeString': '2021-03-06',
      'timestamp': 1614960000000
    }
  },
  {
    'group': 'aggOnline',
    'data': {
      'value': 9999.0,
      'timeString': '2021-03-05',
      'timestamp': 1614873600000
    }
  },
  {
    'group': 'aggOnline',
    'data': {
      'value': 9999.0,
      'timeString': '2021-03-04',
      'timestamp': 1614787200000
    }
  },
  {
    'group': 'aggOnline',
    'data': {
      'value': 9998.0,
      'timeString': '2021-03-03',
      'timestamp': 1614700800000
    }
  },
  {
    'group': 'aggOnline',
    'data': {
      'value': 9998.0,
      'timeString': '2021-03-02',
      'timestamp': 1614614400000
    }
  },
  {
    'group': 'aggOnline',
    'data': {
      'value': 9998.0,
      'timeString': '2021-03-01',
      'timestamp': 1614528000000
    }
  },
  {
    'group': 'aggOnline',
    'data': {
      'value': 9998.0,
      'timeString': '2021-02-28',
      'timestamp': 1614441600000
    }
  }
]

/**
 * @description 处理chart显示数据
 * @param {*} x 时间
 * @param {*} y 值
 */
export function handleChartData (data, xtype = '') {
  return data.map(item => {
    return {
      x: xtype ? item.data[xtype] : moment(item.data.timestamp).format('YYYY-MM-DD'),
      y: item.data.value
    }
  })
}

/**
 * @description 处理设备信息到页面显示的格式
 */
export function handleDeviceInfo (data) {
  const result = {}
  if (!data.length) {
    return result
  }

  const deviceCountData = data.filter(item => item.group === 'deviceCount')
  const deviceNotActiveData = data.filter(item => item.group === 'deviceNotActive')
  const deviceOnlineData = data.filter(item => item.group === 'deviceOnline')
  const deviceHistoryData = defaultHistoryData || data.filter(item => item.group === 'aggOnline')

  if (deviceCountData.length) {
    result['total'] = deviceCountData[0].data.value
  }
  if (deviceNotActiveData.length) {
    result['notActive'] = deviceNotActiveData[0].data.value
  }
  if (deviceOnlineData.length) {
    result['online'] = deviceOnlineData[0].data.value
  }
  if (deviceHistoryData.length) {
    result['historyOnline'] = handleChartData(defaultHistoryData)
  }
  return result
}

/**
 * @description 处理今日设备消息到页面显示的格式
 */
export function handleDeviceMessageInfo (data) {
  const result = {}
  if (!data.length) {
    return result
  }
  const MessageTodayNum = data.filter(item => item.group === 'sameDay')
  const MessageMonthNum = data.filter(item => item.group === 'month')
  const MessageMonthChartNum = data.filter(item => item.group === 'sameMonth')

  if (MessageTodayNum.length) {
    result['todayNum'] = MessageTodayNum.filter(v => v.data.timestamp === 0)[0].data.value
  }
  if (MessageMonthNum.length) {
    result['monthNum'] = MessageMonthNum.filter(v => v.data.timestamp === 0)[0].data.value
  }
  if (MessageMonthChartNum.length) {
    result['monthData'] = handleChartData(MessageMonthChartNum, 'timeString')
  }
  return result
}

/**
 * @description 处理时间段设备消息到页面显示的格式
 */
export function handleDeviceMessageData (data) {
  const result = []
  const ticksList = []
  if (!data.length) {
    return result
  }
  const Data = data.map((item, index) => {
    if (item.data.timestamp % 4 === 0 && item.data.timestamp !== 0) {
      ticksList.push(item.data.timeString)
    }
    return {
      year: item.data.timeString,
      value: item.data.value
    }
  })
  return {
    Data,
    ticksList
  }
}
