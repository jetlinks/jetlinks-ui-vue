<template>
  <div class="region-map">
    <AMapComponent
        @init="initMap"
    >
      <el-amap-polygon
          v-if="overlay.type === 'polygon'"
          :key="JSON.stringify(overlay.path || [])"
          :editable="overlay.editable"
          :path="overlay.path"
          :visible="visible"
          @addnode="polygonDraw"
          @adjust="polygonDraw"
          @init="overlaysInit"
          @removenode="polygonDraw"
      />
      <el-amap-circle
          v-else-if="overlay.type === 'circle'"
          :key="`${overlay.radius}_${JSON.stringify(overlay.path || [])}`"
          :center="overlay.path"
          :editable="overlay.editable"
          :radius="overlay.radius"
          :visible="visible"
          @adjust="circleDraw"
          @init="overlaysInit"
      />
      <el-amap-rectangle
        v-else-if="overlay.type === 'rectangle'"
        :key="JSON.stringify(overlay.path || [])"
        :bounds="overlay.path"
        :editable="overlay.editable"
        :visible="visible"
        @adjust="rectangleDraw"
        @init="overlaysInit"
      />
      <el-amap-mouse-tool
          v-else-if="overlay.type === 'create' && toolType"
          :type="toolType"
          @draw="toolDraw"
      />
    </AMapComponent>
    <div v-show="overlay.editable || overlay.type === 'create'" class="map-tool">
      <div class="map-tool-content">
        <div class="tool-item-group">
          <div class="tool-item">
            <j-tooltip title="双击保存描点" >
              <AIcon type="QuestionCircleOutlined" />
            </j-tooltip>
          </div>
        </div>
        <div class="tool-item-group">
          <div :class="{'tool-item': true, 'active': toolType === 'rectangle'}" @click="() => { drawOverlays('rectangle') }">
            <j-tooltip title="矩形" >
              <AIcon type="icon-huajuxing" />
            </j-tooltip>
          </div>
          <div :class="{'tool-item': true, 'active': toolType === 'circle'}" @click="() => { drawOverlays('circle') }">
            <j-tooltip title="圆" >
              <AIcon type="icon-draw-circle" />
            </j-tooltip>
          </div>
          <div :class="{'tool-item': true, 'active': toolType === 'polygon'}" @click="() => { drawOverlays('polygon') }">
            <j-tooltip title="多边形" >
              <AIcon type="icon-huaduobianxing" />
            </j-tooltip>
          </div>
        </div>
<!--        <div class="tool-item-group">-->
<!--          <div class="tool-item">-->
<!--            <j-tooltip title="缩放" >-->
<!--              <AIcon type="GetwayOutlined" />-->
<!--            </j-tooltip>-->
<!--          </div>-->
<!--          <div class="tool-item">-->
<!--            <j-tooltip title="旋转" >-->
<!--              <AIcon type="GetwayOutlined" />-->
<!--            </j-tooltip>-->
<!--          </div>-->
<!--        </div>-->
        <div class="tool-item-group">
          <div :class="{'tool-item': true, 'disabled': historyList.length <= 1 }" @click="cancel">
            <j-tooltip title="撤销" >
              <AIcon type="RollbackOutlined" />
            </j-tooltip>
          </div>
          <div class="tool-item">
            <j-tooltip title="删除" @click="deleteOverlays">
              <AIcon type="DeleteOutlined" />
            </j-tooltip>
          </div>
        </div>
      </div>

    </div>
  </div>

</template>

<script name="RegionMap" setup>
const props = defineProps({
  path: {
    type: Array,
    default: () => []
  },
  radius: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    default: 'polygon'
  },
})

const emit = defineEmits('dragend')
const MapRef = ref()
const toolType = ref('')
const historyList = ref([])

const overlay = reactive({
  type: props.type,
  path: props.path,
  center: [],
  editable: false,
  status: 0 // 0 预览；1 编辑
})

const visible = computed(() => {
  return true
})

const setHistory = (data) => {
  if (historyList.value.length > 10) {
    historyList.value.shift()
  }
  historyList.value.push(data)
}
const initMap = (e) => {
  MapRef.value = e
}

const polygonDraw = (e) => {

  const target = e.target
  const path = target.getPath()
  setHistory({
    type: 'polygon',
    toolType: toolType.value,
    editable: true,
    path: path.map(item => [item.lng, item.lat]),
  })
}

const circleDraw = (e) => {
  setHistory({
    type: 'circle',
    toolType: toolType.value,
    editable: true,
    path: [e.lnglat.lng, e.lnglat.lat],
    radius: e.radius
  })
}

const rectangleDraw = (e) => {
  const northEast = e.bounds.getNorthEast()
  const southWest = e.bounds.getSouthWest()
  const path = [
      [southWest.lng, southWest.lat],
      [northEast.lng, northEast.lat]
  ]

  setHistory({
    type: 'rectangle',
    toolType: toolType.value,
    editable: true,
    path: path,
  })
}

const overlaysInit = (e) => {
  if (MapRef.value) {
    MapRef.value.setFitView(e)
  }
}

const drawOverlays = (e) => {
  overlay.type = 'create'
  toolType.value = e
}

const toolDraw = (e) => {
  if (toolType.value === 'circle') {
    overlay.path = e.center
    overlay.radius = e.radius
  } else {
    overlay.path = e
  }
  overlay.editable = true
  overlay.type = toolType.value
  setHistory({
    type: toolType.value,
    toolType: toolType.value,
    editable: overlay.editable,
    path: overlay.path,
    radius: overlay.radius
  })
}

const deleteOverlays = () => {
  overlay.type = 'create'
  overlay.editable = false
  toolType.value = ''

  setHistory({
    type: 'create',
    toolType: '',
    editable: false,
    path: [],
    radius: 0
  })
}

const cancel = () => {
  if (historyList.value.length > 1) {
    historyList.value.pop()
  }

  const oldData = historyList.value[historyList.value.length - 1]

  if (oldData) {
    overlay.type = oldData.type
    overlay.editable = oldData.editable
    overlay.path = oldData.path
    overlay.radius = oldData.radius
    toolType.value = oldData.toolType
  }
}

</script>

<style lang="less" scoped>
.region-map {
  position: relative;
  height: 100%;

  .map-tool{
    position: absolute;
    top: 20%;
    right: 20px;


    .map-tool-content {
      display: flex;
      gap: 24px;
      flex-direction: column;

      .tool-item-group {
        display: flex;
        flex-direction: column;
        border: 1px solid #e3e3e3;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 0 16px rgba(#000, .15);

        .tool-item {
          padding: 4px 6px;
          color: #333;
          font-size: 16px;

          &:first-child {
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
          }

          &:last-child {
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
          }

          &:not(:first-child) {
            border-top: 1px solid #e3e3e3;
          }

          &.active {
            background-color: var(--ant-primary-color);
            color: #fff;
          }

          &.disabled {
            cursor: not-allowed !important;
            background-color: #efefef;

            > span {
              cursor: not-allowed !important;
              color: #666;
            }
          }
        }
      }
    }

  }
}
</style>
