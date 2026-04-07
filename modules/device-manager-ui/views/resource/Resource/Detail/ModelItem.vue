<template>
  <div>
    <div class="item-name fz-18">
      <j-ellipsis>{{ value.name }}</j-ellipsis>
    </div>
    <div
      class="tags-container"
      ref="container"
    >
      <div
        class="tags-wrapper"
        ref="wrapper"
      >
        <div
          v-for="(child, index) in value.children || []"
          class="tag-content"
          :key="child.id"
        >
          <div class="tag">
            <j-ellipsis>{{ child.name }}</j-ellipsis>
          </div>
          <a-tooltip v-if="index === _index">
            <template #title>
              <div
                v-for="i in value.children || []"
                :key="i.id"
              >
                {{ i.name }}
              </div>
            </template>
            ...
          </a-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  }
})

const _index = ref(-1)
const container = ref(null)
const wrapper = ref(null)

function adjustEllipsis() {
  _index.value = -1
  if (container.value && wrapper.value) {
    // 检查是否超出两行
    if (wrapper.value.scrollHeight > container.value.clientHeight) {
      // 获取所有标签
      const tags = Array.from(wrapper.value.querySelectorAll('.tag'))

      // 找到第二行的最后一个标签
      const containerWidth = container.value.clientWidth
      let accumulatedWidth = 0

      for (let i = 0; i < tags.length; i++) {
        const tag = tags[i]
        const tagWidth = tag.offsetWidth + 8 // 包括 gap

        // 锁定第二行
        if (tag.offsetTop > 32) {
          // 刚好一排, 一个超过一排
          if (containerWidth <= tagWidth) {
            _index.value = i
            break
          }

          // 第二行无法再放一个的情况
          if (containerWidth - accumulatedWidth < tagWidth) {
            _index.value = i - 1
            break
          }
          accumulatedWidth += tagWidth
        }
      }
    }
  }
}

watch(
  () => props.value,
  (val) => {
    if (val) {
      adjustEllipsis()
    }
  },
  { immediate: true, deep: true }
)

onMounted(() => {
  adjustEllipsis()
})
</script>

<style lang='less' scoped>
.item-name {
  padding-bottom: 12px;
  width: 120px;
  font-size: 16px;
}

.tags-container {
  position: relative;
  max-height: 94px;
  overflow: hidden;
}

.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 8px;
  line-height: 24px; /* 与容器高度匹配 */
}

.tag-content {
  max-width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tag {
  flex: 1;
  min-width: 0;
  font-size: 16px;
  border-radius: 6px;
  padding: 8px 24px;
  border: 1px solid @font-gray-300;
  // white-space: nowrap;
  align-items: center;
  gap: 8px;
}
</style>
