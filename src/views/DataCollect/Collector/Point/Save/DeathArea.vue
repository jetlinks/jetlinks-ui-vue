
<template>
    <div class="top"><j-switch v-model:checked="deathArea" @change="handleDeathArea"></j-switch></div>
    <div v-if="deathArea">
        <div class="content">
            <j-radio-group v-model:value="tag" @change="handleTag">
                <j-space>
                    <j-radio-button value="currentValue">{{ $t('Save.DeathArea.321714-0') }}</j-radio-button>
                    <j-radio-button value="this['currentValue'] - this['lastValue']">{{ $t('Save.DeathArea.321714-1') }}</j-radio-button>
                </j-space>
            </j-radio-group>
            <j-tooltip v-if="tag !== 'currentValue'" :title="$t('Save.DeathArea.321714-2')">
                <AIcon type="QuestionCircleOutlined" style="margin-left: 10px;font-size: 18px;color: rgb(153, 153, 153)" />
            </j-tooltip>
        </div>
        <j-form-item-rest>
            <div v-if="tag === 'currentValue'" class="fixed">
                <j-row :gutter="5" align="middle">
                    <j-col>
                        <j-input-number v-model:value="_value[0].value" style="width: 100%" :placeholder="$t('Save.DeathArea.321714-3')"
                            :max="_value[1] ? _value[1].value : 999999" :min="1" @change="handleChange" />
                    </j-col>
                    <j-col>
                        <j-select v-model:value="_value[0].termType" :showArrow="false"
                            :options="_value.length !== 2 ? termTypeOptions : leftOptions" :placeholder="$t('Save.DeathArea.321714-4')"
                            @change="handleChange" />
                    </j-col>
                    <template v-if="swap === 'range'">
                        <j-col>{{ $t('Save.DeathArea.321714-5') }}</j-col>
                        <j-col>
                            <j-select :showArrow="false" v-model:value="_value[1].termType" :options="termTypeOptions"
                                :placeholder="$t('Save.DeathArea.321714-4')" @change="handleChange" />
                        </j-col>
                        <j-col>
                            <j-input-number v-model:value="_value[1].value" style="width: 100%" :placeholder="$t('Save.DeathArea.321714-3')"
                                :min="_value[0].value" @change="handleChange" />
                        </j-col>

                    </template>
                    <j-button @click="handleSwap">
                        <AIcon type="SwapOutlined" />
                    </j-button>
                </j-row>
            </div>
            <div v-else class="percent">
                <div class="percent-title">{{ $t('Save.DeathArea.321714-5') }}</div>
                <j-input-number v-model:value="percentValue" style="width: 200px" addon-after="%" :placeholder="$t('Save.DeathArea.321714-3')"
                    :min="1" @change="handlePercent" :max="65535" />
            </div>
        </j-form-item-rest>

    </div>
</template>

<script setup lang='ts'>
import { Form } from 'ant-design-vue';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const formItemContext = Form.useInjectFormItemContext()

const props = defineProps({
    value: {
        type: Array,
        default: () => []
    }
})

const emits = defineEmits(['update:value', 'change']);
const _value = ref<any>(props.value)
const deathArea = ref(false);
const tag = ref<string>('currentValue')
const swap = ref<string>('fix')
const percentValue = ref()


const termTypeOptions = computed(() => {
    if (_value.value?.length === 1) {
        return [
            { label: '=', value: 'neq' },
            { label: '>', value: 'lte' },
            { label: '<', value: 'gte' },
            { label: '≥', value: 'lt' },
            { label: '≤', value: 'gt' },
        ];
    } else {
        return [
            { label: '<', value: 'gte' },
            { label: '≤', value: 'gt' },
        ];
    }
});

const leftOptions = [
    { label: '<', value: 'lte' },
    { label: '≤', value: 'lt' },
];

const handleDeathArea = (e: any) => {
    if (e) {
        _value.value = [{
            column: 'currentValue',
            value: undefined,
            termType: undefined,
            type: 'and',
        }]
    } else {
        _value.value = []
    }
    handleChange()
}

const handleSwap = () => {
    if (swap.value === 'fix') {
        swap.value = 'range'
        _value.value = [
            {
                column: 'currentValue',
                value: '',
                termType: undefined,
                type: 'or',
            },
            {
                column: 'currentValue',
                value: '',
                termType: undefined,
                type: 'or',
            },
        ]
    } else {
        swap.value = 'fix'
        _value.value = [{
            column: 'currentValue',
            value: undefined,
            termType: undefined,
            type: 'and',
        }]
    }
    handleChange()
}

const handleTag = (e: any) => {
    if (e.target.value === 'currentValue') {
        swap.value = 'fix'
        _value.value = [{
            column: 'currentValue',
            value: undefined,
            termType: undefined,
            type: 'and',
        }]
    } else {
        _value.value = [
            {
                column: `this['currentValue'] - this['lastValue']*init/100`,
                value: 0,
                termType: 'lt',
                type: 'or',
            },
            {
                column: `this['currentValue'] - this['lastValue']*0/100`,
                value: 0,
                termType: 'gt',
                type: 'or',
            }
        ]
    }
    handleChange()
}

const handlePercent = (e: any) => {
    if (e) {
        _value.value = [
            {
                column: `this['currentValue'] - this['lastValue'] * ${100- e}/100`,
                value: 0,
                termType: 'lt',
                type: 'or',
            },
            {
                column: `this['currentValue'] - this['lastValue'] * ${e + 100}/100`,
                value: 0,
                termType: 'gt',
                type: 'or',
            }
        ]
    } else {
        _value.value = [
            {
                column: `this['currentValue'] - this['lastValue'] * 1/100`,
                value: 0,
                termType: 'lt',
                type: 'or',
            },
            {
                column: `this['currentValue'] - this['lastValue'] * 1/100`,
                value: 0,
                termType: 'gt',
                type: 'or',
            }
        ]
    }
    handleChange()
}

const handlePercentProps = (arr: any) => {
    const obj = arr.find((item: any) => item.termType === 'lt')
    const val =  obj.column.split('*')[1].split('/')[0]
    percentValue.value = val !== 'init' ? 100 - val : undefined
}

const handleChange = () => {
    emits('update:value', _value.value)
    emits('change', _value.value)
    formItemContext.onFieldChange()
}

watch(
    () => props.value,
    (val: any) => {
        if (val && val.length !== 0) {
            deathArea.value = true
            if (val && val[0]?.column === 'currentValue') {
                tag.value = 'currentValue'
                _value.value = val
                if (val.length === 2) {
                    swap.value = 'range'
                }
            } else {
                handlePercentProps(val)
                tag.value = `this['currentValue'] - this['lastValue']`
            }
        }



    },
    { deep: true, immediate: true }
)


</script>

<style scoped lang='less'>
.top {
    padding: 12px 0;
}


.fixed {
    padding: 12px 0;
}

.percent {
    display: flex;
    align-items: center;
    padding: 12px;

    .percent-title {
        margin-right: 10px;
    }
}
</style>