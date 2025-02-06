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
        label: '表号',
        value: data.configuration?.meterId
      },
      {
        label: '表类型',
        value: data.configuration?.meter
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
