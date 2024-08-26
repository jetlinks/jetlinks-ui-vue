<template>
    <page-container
        :tabList="list"
        :showBack="true"
        :tabActiveKey="tabActiveKey"
        @tabChange="onTabChange"
    >
        <template #title>
            <div
               class="video-detail-title"
            >
              <div class="title-body">
                <span v-if="!isEdit">
                  {{ detail?.name || '----' }}
                </span>
                <a-input v-else v-model:value="_value" />
                <PermissionButton
                  type="link"
                  :hasPermission="true"
                  :loading="loading"
                  @click="onSave(isEdit)"
                >
                  <AIcon :type="isEdit ? 'EditOutlined' : 'CheckOutlined'" />
                </PermissionButton>
              </div>
            </div>
        </template>
        <template #content>
            <a-descriptions size="small" :column="4">
                <a-descriptions-item label="计划ID">{{
                    detail?.id
                }}</a-descriptions-item>
                <a-descriptions-item label="创建人">{{detail.creatorName}}</a-descriptions-item>
                <a-descriptions-item label="创建时间">
                    {{
                        detail?.createTime
                            ? dayjs(detail.createTime).format(
                                  'YYYY-MM-DD HH:mm:ss',
                              )
                            : ''
                    }}</a-descriptions-item
                >
            </a-descriptions>
        </template>
        <FullPage>
            <div style="padding: 24px; height: 100%">
                <component
                    :is="tabs[tabActiveKey]"
                    @onJump="onTabChange"
                />
            </div>
        </FullPage>
    </page-container>
</template>

<script setup  name="Detail">
import Rule from './Rule/index.vue';
import Channel from './Channel/index.vue';
import Log from './Log/index.vue';
import dayjs from 'dayjs';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { updatePlan,queryList } from '@/api/media/auto';
import {usePlanDetailContent} from "./utils";

const isEdit = ref(false);
const route = useRoute();
const _value = ref();
const loading = ref(false);
const tabActiveKey = ref('Rule');
const detail = ref({
  schedules: [],
  others: {
    retention: 1,
    times: [],
    trigger: 'week'
  }
})

usePlanDetailContent(detail)

const list = [
    {
        key: 'Rule',
        tab: '录制规则',
    },
    {
        key: 'Channel',
        tab: '关联通道',
    },
    {
        key: 'Log',
        tab: '执行日志',
    },
];

const tabs = {
    Rule,
    Channel,
    Log,
};

const onTabChange = (e) => {
    tabActiveKey.value = e;
};

const refresh = async()=>{
    const res =  await queryList({
        terms: [
            {
                column: 'id',
                termType: 'eq',
                value: route.params.id,
            },
        ],
    });
      if(res.success){
        detail.value = Object.assign({
          schedules: [],
          others: {
            retention: 1,
            times: [],
            trigger: 'week'
          }
        }, res.result.data?.[0])
      }
}

const onSave = async (val) => {
    if(!val){
        loading.value = true;
        const res = await updatePlan({
            id: route.params.id,
            name: _value.value,
            type:'video'
        }).finally(()=>{
            loading.value = false
            isEdit.value = val;
        })
        if(res.success){
            refresh()
        }
    }else{
        isEdit.value = val
    }
};


watch(
    () => detail.value?.name,
    (val) => {
        if (val) {
            _value.value = val;
        }
    },
    { immediate: true },
);

onMounted(() => {
    refresh()
});
</script>

<style lang="less" scoped>
.video-detail-title {
  display: flex;
  align-items: center;
  justify-content: center;

  .title-body {
    display: flex;
  }
}

</style>
