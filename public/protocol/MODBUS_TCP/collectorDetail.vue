<script setup>
import { inject, watch } from 'vue'

const { addList, data } = inject('detail-context')

const optionsMap = {
  'BIG': 'AB',
  'LITTLE': 'BA'
}
const handleData = (dt) => {
  if (dt?.id) {
    const list = [
      {
        label: '从机地址',
        value: data.configuration?.unitId
      },
      {
        label: '端口',
        value: data.configuration?.port
      },
      {
        label: '双字高低位切换',
        value: optionsMap[data.configuration?.endian]
      },
      {
        label: '单字高低位切换',
        value: optionsMap[data.configuration?.endianIn]
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
