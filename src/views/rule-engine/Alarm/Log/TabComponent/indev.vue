<template>
    <div class="alarm-log-card">
        <Search
            :columns="columns"
            target="alarm-log"
            v-if="['all', 'detail'].includes(props.type)"
            @search="search"
        ></Search>
        <Search
            :columns="produtCol"
            target="alarm-log"
            v-if="['product', 'other'].includes(props.type)"
            @search="search"
        ></Search>
        <Search
            :columns="deviceCol"
            target="alarm-log"
            v-if="props.type === 'device'"
            @search="search"
        ></Search>
        <Search
            :columns="orgCol"
            target="alarm-log"
            v-if="props.type === 'org'"
            @search="search"
        ></Search>
        <JTable :columns="columns" :request="handleSearch" :params="params">
            <template #card="slotProps">
                <CardBox
                    :value="slotProps"
                    v-bind="slotProps"
                    :statusText="
                        data.defaultLevel.find(
                            (i) => i.level === slotProps.level,
                        )?.title || slotProps.level
                    "
                >
                    <template #img>
                        <img :src="imgMap.get(slotProps.targetType)" alt="" />
                    </template>
                    <template #content>
                        <Ellipsis>
                            <span style="font-weight: 500">
                                {{ slotProps.alarmName }}
                            </span>
                        </Ellipsis>
                        <a-row :gutter="24">
                            <a-col :span="8">
                                <div class="content-des-title">
                                    {{ titleMap.get(slotProps.targetType) }}
                                </div>
                                <Ellipsis
                                    ><div>
                                        {{ slotProps?.targetName }}
                                    </div></Ellipsis
                                >
                            </a-col>
                            <a-col :span="8">
                                <div class="content-des-title">
                                    最近告警时间
                                </div>
                                <Ellipsis
                                    ><div>
                                        {{
                                            moment(slotProps?.alarmTime).format(
                                                'YYYY-MM-DD HH:mm:ss',
                                            )
                                        }}
                                    </div></Ellipsis
                                >
                            </a-col>
                            <a-col :span="8">
                                <div class="content-des-title">状态</div>
                                <a-badge
                                    :status="
                                        slotProps.state.value === 'warning'
                                            ? 'error'
                                            : 'default'
                                    "
                                >
                                </a-badge
                                ><span
                                    :style="
                                        slotProps.state.value === 'warning'
                                            ? 'color: #E50012'
                                            : 'color:black'
                                    "
                                >
                                    {{ slotProps.state.text }}
                                </span>
                            </a-col>
                        </a-row>
                    </template>
                </CardBox>
            </template>
        </JTable>
    </div>
</template>

<script lang="ts" setup>
import { getImage } from '@/utils/comm';
import {
    getProductList,
    getDeviceList,
    getOrgList,
    query,
} from '@/api/rule-engine/log';
import { queryLevel } from '@/api/rule-engine/config';
import Search from '@/components/Search';
import { useAlarmStore } from '@/store/alarm';
import { storeToRefs } from 'pinia';
import { Store } from 'jetlinks-store';
import moment from 'moment';
const alarmStore = useAlarmStore();
const { data } = storeToRefs(alarmStore);
const getDefaulitLevel = () => {
    queryLevel().then((res) => {
        if (res.status === 200) {
            Store.set('default-level', res.result?.levels || []);
            data.value.defaultLevel = res.result?.levels || [];
        }
    });
};
getDefaulitLevel();
const props = defineProps<{
    type: string;
    id?: string;
}>();

const imgMap = new Map();
imgMap.set('product', getImage('/alarm/product.png'));
imgMap.set('device', getImage('/alarm/device.png'));
imgMap.set('other', getImage('/alarm/other.png'));
imgMap.set('org', getImage('/alarm/org.png'));

const titleMap = new Map();
titleMap.set('product', '产品');
titleMap.set('device', '设备');
titleMap.set('other', '其他');
titleMap.set('org', '组织');

const colorMap = new Map();
colorMap.set(1, '#E50012');
colorMap.set(2, '#FF9457');
colorMap.set(3, '#FABD47');
colorMap.set(4, '#999999');
colorMap.set(5, '#C4C4C4');

const columns = [
    {
        title: '名称',
        dataIndex: 'alarmName',
        key: 'alarmName',
        search: {
            type: 'string',
        },
    },
    {
        title: '最近告警事件',
        dataIndex: 'alarmTime',
        key: 'alarmTime',
        search: {
            type: 'dateTime',
        },
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        search: {
            type: 'select',
            options: [
                {
                    label: '告警中',
                    value: 'warning',
                },
                {
                    label: '无告警',
                    value: 'normal',
                },
            ],
        },
    },
];
const produtCol = [
    ...columns,
    {
        title: '产品名称',
        dataIndex: 'targetName',
        key: 'targetName',
        search: {
            type: 'select',
            options: async () => {
                const resq = await getProductList();
                if (resq.status === 200) {
                    return resq.result.map((item: any) => ({
                        label: item.name,
                        value: item.name,
                    }));
                }
                return [];
            },
        },
    },
];
const deviceCol = [
    ...columns,
    {
        title: '设备名称',
        dataIndex: 'targetName',
        key: 'targetName',
        search: {
            type: 'select',
            opstions: async () => {
                const res = await getDeviceList();
                if (res.status === 200) {
                    return res.result.map((item: any) => ({
                        label: item.name,
                        value: item.name,
                    }));
                }
                return [];
            },
        },
    },
];
const orgCol = [
    ...columns,
    {
        title: '组织名称',
        dataIndex: 'targetName',
        key: 'targetName',
        search: {
            type: 'select',
            options: async () => {
                const res = await getOrgList();
                if (res.status === 200) {
                    return res.result.map((item: any) => ({
                        label: item.name,
                        value: item.name,
                    }));
                }
                return [];
            },
        },
    },
];

let params = ref({
    sorts: [{ name: 'alarmTime', order: 'desc' }],
    terms: [],
});
let param = reactive({
    pageSize: 10,
    terms: [],
});
// let dataSource = reactive({
//     data: [],
//     pageSize: 10,
//     pageIndex: 0,
//     total: 0,
// });
const handleSearch = async (params: any) => {
    const resp = await query(params);
    if (resp.status === 200) {
        const res = await getOrgList();
        if (res.status === 200) {
            resp.result.data.map((item: any) => {
                if (item.targetType === 'org') {
                    res.result.forEach((item2: any) => {
                        if (item2.id === item.targetId) {
                            item.targetName = item2.name;
                        }
                        //targetName处理之后的
                        if (item.targetId === item.targetName) {
                            item.targetName = '无';
                        }
                    });
                }
            });
            return resp;
        }
    }
};
watchEffect(() => {
    if (props.type !== 'all' && !props.id) {
        params.value.terms.push({
            termType: 'eq',
            column: 'targetType',
            value: props.type,
            type: 'and',
        });
    }
    if (props.id) {
        params.value.terms.push({
            termType: 'eq',
            column: 'alarmConfigId',
            value: props.id,
            type: 'and',
        });
    }
});

const search = (data: any) => {
    const dt = {
        pageSize: 10,
        terms: [...data?.terms],
    };
};
const log = () => {
    console.log(data.value.defaultLevel);
};
log();
</script>
<style lang="less" scoped>
</style>
