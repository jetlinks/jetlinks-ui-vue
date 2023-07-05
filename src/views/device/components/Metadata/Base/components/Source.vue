<template>
    <div class="metadata-source">
        <j-select
            v-model:value="myValue"
            :options="PropertySource"
            placeholder="请选择来源"
            @change="onChange"
            :disabled="disabled"
        >
        </j-select>
        <j-popconfirm-modal
            v-if="myValue != 'manual'"
            @confirm="confirm"
            :bodyStyle="{width: '450px', height: myValue === 'rule' ? '300px' : '80px'}"
        >
            <template #content>
                <j-scrollbar v-if="myValue">
                    <VirtualRule
                        :value="value"
                        :source="myValue"
                        :dataSource="dataSource"
                        ref="virtualRuleRef"
                    />
                </j-scrollbar>
            </template>
            <j-button :disabled="!myValue" type="link" style="padding: 4px 8px">
                <AIcon type="EditOutlined" />
            </j-button>
        </j-popconfirm-modal>
    </div>
</template>

<script setup lang="ts" name="MetadataSource">
import { isNoCommunity } from '@/utils/utils';
import VirtualRule from './VirtualRule/index.vue';

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
    }
});

const emit = defineEmits<Emit>();

const myValue = ref<SourceType>('');
const type = ref<string>('');
const virtualRuleRef = ref<any>(null);

const disabled = computed(() => {
    console.log(props.value);
    console.log(props.noEdit);
    return props.noEdit?.length ? props.noEdit.includes(props.value._sortIndex) :false
})

const onChange = (keys: SourceType) => {
    myValue.value = keys;
    emit('update:value', {
        ...props.value,
        expands: {
            ...props.value?.expands,
            source: keys,
            type:
                keys === 'manual'
                    ? ['write']
                    : keys === 'rule'
                    ? ['report']
                    : [],
        },
    });
};

const confirm = async () => {
    return new Promise(async (resolve, reject) => {
        const data = await virtualRuleRef?.value.onSave().catch(() => {
            reject();
        });
        if (data) {
            const obj = {
                ...props.value,
                expands: {
                    ...props.value?.expands,
                    ...data,
                },
            };
          console.log(obj)
            emit('update:value', obj);
            resolve(true);
        } else {
            reject()
        }
    });
};

watch(
    () => props.value,
    () => {
        myValue.value = props.value?.expands?.source || '';
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