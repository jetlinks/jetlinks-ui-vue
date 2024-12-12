<template>
  <div class="region-map">
    <AMapComponent
      ref="mapRef"
    >
      <el-amap-polygon
        v-if="showPolygon && pathData?.length"
        :path="pathData"
        :editable="isEdit"
        :key="layerId"
        @dragend="dragend"
        @adjust="dragend"
        @removenode="dragend"
        @addnode="dragend"
        @init="polygonInit"
      />
      <el-amap-circle
        v-if="showCircle"
        :radius="pathData.radius"
        :center="pathData.center"
        :editable="isEdit"
        @dragend="dragend"
      />
      <el-amap-rectangle
        v-if="showRectangle && pathData?.length"
        :bounds="pathData"
        :editable="isEdit"
        :key="layerId"
        @dragend="dragend"
        @adjust="dragend"
        @removenode="dragend"
        @addnode="dragend"
        @init="polygonInit"
      />
      <DistrictSearch
        v-if="showDistrict"
        :adcode="adbode"
        :styles="{
          'stroke-width': 2,
          'fill': 'rgba(0,176,255, 0.2)'
        }"
      />
      <GeoJson
        v-if="showGeoJson"
        :geo="pathData"
      />
      <el-amap-mouse-tool
        v-if="showTool"
        :type="toolType"
        @draw="toolDraw"
      />
    </AMapComponent>
    <div class="map-tool" v-if="showToolDom">
      <div class="map-tool-content">
        <div class="tool-item-group">
          <div class="tool-item" @click="toolSave">
            <a-tooltip :title="$t('MapTool.map.633284-0')" >
              <AIcon type="SaveOutlined" />
            </a-tooltip>
          </div>
          <div class="tool-item" @click="toolClose">
            <a-tooltip :title="$t('MapTool.map.633284-1')" >
              <AIcon type="CloseOutlined" />
            </a-tooltip>
          </div>
        </div>
        <div class="tool-item-group">
          <div :class="{'tool-item': true, 'active': toolType === 'rectangle'}" @click="changeToolType(MAP_TOOL.rectangle)">
            <a-tooltip :title="$t('MapTool.map.633284-2')" >
              <AIcon type="icon-huajuxing" />
            </a-tooltip>
          </div>
          <div :class="{'tool-item': true, 'active': toolType === 'polygon'}" @click="changeToolType(MAP_TOOL.polygon)">
            <a-tooltip :title="$t('MapTool.map.633284-3')" >
              <AIcon type="icon-huaduobianxing" />
            </a-tooltip>
          </div>
        </div>
        <div class="tool-item-group">
          <div :class="{'tool-item': true, 'disabled': !hasHistory }" @click="onRevoke">
            <a-tooltip :title="$t('MapTool.map.633284-4')" >
              <AIcon type="RollbackOutlined" />
            </a-tooltip>
          </div>
          <div class="tool-item" @click="onDelete">
            <a-tooltip :title="$t('MapTool.map.633284-5')">
              <AIcon type="DeleteOutlined" />
            </a-tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script name="RegionMap" setup>
import {useHistory, useRegion} from "../hooks";
import { MAP_TOOL } from '../util'
import { DistrictSearch, GeoJson } from '@/components/AMapComponent'
import { randomNumber,onlyMessage } from '@jetlinks-web/utils'
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const regionState = useRegion()
const { revoke, addRecord, reset, hasHistory } = useHistory()

const toolType = ref()
const showTool = ref(false)
const showToolDom = ref(false)
const adbode = ref()
const pathData = ref()
const isEdit = ref(false)
const layerId = ref('layer')
const mapRef = ref()

const toolDrawCache = ref()

const showPolygon = computed(() => {
  return regionState.type === MAP_TOOL.polygon
})

const showRectangle = computed(() => {
  return regionState.type === MAP_TOOL.rectangle
})

const showCircle = computed(() => {
  return regionState.type === MAP_TOOL.circle
})

