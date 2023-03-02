import { defineStore } from "pinia";

export const useAlarmStore = defineStore('alarm', () => {
  const data = reactive({
    tab: 'all',
    current: {},
    solveVisible: false,
    logVisible: false,
    defaultLevel: [],
    columns: [
      {
        dataIndex: 'alarmConfigName',
        title: '告警名称',
        // hideInSearch: true,
      },
      {
        dataIndex: 'alarmTime',
        title: '告警时间',
        valueType: 'dateTime',
      },
      {
        dataIndex: 'description',
        title: '说明',
        // hideInSearch: true,
      },
      {
        dataIndex: 'action',
        title: '操作',
        hideInSearch: true,
        valueType: 'option',
      },
    ],
  })
  return {
    data
  }
})


export const useAlarmConfigurationStore = defineStore('alarmConfigration', () => {
  const configurationData = reactive({
    current:{

    }
  })
  return { configurationData }
})