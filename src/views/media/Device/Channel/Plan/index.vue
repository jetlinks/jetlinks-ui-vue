<template>
    <a-modal
        :title="type === 'vidoe' ? '录像计划' : '抓拍计划'"
        visible
        @cancel="emit('close')"
        :maskClosable="false"
        width="1000px"
    >
        <div class="content">
            <div v-if="list.length" class="items">
                <div v-for="(item, index) in list" class="item">
                    <div class="header">
                        <div>
                            <span>计划{{ index + 1 }}: </span>
                            <!-- <a-select
                                v-model:value="item.id"
                                style="width: 200px"
                                :options="options"
                                :field-names="{ label: 'name', value: 'id' }"
                                @change="
                                    (_, option) => onChange(option, item)
                                "
                                placeholder="请选择计划"
                            /> -->
                            <planSelect
                                v-model:value="item.id"
                                :options="options"
                                :selectKeys="list"
                                @change="(option) => onChange(option, item)"
                            />
                        </div>
                        <PermissionButton
                            type="link"
                            :tooltip="{
                                title: '删除',
                            }"
                            @click="onDel(item)"
                        >
                            <AIcon type="DeleteOutlined" />
                        </PermissionButton>
                    </div>
                    <div v-if="item?.times" class="calendar">
                        <Calendar
                            v-model:value="item.times"
                            v-model:trigger="item.trigger"
                            :disabled="true"
                        />
                    </div>
                </div>
                <a-button @click="onAdd(list.length)" class="add-btn"
                    >+ 添加计划</a-button
                >
            </div>
            <div v-else class="empty">
                <a-button shape="round" @click="onAdd(0)">
                    {{
                        type === 'video'
                            ? '点击关联录像计划'
                            : '点击关联抓拍计划'
                    }}
                </a-button>
            </div>
        </div>
        <template #footer>
            <a-button v-if="!editState" type="primary" @click="onSave">保存</a-button>
        </template>
    </a-modal>
</template>

<script setup lang="ts" name="Plan">
import { reactive, ref } from 'vue';
import Calendar from '@/views/media/AutoVideo/components/Calendar/index.vue';
import { queryListNoPaging } from '@/api/media/auto';
import planSelect from './planSelect.vue';

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

const editState = ref(false);
const options = ref([]);
const initOptions = ref([]);
const list = ref([]);

const onAdd = (index) => {
    list.value.push({
        index: index,
    });
};

const onDel = (item) => {
    list.value = list.value.filter((i) => i.index !== item.index);
};

const onSave = () => {
    console.log('list.value====', list.value);
};

const onChange = (option: any, item: any) => {
    item.times = option.others?.times
    item.trigger = option.others?.trigger
    console.log('options====', option, item);
};

const getPlanList = async () => {
    const res = await queryListNoPaging({
        paging: false,
        sorts: [{ name: 'createTime', order: 'desc' }],
        terms: [{ column: 'type', value: props.type, termType: 'eq' }],
    });
    if (res.success) {
        options.value = res.result;
        initOptions.value = res.result;
    }
};

onMounted(() => {
    getPlanList();
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
            // background-color: #eee;
            border: 1px dashed #8b8b8ba9;
            border-radius: 4px;
            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
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
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
