<template>
      <j-page-container>
        <router-view>
        123123123
        <j-permission-button
          type="primary"
          @click="mapClick"
        >
          <template #icon>
            123
          </template>
          测试
        </j-permission-button>

        <permission-button
          type="primary"
          :tooltip="{
            title: '测试'
          }"
        >
          <template #button>
            button
          </template>
        </permission-button>
          <component v-if="_component" :is="_component" data="12312321"> 12312</component>
          <RemoteComponent
            remoteName="device-manager-ui"
            componentName="Title"
            remotePath="http://localhost:8081/assets/remoteEntry.js"
            :componentProps="{
              data: '这是一段文字'
            }"
          />
        </router-view>
      </j-page-container>
</template>

<script setup name="Demo" lang="ts">
import { useRouter } from 'vue-router'
import { moduleRegistry } from '@/utils/module-registry'

const router = useRouter()
const _component = ref()

const mapClick = async (e: any) => {
  console.log( moduleRegistry.getResourceItem('device-manager-ui', 'apis', 'productNoPage'))
  _component.value = moduleRegistry.getResourceItem('device-manager-ui', 'components', 'Title')
}
</script>

<style scoped>

</style>
