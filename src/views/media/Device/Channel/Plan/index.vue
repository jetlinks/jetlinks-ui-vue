<template>
    <a-drawer
        :title="type === 'video' ? '录像计划' : '抓拍计划'"
        visible
        @close="emit('close')"
        :closable="false"
        width="1000px"
    >
        <div class="content">
            <div v-if="list.length" class="items">
                <div v-for="(item, index) in list" class="item">
                    <div class="header">
                        <div>
                            <span>计划{{ index + 1 }}: </span>
                            <planSelect
                                v-model:value="item.id"
                                :options="options"
                                :selectKeys="list"
                                :disabled="!editState"
                                @change="(option) => onChange(option, item)"
                            />
                        </div>
                        <PermissionButton
                            shape="circle"
                            :tooltip="{
                                title: '删除',
                            }"
                            danger
                            @click="onDel(item)"
                        >
                            <AIcon type="DeleteOutlined" />
                        </PermissionButton>
                    </div>
                    <div v-if="item?.times" class="header-detail" >
                        <span>计划详情:  
                            {{ item.trigger === 'week' ? '按周' : '自定义日历' }}
                        </span>
                        <span
                            >计划状态： 
                            <a-badge
                                :status="
                                    item?.state?.value === 'enabled'
                                        ? 'success'
                                        : 'error'
                                "
                                :text="item?.state?.text"
                            />
                        </span>
                        <span>保存周期：{{ item.saveDays }}天</span>
                    </div>
                    <div v-if="item?.times" class="calendar">
                        <Calendar
                            v-model:value="item.times"
                            v-model:trigger="item.trigger"
                            type="timing"
                            :view="true"
                            :disabled="true"
                        />
                    </div>
                </div>
                <a-button
                    v-if="editState"
                    @click="onAdd(list.length)"
                    class="add-btn"
                    >+ 添加计划</a-button
                >
            </div>
            <div v-else class="empty">
                <img
                    :src="
                        type === 'video'
                            ? getImage('/media/videoPlan.png')
                            : getImage('/media/capturePlan.png')
                    "
                />
                <div class="noPlanTip">
                    还没有关联的{{ type === 'video' ? '录像' : '抓拍' }}计划
                </div>
                <div>
                    你可以点击关联{{
                        type === 'video' ? '录像' : '抓拍'
                    }}计划按钮来关联计划
                </div>
                <div class="addPlan">
                    <a-button shape="round" @click="onAdd(0)">
                        {{
                            type === 'video'
                                ? '点击关联录像计划'
                                : '点击关联抓拍计划'
                        }}
                    </a-button>
                </div>
            </div>
        </div>
        <template #footer>
            <a-button v-if="editState" type="primary" @click="onSave"
                >保存</a-button
            >
        </template>
    </a-drawer>
</template>

<script setup lang="ts" name="Plan">
import { ref } from 'vue';
import Calendar from '@/views/media/AutoVideo/components/Calendar/index.vue';
import { queryListNoPaging, bindChannelAll } from '@/api/media/auto';
import planSelect from './planSelect.vue';
import { onlyMessage } from '@/utils/comm';
import { getImage } from '@/utils/comm';

const emit = defineEmits(['close']);

const props = defineProps({
    type: {
        type: String,
        default: 'video',
    },
    data: {
        type: Object,
        default: () => {
            return {};
        },
    },
});

const editState = ref(true);
const options = ref([]);
const list = ref<any[]>([]);

const onAdd = (index: any) => {
    list.value.push({
        index: index,
    });
};

const onDel = (item: any) => {
    list.value = list.value.filter((i) => i.index !== item.index);
};

const onSave = async () => {
    // console.log('list.value====', list.value);
    // console.log('props.data====', props.data);
    const items = list.value?.map((item) => ({
        name: item.name,
        scheduleId: item.id,
        deviceId: props.data.deviceId,
        channelId: props.data.channelId,
        others: {
            channelCatalog: `${props.data.deviceName}/${props.data.name}`,
            times: item.times,
            trigger: item.trigger,
        },
    }));
    // console.log('items====', items);
    const res = await bindChannelAll(props.data.channelId, true, items);
    if (res.success) {
        onlyMessage('操作成功');
        emit('close');
    }
};

const onChange = (option: any, item: any) => {
    console.log('option====',option,item);
    item.times = option.others?.times || [];
    item.trigger = option.others?.trigger;
    item.name = option.name;
    item.state = option.state;
    item.saveDays = option.saveDays
};

const getPlanList = async () => {
    const res = await queryListNoPaging({
        paging: false,
        sorts: [{ name: 'createTime', order: 'desc' }],
        terms: [{ column: 'type', value: props.type, termType: 'eq' }],
    });
    if (res.success) {
        options.value = res.result;
    }
};

const getBinds = async () => {
    const item = {
        paging: false,
        sorts: [{ name: 'createTime', order: 'desc' }],
        terms: [
            { column: 'type', value: props.type, termType: 'eq', type: 'and' },
            {
                column: 'id$media-record-channel-bind-schedule',
                value: [
                    {
                        column: 'channelId',
                        termType: 'eq',
                        value: props.data.channelId,
                    },
                    {
                        column: 'deviceId',
                        termType: 'eq',
                        value: props.data.deviceId,
                    },
                ],
            },
        ],
    };
    const res = await queryListNoPaging(item);
    if (res.success) {
        // console.log('res,result====',res.result);
        list.value = res.result.map((item, index) => ({
            ...item,
            index: index,
            id: item.id,
            times: item.others?.times,
            trigger: item.others?.trigger,
        }));
        // editState.value = !!res.result.length
    }
};

onMounted(() => {
    getPlanList();
    getBinds();
});
</script>

<style lang="less" scoped>
.content {
    .items {
        margin-bottom: 12px;
        width: 100%;
        .item {
            width: 100%;
            padding: 12px;
            margin-top: 12px;
            background-color: #fafafa;

            // border: 1px dashed #8b8b8ba9;
            border-radius: 4px;
            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                :deep(.ant-btn-dangerous) {
                    background: rgba(255, 77, 79, 0.1);
                    border: none;
                }
            }
            .header-detail{
                margin-top: 10px;
                >span{
                    margin-right: 40px;
                    color: #1A1A1A;
                }
            }
            .calendar {
                padding-top: 12px;
                padding-left: 40px;
            }
        }
        .add-btn {
            width: 100%;
            margin-top: 12px;
        }
    }
    .empty {
        height: 200px;
        align-items: center;
        text-align: center;
        margin-top: 30%;
        div {
            margin-top: 10px;
        }
        .noPlanTip {
            font-size: 16px;
            font-weight: 500;
            color: #1a1a1a;
        }
    }
}
</style>
