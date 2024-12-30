<template>
    <div class="card-item" @click="isExpand = !isExpand">
        <div class="left">
            <slot name="leftRender"></slot>
        </div>
        <div class="right">
            <div class="right-items">
                <div>
                    <AIcon
                        :type="
                            isExpand
                                ? 'DoubleRightOutlined'
                                : 'DoubleLeftOutlined'
                        "
                    />
                    处理方式：
                </div>
                <div
                    v-for="item in options"
                    :class="{
                        'right-item': true,
                        active: item.value === _selectKey,
                        expand: !isExpand && item.value !== _selectKey,
                    }"
                    @click.stop="onSelect(item)"
                >
                    <span style="margin-right: 6px">{{ item.label }}</span>
                    <AIcon type="AppstoreOutlined" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="CardItem">
const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
    resourceMetadata: {
        type: Object,
        default: () => ({}),
    },
    options: {
        type: Array,
        default: [],
    },
    type: {
        type: String,
        default: 'metadata',
    },
});
const emit = defineEmits(['change', 'update:value']);
const _selectKey = ref('');
const isExpand = ref(true);
const _data = ref();

const onSelect = (item) => {
    _selectKey.value = item.value;

    if (props.type === 'metadata') {
        console.log('resourceMetadata====',props.resourceMetadata);
        handleChange(item.value);
    } else {
        emit('update:value', {
            ..._data.value,
            handle: item.value,
        });
        emit('change', {
            ..._data.value,
            handle: item.value,
        });
    }
};

/**
 * 交集处理函数， 只保留来自插件中的属性
 * @param DataA 产品物模型
 * @param DataB 插件物模型
 * @constructor
 */
const IntersectionFn = (DataA: any[] = [], DataB: any[] = []): any[] => {
    const newData: any[] = [];
    if (!DataA.length) return [];
    DataB.forEach((item) => {
        if (DataA.some((aItem) => aItem.id === item.id)) {
            newData.push(item);
        }
    });
    return newData;
};

/**
 * 并集函数处理，保留平台、插件中的所有属性，ID重复时，只保留来自插件中的1条属性。
 * @param DataA 产品物模型
 * @param DataB 插件物模型
 * @constructor
 */
const UnionFn = (DataA: any[] = [], DataB: any[] = []): any[] => {
    const dataMap = new Map();

    DataB.forEach((item) => {
        dataMap.set(item.id, item);
    });

    DataA.forEach((item) => {
        if (!dataMap.has(item.id)) {
            dataMap.set(item.id, item);
        }
    });
    return [...dataMap.values()];
};

const handleChange = (val) => {
    switch (val) {
        case 'intersection': // 交集
            _data.value.newMetaData.properties = IntersectionFn(
                _data.value.metadata.properties,
                props.resourceMetadata.properties,
            );
            _data.value.newMetaData.events = IntersectionFn(
                _data.value.metadata.events,
                props.resourceMetadata.events,
            );
            _data.value.newMetaData.functions = IntersectionFn(
                _data.value.metadata.functions,
                props.resourceMetadata.functions,
            );
            _data.value.newMetaData.tags = IntersectionFn(
                _data.value.metadata.tags,
                props.resourceMetadata.tags,
            );
            break;
        case 'union': // 并集
            _data.value.newMetaData.properties = UnionFn(
                _data.value.metadata.properties,
                props.resourceMetadata.properties,
            );
            _data.value.newMetaData.events = UnionFn(
                _data.value.metadata.events,
                props.resourceMetadata.events,
            );
            _data.value.newMetaData.functions = UnionFn(
                _data.value.metadata.functions,
                props.resourceMetadata.functions,
            );
            _data.value.newMetaData.tags = UnionFn(
                _data.value.metadata.tags,
                props.resourceMetadata.tags,
            );
            break;
        case 'cover': // 覆盖
            _data.value.newMetaData = props.resourceMetadata;
            break;
        default:
            _data.value.newMetaData = _data.value.metadata;
            break;
    }
    const record = {
        ..._data.value,
        metadata: JSON.stringify(_data.value.metadata),
    };
    emit('update:value', record);
    emit('change', record);
};

watch(
    () => props.value,
    (val) => {
        if (val) {
            if (props.type === 'metadata') {
                _data.value = {
                    ...val,
                    metadata: JSON.parse(val.metadata || '{}'),
                    newMetaData: JSON.parse(val.metadata || '{}'),
                }
            }else{
                _data.value = {
                    ...val,
                    handle:val.handle
                }
            }
        }
    },
    { immediate: true, deep: true },
);
</script>

<style lang="less" scoped>
.card-item {
    display: flex;
    align-items: center;
    padding: 12px;
    border: 1px solid #eee;
    border-radius: 6px;
    background-color: #fff;
    .left {
        flex: 1;
    }
    .right {
        .right-items {
            display: flex;
            gap: 8px;
            align-items: center;
            .right-item {
                border: 1px solid #eee;
                padding: 6px 12px;
                border-radius: 6px;
                cursor: pointer;
                &.active {
                    border: 1px solid #188fffde;
                    color: #1890ff;
                }
                &.expand {
                    display: none;
                    padding: 6px 0;
                }
            }
        }
    }
}
</style>
