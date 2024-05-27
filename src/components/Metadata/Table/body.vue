<template>
  <div class="metadata-edit-table-body-viewport" :style="{ ...style, maxHeight: height + 'px'}" ref="viewScrollRef">
    <div class="metadata-edit-table-body-container" :style="containerStyle">
      <div class="metadata-edit-table-center" :style="containerStyle">
        <div
          v-for="(item, index) in virtualData"
          :class="{
            'metadata-edit-table-row': true,
          }"
          :style="{height: `${cellHeight}px`, transform: `translateY(${item.__top}px)`}"
        >
          <div
            v-for="column in columns"
            class="metadata-edit-table-cell"
            :key="`_${columns.dataIndex}`"
            :style="{
              width: `${column.width}px`,
              left: `${column.left}px`,
            }"
          >
            <div v-if="column.dataIndex === '__serial'" class="body-cell-box">
              {{ item[column.dataIndex] }}
            </div>
            <div v-else class="body-cell-box">
              <slot :name="column.dataIndex" :record="item" :index="item.__index" :column="column" >
                {{ item[column.dataIndex] }}
              </slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="MetadataBaseTableBody">

const props = defineProps({
  dataSource: {
    type: Array,
    default: () => ([])
  },
  columns: {
    type: Array,
    default: () => ([])
  },
  cellHeight: {
    type: Number,
    default: 66
  },
  height: {
    type: Number,
    default: 300
  },
  style: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:dataSource', 'scrollDown'])

const viewScrollRef = ref()

const indexOf = reactive({
  start: 0,
  end: 10,
})

const containerStyle = computed(() => {
  return {
    height: props.dataSource.length * props.cellHeight + 'px'
  }
})

const dataSourceCache = computed(() => {
  const itemHeight = props.cellHeight
  return props.dataSource.reduce((prev, next, index) => {
    let top = 0
    if (index !== 0) {
      const lastItem = prev[prev.length - 1]
      top = lastItem.__top + itemHeight
    }

    next.__top = top
    next.__serial = index + 1

    prev.push(next)

    return prev
  }, [])

})

const maxLen = computed(() => {
  return Math.trunc(props.height / props.cellHeight)
})

const virtualData = ref([])

const updateVirtualData = () => {
  virtualData.value = dataSourceCache.value.slice(indexOf.start, indexOf.end)
}

const onScroll = () => {
  const height = viewScrollRef.value.scrollTop
  const clientHeight = viewScrollRef.value.clientHeight
  const scrollHeight = viewScrollRef.value.scrollHeight

  const start = Math.round(height / props.cellHeight) - 3
  const end = start + maxLen.value + 4

  indexOf.start = start >= 0 ? start : 0
  indexOf.end = end

  if (height + clientHeight === scrollHeight) { // 滚动到底
    emit('scrollDown')
  } else {
    updateVirtualData()
  }

}

onMounted(() => {
  onScroll()
  viewScrollRef.value.addEventListener('scroll', onScroll)
})

onBeforeUnmount(() => {
  viewScrollRef.value.removeEventListener('scroll', onScroll)
})

watch(() => props.dataSource.length, (len) => {
  if (len) {
    if (viewScrollRef.value) {
      updateVirtualData()
    }
  } else {

  }

}, { immediate: true})

</script>

<style scoped lang="less">
.metadata-edit-table-body-viewport {
  height: 100%;
  max-height: 100%;
  width: 100%;
  //width: calc(100% - 17px);
  overflow: hidden auto;

  .metadata-edit-table-body-container {
    overflow: hidden;
    transform: translateZ(0px);
    min-height: 100%;

    .metadata-edit-table-center {
      position: relative;
      flex: 1 1 auto;
      min-width: 0;
      min-height: 100%;

      .metadata-edit-table-row {
        width: 100%;
        display: flex;
        align-items: center;
        position: absolute;
        transition: top .2s, height .2s, background-color .1s;
        border-bottom: 1px solid #ebebeb;

        .body-cell-box {
          padding: 0 12px;
        }
      }
    }
  }
}
</style>
