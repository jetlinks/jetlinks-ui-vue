<template>
    <div style="display: flex">
        <a-select
            style="width: 120px"
            v-model:value="mySource"
            @change="sourceChange"
        >
            <a-select-option key="5" value="relation">
                {{ $t('variableItem.User.9667821-0') }}
            </a-select-option>
            <a-select-option
                v-if="notifyType === 'dingTalk'"
                key="1"
                value="fixed"
            >
                {{ $t('variableItem.User.9667821-1') }}
            </a-select-option>
            <a-select-option
                v-else-if="notifyType === 'weixin'"
                key="2"
                value="fixed"
            >
                {{ $t('variableItem.User.9667821-2') }}
            </a-select-option>
            <a-select-option
                v-else-if="notifyType === 'email'"
                key="3"
                value="fixed"
            >
                {{ $t('variableItem.User.9667821-3') }}
            </a-select-option>
            <a-select-option v-else key="4" value="fixed">
                {{ $t('variableItem.User.9667821-4') }}
            </a-select-option>
        </a-select>
        <template v-if="source === 'relation'">
            <a-tree-select
                v-if="['email'].includes(notifyType)"
                style="width: calc(100% - 120px)"
                :placeholder="$t('variableItem.User.9667821-5')"
                @change="(key, label, extra) => onChange(source, key, label, extra)"
                :tree-data="treeData"
                :multiple="true"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :value="relationData"
                showSearch
                allowClear
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
            </a-tree-select>
            <a-tree-select
                v-else
                style="width: calc(100% - 120px)"
                :placeholder="$t('variableItem.User.9667821-5')"
                @change="
                    (key, label, extra) => onChange(source, key, label, extra.isRelation)
                "
                :tree-data="treeData"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :value="relationData"
                showSearch
                allowClear
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
            </a-tree-select>
        </template>
        <template v-else>
            <div v-if="['weixin'].includes(notifyType)" style="width: calc(100% - 120px)">
              <component
                  v-if="ToUserModal"
                  :is="ToUserModal"
                  :toUser="value?.value"
                  :toUserName="options?.sendTo"
                  :config-id="notify.notifierId"
                  @change="
                    (val, option) =>
                        onChange(
                            source,
                            val,
                            option?.label || option?.name,
                        )
                "
              />
            </div>
            <a-select
                style="width: calc(100% - 120px)"
                v-else-if="['dingTalk'].includes(notifyType)"
                :placeholder="$t('variableItem.User.9667821-5')"
                :value="relationData"
                showSearch
                allowClear
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
            <a-select
                style="width: calc(100% - 120px)"
                v-else-if="['email'].includes(notifyType)"
                :placeholder="$t('variableItem.User.9667821-6')"
                :value="relationData"
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
            <a-input
                style="width: calc(100% - 120px)"
                v-else-if="['sms', 'voice'].includes(notifyType)"
                :placeholder="$t('variableItem.User.9667821-7')"
                :value="value?.value"
                @change="
                    (e) =>
                        onChange(source, e.target.value, e.target.value)
                "
            ></a-input>
        </template>
    </div>
</template>

<script lang="ts" setup name="NotifyUser">
import { storeToRefs } from 'pinia';
import { useSceneStore } from '../../../../../../store/scene';
import {queryDingTalkUsers , queryWechatUsers , getPlatformUsers , getRelationUsers as queryRelationUsers } from '../../../../../../api/others'
import { unionBy } from 'lodash-es';
import { useI18n } from 'vue-i18n'
import { isNoCommunity } from '@jetlinks-web-core/utils';
import {moduleRegistry} from "@jetlinks-web-core/utils/module-registry";

const { t: $t } = useI18n()
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
  options: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['update:value', 'change']);
const ToUserModal = ref<any>(null);
const notifyType = computed(() => {
    return props.notify?.notifyType;
});

const notifierId = computed(() => {
    return props.notify?.notifierId;
});

const source = computed(() => {
    if (props.value) {
        return props.value?.[0]?.source || props.value?.source || 'relation';
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
                return item.filter(i => i.relation?.objectId || i.relation?.related?.relation).map(i => {
                    if(i.relation?.objectType === 'user') {
                        return i?.relation?.objectId
                    }
                    return i?.relation?.related?.relation
                })
            } else {
                return item.filter(i => i.value).map(i => i.value)
            }
        } else {
            return item?.relation?.objectId
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
        title: $t('variableItem.User.9667821-0'),
        value: 'p1',
        key: 'p1',
        selectable: false,
        children: [],
    },
]);
const mySource = ref<string>('relation');
const treeDataMap = new Map()


const getRelationUsers = async (notifyType: string, notifierId: string) => {
    let resp = undefined;
    if (notifyType === 'dingTalk') {
        resp = await queryDingTalkUsers(notifierId);
    } else {
        resp = await queryWechatUsers(notifierId);
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
            title: $t('variableItem.User.9667821-0'),
            value: 'p1',
            key: 'p1',
            selectable: false,
            children: [],
        },
    ];
    let relationResp = undefined;
    const platformResp = await getPlatformUsers({
        paging: false,
        sorts: [{ name: 'name', order: 'asc' }],
    });
    if (_triggerType && _triggerType === 'device' && _source === 'relation') {
        relationResp = await queryRelationUsers({
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
    if (relationResp && relationResp.success && isNoCommunity) {
        newTree.push({
            title: $t('variableItem.User.9667821-8'),
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
                treeDataMap.set(item.relation, obj)
                return obj
            }),
        });
    }
    treeData.value = newTree;
};

const sourceChange = (v: any) => {
    emit('update:value', notifyType.value === 'email' ? [{
        source: v,
    }] : {
        source: v
    });
    emit('change',undefined)
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
    _name?: string,
    extra?: any,
) => {
    let _values: any = undefined;
    const _names: string[] = Array.isArray(_name) ? _name : [_name || ''];
    if (Array.isArray(_value)) {
        if (props?.notify?.notifyType === 'email') {
          if (_source === 'fixed') {
            _values = _value.length ? _value.map((item) => {
                return {
                    source: "fixed",
                    value: item
                }
            }) : [
                {
                    source: "fixed",
                }
            ]
          } else {
            _values = _value.length ? _value.map((item) => {
                if(extra.triggerNode.props.isRelation && extra.triggerNode.props.value === item) {
                    return getObj(_source, item, extra.triggerNode.props.isRelation);
                } else {
                    return {
                        source: "relation",
                        relation:{
                            objectType: "user",
                            objectId: item
                        }
                    }
                }
            }) : [
                {
                    source: "relation",
                }
            ]
          }
            // _values = _value.map((item) => {
            //     const _item = treeDataMap.get(item)
            //     const _isRelation = _item?.isRelation
            //     if(_isRelation) {
            //         return getObj(_source, item, _isRelation);
            //     } else {
            //         return {
            //             source: "relation",
            //             relation:{
            //                 objectType: "user",
            //                 objectId: item
            //             }
            //         }
            //     }
            // });
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

onMounted(() => {
  const notifyComponents = moduleRegistry.getResource('notify-manager-ui', 'components')
  ToUserModal.value = notifyComponents?.ToUserModal
})
</script>
