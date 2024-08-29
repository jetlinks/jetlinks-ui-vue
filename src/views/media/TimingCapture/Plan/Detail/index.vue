<template>
    <page-container
        :tabList="list"
        :showBack="true"
        :tabActiveKey="tabActiveKey"
        @tabChange="onTabChange"
    >
        <template #title>
            <div class="title">
                <div v-if="!isEdit">
                    {{ detail?.name || '-' }}
                    <PermissionButton
                        type="link"
                        :hasPermission="true"
                        :loading="loading"
                        @click="onSave(true)"
                    >
                        <AIcon type="EditOutlined" />
                    </PermissionButton>
                </div>
                <div v-else>
                    <a-space>
                        <div>
                            <a-input v-model:value="_value" @change="validateName" />
                            <div v-if="nameTips" class="tips">{{ nameTips }}</div>
                        </div>
                        <a-button @click="cancel">取消</a-button>
                        <PermissionButton
                            type="primary"
                            @click="onSave(false)"
                            >确认</PermissionButton
                        >
                    </a-space>
                </div>
            </div>
        </template>
        <template #content>
            <a-descriptions size="small" :column="4">
                <a-descriptions-item label="计划ID">{{
                    detail?.id
                }}</a-descriptions-item>
                <a-descriptions-item label="创建人">{{
                    detail.creatorName
                }}</a-descriptions-item>
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
                <component :is="tabs[tabActiveKey]" @onJump="onTabChange" />
            </div>
        </FullPage>
    </page-container>
</template>

<script setup name="Detail">
import Rule from './Rule/index.vue';
import Channel from './Channel/index.vue';
import Log from './Log/index.vue';
import dayjs from 'dayjs';
import { provide, ref } from 'vue';
import { updatePlan, queryList } from '@/api/media/auto';
import { useRoute } from 'vue-router';

const isEdit = ref(false);
const tabActiveKey = ref('Rule');
const detail = ref({
    schedules: [],
    saveDays: '',
    others: {
        times: [],
        trigger: 'week',
    },
});
const route = useRoute();
const loading = ref(false);
const _value = ref();
const nameTips = ref()

provide('video-tags', {
    tag: tabActiveKey,
    terms: [],
});

const list = [
    {
        key: 'Rule',
        tab: '抓拍规则',
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

const onSave = async (val) => {
    if(nameTips.value){
        return 
    }
    if (!val) {
        loading.value = true;
        const res = await updatePlan({
            id: route.params.id,
            name: _value.value,
            type: 'screenshot',
        }).finally(() => {
            loading.value = false;
            isEdit.value = val;
        });
        if (res.status === 200) {
            refresh();
        }
    } else {
        isEdit.value = val;
    }
};

const refresh = async () => {
    const res = await queryList({
        terms: [
            {
                column: 'id',
                termType: 'eq',
                value: route.params.id,
            },
        ],
    });
    if (res.success) {
        // detail.value = res.result.data?.[0];
        detail.value = Object.assign(
            {
                schedules: [],
                saveDays: 1,
                others: {
                    times: [],
                    trigger: 'week',
                },
            },
            res.result.data?.[0],
        );
        _value.value = detail.value?.name;
    }
};

const validateName = () =>{
    if(!_value.value){
        nameTips.value = '计划名称不能为空'
    }else if(_value.value.length > 64){
        nameTips.value = '最多可输入64位字符'
    }else{
        nameTips.value = ''
    }
}

const cancel = () =>{
    isEdit.value = false;
    nameTips.value = ''
}

onMounted(() => {
    refresh();
});

provide('detail', detail);
</script>

<style lang="less" scoped>
.title {
    display: flex;
    align-items: center;
    justify-content: center;
    .tips{
        font-size: 14px;
        color: red;
        font-weight: 400;
    }
}
</style>
