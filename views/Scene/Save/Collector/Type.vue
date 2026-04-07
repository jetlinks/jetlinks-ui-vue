<template>
    <div class="type">
        <a-form ref="typeForm" :model="formModel" layout="vertical" :colon="false">
            <a-form-item required :label="$t('Device.AddModal.3725211-3')">
                <TopCard
                    :label-bottom="true"
                    :options="topOptions"
                    v-model:value="formModel.operator"
                />
            </a-form-item>
            <template v-if="showTimer">
                <Timer ref="timerRef" v-model:value="formModel.timer"/>
            </template>
            <ReadPoints
                v-if="showReadProperty"
                v-model:value="formModel.readPoints"
                v-model:action="optionCache.action"
                :properties="readPoints"
            />
            <WritePoint
                ref="writeRef"
                v-if="showWriteProperty"
                v-model:value="formModel.writePoints"
                v-model:action="optionCache.action"
                :properties="writePoints"
            />
        </a-form>
    </div>
</template>

<script setup lang="ts">
import {TopCard, Timer} from "../components";
import type {TriggerDeviceOptions} from "../../typings";
import type {PropType} from "vue";
import ReadPoints from "./ReadPoints.vue";
import WritePoint from "./WritePoint.vue";
import {cloneDeep, omit} from "lodash-es";
import {sceneImages} from "@rule-engine-manager-ui/assets";
import { useI18n } from 'vue-i18n'

const props = defineProps({
    operator: {
        type: Object as PropType<TriggerDeviceOptions>,
        default: () => ({}),
    },
    pointList: {
        type: Array as PropType<Record<string, any>[]>,
        default: () => ([]),
    },
    collectorConfig: {
        type: Object as PropType<Record<string, any>>,
        default: () => ({}),
    },
    collectorId: {
        type: String,
        default: '',
    }
});

const { t: $t } = useI18n()

const formModel = reactive({
    operator: props.operator || 'read',
    timer: {},
    readPoints: props.collectorId !== props.collectorConfig?.pointSelectInfo?.collectorId ? [] : props.collectorConfig?.pointSelectInfo?.pointIds || [],
    writePoints: props.collectorId !== props.collectorConfig?.pointSelectInfo?.collectorId ? {} : props.collectorConfig?.pointSelectInfo?.pointIds[0] ?  {
       [props.collectorConfig?.pointSelectInfo?.pointIds[0]]: props.collectorConfig?.collectorConfig?.value
    } : {},
    value: '',
});

Object.assign(formModel, props.collectorConfig);

const optionCache = reactive({
    action: "",
});

const readPoints = computed(() => {
    /**
     * 读：1（001）
     * 写：2（010）
     * 订阅：4（100）
     * 可使用按位与计算来校验是否包含对应枚举
     * 例如，判断是否包含读：accessModes & 1 !== 0，判断是否包含写：accessModes & (1 << 1) !== 0
     */
    return props.pointList.filter((item) => {
        return (item.accessModeMask & 1) !== 0;
    }).map((item) => {
        return {
            ...item,
            label: item.name,
            value: item.id,
        };
    })
});
const writePoints = computed(() => {
  /**
   * 读：1（001）
   * 写：2（010）
   * 订阅：4（100）
   * 可使用按位与计算来校验是否包含对应枚举
   * 例如，判断是否包含读：accessModes & 1 !== 0，判断是否包含写：accessModes & (1 << 1) !== 0
   */
    return props.pointList.filter((item) => {
        return item.accessModeMask & (1 << 1);
    }).map((item) => {
        return {
            ...item,
            label: item.name,
            value: item.id,
        };
    })
});

const typeForm = ref();
const timerRef = ref();
const writeRef = ref();

const topOptions = [
    {
        label: $t('Collector.actions.index-6100078-0'),
        value: "read",
        img: sceneImages.readProperty,
        disabled: false
    },
    {
        label: $t('Collector.actions.index-6100078-17'),
        value: "write",
        img: sceneImages.writeProperty,
        disabled: false
    },
    {
        label: $t('Collector.actions.index-6100078-9'),
        value: "sub",
        img: sceneImages.reportProperty,
        disabled: false
    },
];

const showReadProperty = computed(() => {
    return formModel.operator === 'read';
});

const showWriteProperty = computed(() => {
    return formModel.operator === 'write';
});

const showTimer = computed(() => {
    return ['read', 'write'].includes(formModel.operator);
});

watch(() => formModel.operator, () => {
    formModel.writePoints = {};
    formModel.readPoints = [];
})

defineExpose({
    vail: () => {
        return new Promise(async (resolve, reject) => {
            const cloneModel = cloneDeep(formModel);
            const filterKey: string[] = [];
            const typeData = await typeForm.value?.validateFields();

            if (!typeData) return resolve(false);

            if (!showReadProperty.value) {
                filterKey.push("readPoints");
            }

            if (showTimer.value) {
                const timerData = await timerRef.value?.validateFields();
                if (!timerData) return resolve(false);
            } else {
                filterKey.push("timer");
            }

            if (showWriteProperty.value) {
                const writeData = await writeRef.value?.validateFields();
                cloneModel.value = writeData[Object.keys(writeData)[0]];
                if (!writeData) {
                  return resolve(false);
                } else {
                  cloneModel.writePoints = writeData.data
                }
            } else {
                filterKey.push("writePoints");
            }
            resolve({
                data: omit(cloneModel, filterKey),
                action: optionCache.action,
            });
        });
    },
});
</script>

<style scoped lang="less">
.type {
    margin-top: 24px;

    .alert {
        height: 40px;
        padding-left: 10px;
        color: rgba(0, 0, 0, 0.55);
        line-height: 40px;
        background-color: #f6f6f6;
    }
}
</style>
