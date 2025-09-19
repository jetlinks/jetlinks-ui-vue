<template>
      <j-page-container>
        <router-view>
        123123123
        <j-permission-button
          type="primary"
          @click="mapClick"
        >
          组件
        </j-permission-button>
          <a-button @click="deviceList">
            查询
          </a-button>

          <a-select style="width: 200px" :options="list" />

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
          <div style="padding: 12px;background-color: #fff;margin-top: 16px">
            <component v-if="_component" :is="_component" data="12312321"> 12312</component>
            <RemoteComponent
              remoteName="authentication-manager-ui"
              componentName="Calendar"
              remotePath="http://localhost:8081/assets/remoteEntry.js"
              :componentProps="{
                data: '这是一段文字'
              }"
            />
          </div>
        </router-view>
      </j-page-container>
</template>

<script setup name="Demo" lang="ts">
import { useRouter } from 'vue-router'
import { moduleRegistry } from '@/utils/module-registry'

const router = useRouter()
const list = ref([])
const _component = ref()

const deviceList = async () => {
  const listRequest = moduleRegistry.getResourceItem('device-manager-ui', 'apis', 'productNoPage')
  const resp = await listRequest()
  if (resp.success) {
    list.value = resp.result.map(item => ({ label: item.name, value: item.id }))
  }
}

const mapClick = async (e: any) => {
  console.log( )
  _component.value = moduleRegistry.getResourceItem('authentication-manager-ui', 'components', 'Calendar')
}
</script>

<style scoped>

</style>
