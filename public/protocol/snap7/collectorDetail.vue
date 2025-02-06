<script setup>
import { inject, watch } from 'vue'

const { addList, data } = inject('detail-context')

const handleData = (dt) => {
  if (dt?.id) {
    const list = [
      {
        label: 'IP',
        value: data.configuration?.host
      },
      {
        label: '端口',
        value: data.configuration?.port
      },
      {
        label: '机架号',
        value: data.configuration?.rack
      },
      {
        label: '型号',
        value: data.configuration?.slot
      },
      {
        label: '超时时间（毫秒）',
        value: data.configuration?.timeout
      },
      {
        label: '数据读取方式',
        value: data.configuration?.serializable ? '串行' : '并行',
      }
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
