<script setup>
import { inject, watch } from 'vue'

const { addList, data } = inject('detail-context')

const handleData = (dt) => {
  if (dt?.id) {
    const list = [
      {
        label: '主机地址',
        value: data.configuration?.host
      },
      {
        label: '端口',
        value: data.configuration?.port
      },
      {
        label: '连接池大小',
        value: data.configuration?.connectionLimit
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
