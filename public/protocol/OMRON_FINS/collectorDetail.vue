<script setup>
import {inject, watch} from 'vue'

const {addList, data} = inject('detail-context')

const handleData = (dt) => {
  if (dt?.id) {
    const list = [
      {
        label: 'IP',
        value: data.configuration?.address
      },
      {
        label: '端口',
        value: data.configuration?.port
      },
      {
        label: '节点号',
        value: data.configuration?.['local-node']
      },
      {
        label: '设备型号',
        value: data.configuration?.deviceSeries
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
