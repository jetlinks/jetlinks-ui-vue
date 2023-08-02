<template>
    <div class="metadata-source">
        <j-select
            v-model:value="myValue"
            :options="PropertySource"
            placeholder="请选择来源"
            :disabled="disabled"
            :get-popup-container="(node) => fullRef || node"
            @change="onChange"
        >
        </j-select>
        <j-popconfirm-modal
            v-if="myValue != 'manual'"
            :bodyStyle="{
                width: '450px',
                height: myValue === 'rule' ? '300px' : '80px',
            }"
            :get-popup-container="(node) => fullRef || node"
            placement="topLeft"
            @confirm="confirm"
            @visibleChange="visibleChange"
        >
            <template #content>
                <j-scrollbar v-if="myValue">
                    <div style="padding: 0 10px">
                        <VirtualRule
                            v-if="visible"
                            :value="value"
                            :source="myValue"
                            :dataSource="dataSource"
                            ref="virtualRuleRef"
                        />
                    </div>
                </j-scrollbar>
            </template>
            <j-button style="padding: 4px 8px" type="link">
                <AIcon type="EditOutlined" />
            </j-button>
        </j-popconfirm-modal>
    </div>
</template>

<script setup lang="ts" name="MetadataSource">
import { isNoCommunity } from '@/utils/utils';
import VirtualRule from './VirtualRule/index.vue';
import { Form } from 'jetlinks-ui-components';
import { FULL_CODE } from 'jetlinks-ui-components/es/DataTable'

const PropertySource: { label: string; value: string }[] = isNoCommunity
    ? [
          {
              value: 'device',
              label: '设备',
          },
          {
              value: 'manual',
              label: '手动',
          },
          {
              value: 'rule',
              label: '规则',
          },
      ]
    : [
          {
              value: 'device',
              label: '设备',
          },
          {
              value: 'manual',
              label: '手动',
          },
      ];

type SourceType = 'device' | 'manual' | 'rule' | '';

type Emit = {
    (e: 'update:value', data: Record<string, any>): void;
};

const fullRef = inject(FULL_CODE);

const props = defineProps({
    value: {
        type: Object,
        default: () => {},
    },
    dataSource: {
        type: Array,
        default: () => [],
    },
    noEdit: {
        type: Array,
        default: () => [],
    },
    target: {
        type: String,
        default: undefined,
    },
});

const emit = defineEmits<Emit>();
const formItemContext = Form.useInjectFormItemContext();

const myValue = ref<SourceType>('');
const type = ref<string>('');
const virtualRuleRef = ref<any>(null);
const visible = ref(false)

const visibleChange = (e: boolean) => {
    visible.value = e
}

const disabled = computed(() => {
    // if (props.target === 'device') {
    //     return true;
    // }
    return props.noEdit?.length
        ? props.noEdit.includes(props.value._sortIndex)
        : false;
});

const updateValue = (data: any) => {
    emit('update:value', {
        ...props.value,
        expands: {
            ...(props.value?.expands || {}),
            ...data,
        },
    });
    formItemContext.onFieldChange();
};

const onChange = (keys: SourceType) => {
    myValue.value = keys;
    updateValue({
        source: keys,
        type: keys === 'manual' ? ['write'] : keys === 'rule' ? ['report'] : [],
    });
};

const confirm = async () => {
    return new Promise(async (resolve, reject) => {
        const data = await virtualRuleRef?.value.onSave().catch(() => {
            reject();
        });
        if (data) {
            updateValue({
                source: myValue.value,
                ...data,
            });
            resolve(true);
        } else {
            reject();
        }
    });
};

const cancel = () => {
    if (props.value.id && !props.value?.expands?.source) {
        myValue.value = 'device';
      } else {
        myValue.value = props.value?.expands?.source || '';
      }
        type.value = props.value?.expands?.type || [];
        console.log('取消', myValue.value);
}

watch(
    () => props.value,
    () => {
      if (props.value.id && !props.value?.expands?.source) {
        myValue.value = 'device';
      } else {
        myValue.value = props.value?.expands?.source || '';
      }
        type.value = props.value?.expands?.type || [];
    },
    { immediate: true },
);
</script>

<style scoped>
.metadata-source {
    display: flex;
    align-items: center;
}
</style>