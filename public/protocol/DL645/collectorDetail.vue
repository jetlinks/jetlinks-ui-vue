<script setup>
import { inject, watch } from 'vue'

const { addList, data } = inject('detail-context', {
  data: {
    configuration: {}
  }
})

const handleData = (dt) => {
  if (dt?.id) {
    const list = [
      {
        label: '电表号',
        value: data.configuration?.meterNumber
      },
      {
        label: '密码权限',
        value: data.configuration?.passwordPermission
      },
      {
        label: '密码',
        value: data.configuration?.password
      },
      {
        label: '操作者id',
        value: data.configuration?.operatorCode
      },
    ]
    addList?.(list)
  }
}

watch(() => JSON.stringify(data), () => {
  handleData(data)
}, {
  immediate: true
})
</script>
