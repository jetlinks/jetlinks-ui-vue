<template>
  <div class="metadata-edit-table-body-viewport" :style="{ ...style, maxHeight: height + 'px'}" ref="viewScrollRef">
    <div class="metadata-edit-table-body-container" :style="containerStyle">
      <div class="metadata-edit-table-center" :style="containerStyle">
        <div
          v-if="virtualData.length"
          v-for="(item, index) in virtualData"
          :class="{
            'metadata-edit-table-row': true,
          }"
          :key="`record_${item.__serial}`"
          :style="{height: `${cellHeight}px`, transform: `translateY(${item.__top}px)`}"
          @click.right.native="(e) => showContextMenu(e,item)"
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
import ContextMenu from './components/ContextMenu'

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
    default: 50
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
const virtualData = ref([])
const virtualRang = reactive({
  start: 0
})
const dataSourceCache = ref([])
const containerStyle = ref(0)

let scrollLock = ref(false)

const maxLen = computed(() => {
  return Math.trunc(props.height / props.cellHeight)
})

const handleDataSourceCache = () => {
  scrollLock.value = false

  const itemHeight = props.cellHeight

  containerStyle.value = {
    height: props.dataSource.length * props.cellHeight + 'px'
  }

  dataSourceCache.value = props.dataSource.reduce((prev, next, index) => {
    let top = 0
    if (index !== 0) {
      const lastItem = prev[prev.length - 1]
      top = lastItem.__top + itemHeight
    }

    next.__top = top
    next.__serial = index + 1
    next.__index = index

    prev.push(next)

    return prev
  }, [])
}

const updateVirtualData = (start, end) => {
  virtualData.value = dataSourceCache.value.slice(start, end)
}

const onScroll = () => {
  const height = viewScrollRef.value.scrollTop
  const clientHeight = viewScrollRef.value.clientHeight
  const scrollHeight = viewScrollRef.value.scrollHeight

  const index = Math.round(height / props.cellHeight) - 3
  const start = index < 0 ? 0 : index
  const end = start + maxLen.value + 4

  virtualRang.start = start

  if (height + clientHeight >= scrollHeight && !scrollLock.value) { // 滚动到底
    emit('scrollDown')
    scrollLock.value = true
  }

  virtualData.value = dataSourceCache.value.slice(start, end)
}

const showContextMenu = (e, record) => {
  e.preventDefault()
  ContextMenu(e, record)
}

onMounted(() => {
  updateVirtualData(0, maxLen.value)
  viewScrollRef.value.addEventListener('scroll', onScroll)
})

onBeforeUnmount(() => {
  viewScrollRef.value.removeEventListener('scroll', onScroll)
})

watch(() => [props.dataSource.length, viewScrollRef.value], (val, oldVal) => {
  if (val[0] !== oldVal?.[0]) { // 长度不一致时更新内部缓存DataSource
    handleDataSourceCache()
  }

  if (props.dataSource.length <= maxLen.value) {
    emit('scrollDown', maxLen.value - props.dataSource.length + 5)
    updateVirtualData(0, maxLen.value)
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

        &:hover {
          background-color: rgb(248, 248, 248);
        }

        .body-cell-box {
          padding: 0 12px;
        }
      }
    }
  }
}
</style>