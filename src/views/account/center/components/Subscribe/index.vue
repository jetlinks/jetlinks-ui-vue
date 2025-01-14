<template>
  <j-scrollbar :height="`calc(100% - 51px)`">
    <a-spin :spinning="loading">
      <div style="padding: 0 10px">
        <div class="alert">
          <AIcon type="InfoCircleOutlined" />
          {{ $t('Subscribe.index.994011-0') }}
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
import { omit } from 'lodash-es';

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
      const dataMap = new Map()
            resp.result.forEach((i: any) => {
                if (!dataMap.has(i.type.id)) {
                    dataMap.set(i.type.id, {
                        name: i.type.name,
                        provider: i.type.id,
                        children: [
                            {
                                ...omit(i, ['type'])
                            }
                        ]
                    })
                } else {
                    dataMap.get(i.type.id).children.push({
                        ...omit(i, ['type'])
                    })
                }
            })
            dataSource.value = [...dataMap.values()];
            if (!activeKey.value) {
                activeKey.value = dataSource.value.map((i:any)=>{
                    return i?.provider
                })
            }
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
