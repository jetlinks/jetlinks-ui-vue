<template>
    <j-page-container>
        <full-page fixed>
            <div class="region">
                <div class="left">
                  <div v-if="regionState.treeMask" class="left-mask"></div>
                  <div class="left-content">
                    <LeftTree ref="treeRef" @select="onSelect" @close="close"/>
                  </div>
                </div>
                <div class="right">
                  <Map ref="mapRef" :selectCode="selectCode" />
                </div>
            </div>
        </full-page>
    </j-page-container>
</template>

<script setup lang="ts" name="RegionMange">
import LeftTree from './LeftTree/index.vue'
import Map from './MapTool/map.vue'
import {REGION_KEY} from "./hooks";
import {MAP_TOOL} from "./util";

const selectCode = ref('')
const mapRef = ref()
const treeRef = ref()

const regionState = reactive({
  showTool: showTool,
  openSave: openSave,
  openEdit: openEdit,
  layerSetData: layerSetData,
  mapInit: mapInit,
  edit: false,
  editType: 'add',
  treeMask: false,
  saveCache: undefined,
  stateInit: stateInit,
  mapReadOnly: mapReadOnly,
  prevSelect: {}
})

provide(REGION_KEY, regionState)

const onSelect = (code: string, node: Record<string, any>) => {
  if (!node) return

  if (node.properties?.partition === 'geoJson') {
    mapRef.value?.showGeoJson(node.geoJson)
    regionState.type = MAP_TOOL.geoJson
  } else if(node.properties?.partition === 'manual') {
    layerSetData(node.geoJson, false)
    } else {
    mapRef.value?.showDistrict(code)
    regionState.type = MAP_TOOL.district
  }

  regionState.prevSelect = {
    code, node
  }
}

const close = () => {
  if (regionState.prevSelect.code) {
    onSelect(regionState.prevSelect.code, regionState.prevSelect.node)
  }
}

function stateInit() {
  regionState.edit = false
  regionState.treeMask = false
  regionState.saveCache = undefined
  regionState.type = undefined
  regionState.editType = 'add'
  mapInit()
}

function openSave(geoJson: Record<string, any>){
  treeRef.value?.openSave(geoJson)
}

function showTool(type: string) {
  mapRef.value?.showTool(regionState.saveCache?.geoJson)
}

function mapReadOnly(geoJson: any) {
  layerSetData(geoJson, false)
  mapRef.value?.readOnly(geoJson)
}

function openEdit() {
  mapRef.value?.openEdit()
}

function layerSetData(geoJson: Record<string, any>, edit = true) {
  regionState.type = geoJson?.features?.[0]?.properties?.type
  mapRef.value?.showGeoJson(geoJson?.features?.[0]?.geometry?.coordinates)
  if (edit) {
    mapRef.value?.openEdit()
  }
}

function mapInit() {
  mapRef.value?.init()
}

</script>

<style lang="less" scoped>
.region {
    display: flex;
    gap: 24px;
    height: 100%;
    padding: 16px;

    .left {
        width: 300px;
        position: relative;

        .left-content {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .left-mask {
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          z-index: 2;
          background-color: rgba(0,0,0, .2);
        }

        .btn {
            width: 100%;
            margin: 18px 0;
        }

        .mask {
            width: 100%;
            position: absolute;
            height: 100%;
            background-color: lightgray;
            opacity: .5;
            left: 0;
            top: 0;
            z-index: 10;
        }
    }
    .right {
        flex: 1;
    }
}
</style>
