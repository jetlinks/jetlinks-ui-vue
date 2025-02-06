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
        label: '设备实例号',
        value: data.configuration?.instanceNumber
      },
      {
        label: '地址',
        value: data.configuration?.address
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
