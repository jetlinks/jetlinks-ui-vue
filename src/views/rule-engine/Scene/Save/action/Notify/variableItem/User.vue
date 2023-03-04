<template>
    <a-input-group compact>
        <a-select
            style="width: 120px"
            v-model:value="mySource"
            @change="sourceChange"
        >
            <a-select-option key="5" value="relation">
                平台用户
            </a-select-option>
            <a-select-option
                v-if="notifyType === 'dingTalk'"
                key="1"
                value="fixed"
            >
                钉钉用户
            </a-select-option>
            <a-select-option
                v-else-if="notifyType === 'weixin'"
                key="2"
                value="fixed"
            >
                微信用户
            </a-select-option>
            <a-select-option
                v-else-if="notifyType === 'email'"
                key="3"
                value="fixed"
            >
                固定邮箱
            </a-select-option>
            <a-select-option v-else key="4" value="fixed">
                固定号码
            </a-select-option>
        </a-select>
        <a-tree-select
            v-if="source === 'relation'"
            style="width: calc(100% - 120px)"
            placeholder="请选择收信人"
            @select="treeSelect"
            :tree-data="treeData"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :value="relationData"
        />
        <a-select
            style="width: calc(100% - 120px)"
            v-else-if="['dingTalk', 'weixin'].includes(notifyType)"
            placeholder="请选择收信人"
            :value="value?.value"
            @change="(val) => onChange(val)"
        >
            <a-select-option
                v-for="item in relationList"
                :key="item.id"
                :value="item.id"
                >{{ item.name }}</a-select-option
            >
        </a-select>
        <a-input
            style="width: calc(100% - 120px)"
            v-else-if="['email'].includes(notifyType)"
            placeholder="请输入固定邮箱"
            :value="value?.value"
            :multiple="true"
            @change="(e) => onChange(e.target.value)"
        ></a-input>
        <a-input
            style="width: calc(100% - 120px)"
            v-else-if="['sms', 'voice'].includes(notifyType)"
            placeholder="请输入固定号码"
            :value="value?.value"
            @change="(e) => onChange(e.target.value)"
        ></a-input>
    </a-input-group>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useSceneStore } from '@/store/scene';
import NoticeApi from '@/api/notice/config';

const sceneStore = useSceneStore();
const { data } = storeToRefs(sceneStore);

const props = defineProps({
    notify: {
        type: Object,
        default: () => {},
    },
    value: {
        type: [Object],
        default: () => {},
    },
});

const emit = defineEmits(['update:value']);

const notifyType = computed(() => {
    return props.notify?.notifyType;
});

const notifierId = computed(() => {
    return props.notify?.notifierId;
});

const source = computed(() => {
    if (props.value) {
        return props.value?.source || 'relation';
    } else {
        return 'relation';
    }
});

const triggerType = computed(() => {
    return data?.trigger || data?.trigger?.type;
});

const relationData = computed(() => {
    const item = props.value;
    if (item?.source === 'relation') {
        const relation = item?.relation;
        if (relation) {
            if (relation.objectId) {
                // 平台用户
                return relation.objectId;
            } else {
                // 关系用户
                return relation.related?.relation;
            }
        }
    }
});

const relationList = ref<any[]>([]);
const treeData = ref<any[]>([
    {
        title: '平台用户',
        value: 'p1',
        key: 'p1',
        selectable: false,
        children: [],
    },
]);
const mySource = ref<string>('relation');

const getRelationUsers = async (notifyType: string, notifierId: string) => {
    let resp = undefined;
    if (notifyType === 'dingTalk') {
        resp = await NoticeApi.queryDingTalkUsers(notifierId);
    } else {
        resp = await NoticeApi.queryWechatUsers(notifierId);
    }
    if (resp && resp.status === 200) {
        relationList.value = resp.result;
    }
};

const getUser = async (_source: string, triggerType: string) => {
    const newTree = [
        {
            title: '平台用户',
            value: 'p1',
            key: 'p1',
            selectable: false,
            children: [],
        },
    ];
    let relationResp = undefined;
    const platformResp = await NoticeApi.getPlatformUsers({
        paging: false,
        sorts: [{ name: 'name', order: 'asc' }],
    });
    if (triggerType && triggerType === 'device' && _source === 'relation') {
        relationResp = await NoticeApi.getRelationUsers({
            paging: false,
            sorts: [{ name: 'name', order: 'asc' }],
        });
    }
    if (platformResp.status === 200) {
        newTree[0].children = platformResp.result.map((item: any) => {
            return {
                ...item,
                value: item.id,
                key: item.id,
                title: item.name,
            };
        });
    }
    if (relationResp && relationResp.success) {
        newTree.push({
            title: '关系用户',
            value: 'p2',
            key: 'p2',
            selectable: false,
            children: relationResp.result.map((item: any) => {
                return {
                    ...item,
                    value: item.id,
                    key: item.id,
                    title: item.name,
                    isRelation: true,
                };
            }),
        });
    }
    treeData.value = newTree;
};

const treeSelect = (val: string, _data: any) => {
    const obj = {
        source: source.value,
        relation: {}
    };
    if (_data?.isRelation) {
        obj.relation = {
            objectType: 'device',
            objectSource: {
                source: 'upper',
                upperKey: 'scene.deviceId',
            },
            related: {
                objectType: 'user',
                relation: val,
            },
        };
    } else {
        obj.relation = {
            objectType: 'user',
            objectId: val,
        };
    }
    emit('update:value', obj);
};

const sourceChange = (v: any) => {
    emit('update:value', {
        source: v,
    });
};

const onChange = (val: any) => {
    emit('update:value', {
        source: source.value,
        value: val,
    });
};

watch(
    () => triggerType.value,
    (newVal) => {
        if (newVal && source.value === 'relation') {
            getUser(source.value, newVal);
        }
    },
    { deep: true, immediate: true },
);

watch(
    () => source.value,
    (newVal) => {
        const v = newVal;
        mySource.value = v as string;
        if (
            v === 'fixed' &&
            ['dingTalk', 'weixin'].includes(notifyType.value)
        ) {
            getRelationUsers(notifyType.value, notifierId.value);
        } else {
            getUser(v, triggerType.value);
        }
    },
    { deep: true, immediate: true },
);
</script>