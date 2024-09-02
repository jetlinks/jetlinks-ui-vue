<template>
  <j-scrollbar :height="`calc(100% - 51px)`">
    <a-spin :spinning="loading">
      <div style="padding: 0 10px">
        <div class="alert">
          <AIcon type="InfoCircleOutlined" />
          你可以在该页面选择需要订阅的主题及接收通知的方式。
        </div>
        <div class="content-collapse">
          <template v-if="dataSource.length">
            <a-collapse
              :bordered="false"
              v-model:activeKey="activeKey"
              expand-icon-position="right"
            >
              <template #expandIcon="{ isActive }">
                <AIcon
                  type="CaretRightOutlined"
                  :style="{
                    transform: `rotate(${isActive ? 90 : 0}deg)`,
                  }"
                />
              </template>
              <a-collapse-panel
                v-for="item in dataSource"
                :key="item.provider"
                :header="item.name"
              >
                <div>
                  <template v-for="child in item.children" :key="child.id">
                    <Item
                      @refresh="handleSearch"
                      :data="child"
                      :subscribe="
                        subscribe.find(
                          (i) => i?.topicProvider === child?.provider,
                        )
                      "
                    />
                  </template>
                </div>
              </a-collapse-panel>
            </a-collapse>
          </template>
          <j-empty style="margin: 200px 0" v-else />
        </div>
      </div>
    </a-spin>
  </j-scrollbar>
</template>

<script lang="ts" setup>
import { getAllNotice } from '@/api/account/center'
import { getNoticeList_api } from '@/api/account/notificationSubscription'
import { getInitData } from '../data'
import Item from './components/Item.vue'
import { useMenuStore } from '@/store/menu'

const menuStore = useMenuStore()
const subscribe = ref<any[]>([])
const dataSource = ref<any[]>([])
const activeKey = ref<string[]>()
const loading = ref<boolean>(false)
let initData: any[]
const handleSearch = () => {
  loading.value = true
  getAllNotice().then((resp: any) => {
    if (resp.status === 200) {
      const arr = initData
        .map((item: any) => {
          const _child = item.children.map((i: any) => {
            const _item = (resp.result || []).find(
              (t: any) => t?.provider === i?.provider,
            )
            return {
              ...i,
              ..._item,
            }
          })
          return {
            ...item,
            children: _child,
          }
        })
        .filter((it: any) => {
          return it.children.filter((lt: any) => lt?.id)?.length
        })
        .map((item) => {
          return {
            ...item,
            children: item.children.filter((lt: any) => lt?.id),
          }
        })
      dataSource.value = arr
    }
  })
  getNoticeList_api()
    .then((resp: any) => {
      if (resp.status === 200) {
        subscribe.value = resp?.result?.data || []
      }
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  const keys = ['alarm', 'system-monitor', 'system-business']
  if (menuStore.hasMenu('process')) {
    keys.push('workflow-notification')
  }
  activeKey.value = keys
  initData = getInitData()
  handleSearch()
})
</script>

<style lang="less" scoped>
.alert {
  padding-left: 10px;
  color: #999999;
  margin-bottom: 16px;
}

.content-collapse {
  :deep(.ant-collapse) {
    border-color: #ebeef3;
    background-color: #fff;

    .ant-collapse-item {
      border: 1px solid #ebeef3;
      margin-bottom: 24px;
    }

    .ant-collapse-header {
      background-color: #f7f8fa;
      height: 42px;
    }

    .ant-collapse-content {
      padding: 17px 21px 7px 21px;
    }

    .ant-collapse-content-box {
      padding: 0;
    }
  }
}
</style>
