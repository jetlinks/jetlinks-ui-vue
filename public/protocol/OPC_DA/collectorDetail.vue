<script setup>
import { inject, watch } from 'vue'

const { addList, data } = inject('detail-context')

const handleData = (dt) => {
  if (dt?.id) {
    const list = [
      {
        label: 'clsId',
        value: data.configuration?.clsId
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
