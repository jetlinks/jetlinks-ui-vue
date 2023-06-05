<template>
    <j-input-group compact>
        <j-select
            style="width: 120px"
            v-model:value="mySource"
            @change="sourceChange"
        >
            <j-select-option key="5" value="relation">
                平台用户
            </j-select-option>
            <j-select-option
                v-if="notifyType === 'dingTalk'"
                key="1"
                value="fixed"
            >
                钉钉用户
            </j-select-option>
            <j-select-option
                v-else-if="notifyType === 'weixin'"
                key="2"
                value="fixed"
            >
                微信用户
            </j-select-option>
            <j-select-option
                v-else-if="notifyType === 'email'"
                key="3"
                value="fixed"
            >
                固定邮箱
            </j-select-option>
            <j-select-option v-else key="4" value="fixed">
                固定号码
            </j-select-option>
        </j-select>
        <template v-if="source === 'relation'">
            <j-tree-select
                v-if="['email'].includes(notifyType)"
                style="width: calc(100% - 120px)"
                placeholder="请选择收信人"
                @change="(key, label) => onChange(source, key, label)"
                :tree-data="treeData"
                :multiple="true"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :value="relationData"
                showSearch
                treeNodeFilterProp="title"
            >
                <template #title="{ key, username, title }">
                    <div
                        style="
                            display: flex;
                            justify-content: space-between;
                            margin-right: 10px;
                        "
                        v-if="key !== 'p1' && key !== 'p2'"
                    >
                        {{ title }}
                        <span style="color: #cfcfcf">{{ username }}</span>
                    </div>
                    <span v-else>{{ title }}</span>
                </template>
            </j-tree-select>
            <j-tree-select
                v-else
                style="width: calc(100% - 120px)"
                placeholder="请选择收信人"
                @change="
                    (key, label) => onChange(source, key, label)
                "
                :tree-data="treeData"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :value="relationData"
                showSearch
                treeNodeFilterProp="title"
            >
                <template #title="{ key, username, title }">
                    <div
                        style="
                            display: flex;
                            justify-content: space-between;
                            margin-right: 10px;
                        "
                        v-if="key !== 'p1' && key !== 'p2'"
                    >
                        {{ title }}
                        <span style="color: #cfcfcf">{{ username }}</span>
                    </div>
                    <span v-else>{{ title }}</span>
                </template>
            </j-tree-select>
        </template>
        <template v-else>
            <j-select
                style="width: calc(100% - 120px)"
                v-if="['dingTalk', 'weixin'].includes(notifyType)"
                placeholder="请选择收信人"
                :value="value?.value"
                showSearch
                @change="
                    (val, option) =>
                        onChange(
                            source,
                            val,
                            option?.label || option?.name,
                        )
                "
                :options="relationList"
            />
            <j-select
                style="width: calc(100% - 120px)"
                v-else-if="['email'].includes(notifyType)"
                placeholder="请输入收件人邮箱,多个收件人用换行分隔"
                :value="value?.value"
                mode="tags"
                max-tag-count="responsive"
                @change="
                    (val) =>
                        onChange(
                            source,
                            val,
                            Array.isArray(val) ? val.join(',') : val,
                        )
                "
            />
            <j-input
                style="width: calc(100% - 120px)"
                v-else-if="['sms', 'voice'].includes(notifyType)"
                placeholder="请输入固定号码"
                :value="value?.value"
                @change="
                    (e) =>
                        onChange(source, e.target.value, e.target.value)
                "
            ></j-input>
        </template>
    </j-input-group>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useSceneStore } from '@/store/scene';
import NoticeApi from '@/api/notice/config';
import { unionBy } from 'lodash-es';

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

const emit = defineEmits(['update:value', 'change']);

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
    return data.value?.trigger?.type;
});

const relationData = computed(() => {
    const item = props.value;
    if(notifyType.value === 'email'){
        if(item && Array.isArray(item) && item.length){
            if(item[0].source === 'relation'){
                return item.map(i => i?.relation?.objectId)
            }
        }
    } else if (item?.source === 'relation') {
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
const labelMap = new Map();
const treeDataMap = new Map()

const getRelationUsers = async (notifyType: string, notifierId: string) => {
    let resp = undefined;
    if (notifyType === 'dingTalk') {
        resp = await NoticeApi.queryDingTalkUsers(notifierId);
    } else {
        resp = await NoticeApi.queryWechatUsers(notifierId);
    }
    if (resp && resp.status === 200) {
        relationList.value = unionBy(resp.result, 'id').map((item: any) => {
            return {
                value: item.id,
                label: item.name,
            };
        });
    }
};

const getUser = async (_source: string, _triggerType: string) => {
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
  console.log(_triggerType, _source)
    if (_triggerType && _triggerType === 'device' && _source === 'relation') {
        relationResp = await NoticeApi.getRelationUsers({
            paging: false,
            sorts: [{ name: 'name', order: 'asc' }],
        });
    }
    if (platformResp.status === 200) {
        newTree[0].children = platformResp.result.map((item: any) => {
          treeDataMap.set(item.id, item)
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
                const obj = {
                    ...item,
                    value: item.relation,
                    key: item.id,
                    title: item.name,
                    isRelation: true,
                }
                treeDataMap.set(item.id, obj)
                return obj
            }),
        });
    }
    treeData.value = newTree;
};

const sourceChange = (v: any) => {
    emit('update:value', {
        source: v,
    });
};

const getObj = (
    _source: string = 'fixed',
    _value?: string | string[],
    isRelation?: boolean,
) => {
    const obj: any = {
        source: _source,
    };
    if (_source === 'relation') {
        if (isRelation) {
            obj.relation = {
                objectType: 'device',
                objectSource: {
                    source: 'upper',
                    upperKey: 'scene.deviceId',
                },
                related: {
                    objectType: 'user',
                    relation: _value,
                },
            };
        } else {
            obj.relation = {
                objectType: 'user',
                objectId: _value,
            };
        }
    } else {
        obj.value = _value;
    }
    return obj;
};

const onChange = (
    _source: string = 'fixed',
    _value?: string | string[],
    // isRelation?: boolean,
    _name?: string,
) => {
    let _values: any = undefined;

    const _names: string[] = Array.isArray(_name) ? _name : [_name || ''];
    if (Array.isArray(_value)) {
        if (props?.notify?.notifyType === 'email') {
            _values = _value.map((item) => {
                return {
                    source: "relation",
                    relation:{
                        objectType: "user",
                        objectId: item
                    }
                }
            });
        }
    } else {
      const item = treeDataMap.get(_value)
      const _isRelation = item?.isRelation
        _values = getObj(_source, _value, _isRelation);
    }
    emit('update:value', _values);
    emit('change', _names.filter((item) => !!item).join(','));
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