const showDistrict = computed(() => {
  return regionState.type === MAP_TOOL.district
})

const showGeoJson = computed(() => {
  return regionState.type === MAP_TOOL.geoJson
})

const toolDraw = (e) => {

  regionState.type = toolType.value
  isEdit.value = true
  pathData.value = e

  handleGeoJson(toolType.value, e)

  showTool.value = false
  toolType.value = undefined

  if (!hasHistory.value) {
    addRecord(null)
  }
  addRecord({
    isEdit: isEdit.value,
    pathData: e,
    toolType: toolType.value,
    id: randomNumber()
  })
}


const dragend = (e) => {
  let paths = []
  if (e.getPath) {
    paths = e.getPath()
  } else if(e.target?.getPath){
    paths = e.target.getPath()
  } if (e.bounds) {
    const { northEast, southWest} = e.bounds
    paths = [
      [northEast.lng, northEast.lat],
      [southWest.lng, southWest.lat],
    ]
  }


  addRecord({
    isEdit: isEdit.value,
    pathData: paths,
    toolType: regionState.type,
    id: randomNumber()
  })
  handleGeoJson(regionState.type, paths)
}


const handleGeoJson = (type, data) => {
  toolDrawCache.value = {
    type: 'Feature',
    toolType: type,
    features: [{
      type: 'FeatureCollection',
      properties: {
        type: type
      },
      geometry: {
        type:"Polygon",
        coordinates: type === MAP_TOOL.polygon ? [data] : data
      }
    }]
  }
}

const changeToolType = (type) => {
  showTool.value = true
  toolType.value = type
  isEdit.value = false
  regionState.type = undefined
}

const showToolFn = (geoJson) => {
  toolDrawCache.value = geoJson
  showToolDom.value = true
}

const toolSave = () => {
  if (toolDrawCache.value) {
    regionState.openSave(toolDrawCache.value)
  } else {
    onlyMessage($t('MapTool.map.633284-6'),'warning')
  }
}

const toolClose = () => { // 取消操作
  showTool.value = false
  toolType.value = undefined
  regionState.openSave()
}

const showDistrictFn = (code) => {
  adbode.value = code.toString().padEnd(6, '0')
}

const showGeoJsonFn = (geoJson) => {
  pathData.value = geoJson

  addRecord({
    isEdit: true,
    pathData: geoJson,
    toolType: regionState.type,
    id: randomNumber()
  })
}

const openEdit = () => {
  isEdit.value = true
  layerId.value = randomNumber()
}

const onDelete = () => {
  isEdit.value = false
  regionState.type = undefined
  toolType.value = undefined
  pathData.value = undefined
  toolDrawCache.value = undefined

  addRecord({
    isEdit: false,
    pathData: [],
    toolType: '',
    id: randomNumber()
  })
}

const readOnly = () => {
  isEdit.value = false
  showToolDom.value = false
}

const onRevoke = () => {
  const item = revoke()

  isEdit.value = item?.isEdit || false
  pathData.value = item?.pathData || []
  regionState.type = item?.toolType
  layerId.value = item?.id || randomNumber()
}

const initState = () => {
  isEdit.value = false
  showTool.value = false
  showToolDom.value = false
  adbode.value = undefined
  toolType.value = undefined
  pathData.value = undefined
}

const polygonInit = (e) => {
  const bounds = e.getBounds()
  mapRef.value?.setBounds(bounds)
}

const init = () => {
  initState()
  reset()
}

defineExpose({
  showTool: showToolFn,
  showDistrict: showDistrictFn,
  showGeoJson: showGeoJsonFn,
  openEdit: openEdit,
  init: init,
  readOnly: readOnly,
})

</script>

<style lang="less" scoped>
.region-map {
  position: relative;
  //height: 800px;
  height: 100%;

  .map-tool{
    position: absolute;
    top: 20%;
    right: 20px;
    z-index: 3;


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
