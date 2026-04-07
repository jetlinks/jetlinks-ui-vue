<template>
    <a-modal
        :zIndex="1072"
        :mask-closable="false"
        open
        width="1300px"
        :title="$t('FRuleEditor.index.911643-0')"
        centered
        :destroyOnClose="true"
        :dialogStyle="{
          zIndex: 1072
        }"
        :getContainer="(node) => tableWrapperRef || node"
        @cancel="handleCancel"
    >
        <div class="header" v-if="virtualRule?.windowType && virtualRule?.windowType !== 'undefined'">
            <div class="header-item">
                {{
                    virtualRule?.windowType === 'time' ? $t('FRuleEditor.index.911643-1') : $t('FRuleEditor.index.911643-2')
                }}
            </div>
            <div class="header-item">
                <div>{{ $t('FRuleEditor.index.911643-3') }} <span>{{ aggType || '--' }}</span></div>
                <div>{{ $t('FRuleEditor.index.911643-4') }}({{ $t('FRuleEditor.index.911643-5') }})：<span>{{ virtualRule?.window?.span || '--' }}</span></div>
                <div>{{ $t('FRuleEditor.index.911643-6') }}({{ $t('FRuleEditor.index.911643-5') }}): <span>{{ virtualRule?.window?.every || '--' }}</span></div>
            </div>
        </div>
        <div class="box">
            <div class="left">
                <div>
                  <Editor
                    ref="editor"
                    mode="advance"
                    key="advance"
                    v-model:value="_value"
                    :tips="tips"
                  />
                </div>
                <div style="margin-top: 10px;">
                  <Debug
                    :virtualRule="{
                        ...virtualRule,
                        script: _value,
                    }"
                    :propertiesOptions="propertiesOptions"
                    :id="id"
                  />
                </div>
            </div>
            <div class="right">
              <Operator :id="id" :propertiesOptions="propertiesOptions" @add-operator-value="addOperatorValue" />
            </div>
        </div>
        <template #footer>
            <a-space>
                <a-button @click="handleCancel">{{ $t('FRuleEditor.index.911643-7') }}</a-button>
                <a-button @click="handleOk" type="primary">{{ $t('FRuleEditor.index.911643-8') }}</a-button>
            </a-space>
        </template>
    </a-modal>
</template>
<script setup lang="ts" name="FRuleEditor">
import Editor from './Editor/index.vue';
import Debug from './Debug/index.vue';
import Operator from './Operator/index.vue';
import { cloneDeep } from 'lodash-es';
import {useTableWrapper} from "../../components/Metadata/context";
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
interface Emits {
    (e: 'save', data: string | undefined): void;
    (e: 'close'): void;
}
const emit = defineEmits<Emits>();

const props = defineProps({
    value: String,
    id: String,
    virtualRule: Object,
    aggList: Array,
    propertiesOptions: Array
});

const _value = ref<string | undefined>(props.value);
const tableWrapperRef = useTableWrapper()
const tips = ref<any[]>([])
const handleCancel = () => {
    emit('close');
};

const handleOk = () => {
    emit('save', _value.value);
};

const aggType = computed(() => {
    const _item: any =  (props?.aggList || []).find((item: any) => {
        return item?.value === props.virtualRule?.aggType
    })
    return _item?.label
})

const editor = ref();
const addOperatorValue = (val: string) => {
    editor.value.addOperatorValue(val);
};

const getAllCrud = () => {
  const list = cloneDeep(props.propertiesOptions)?.filter((i:any)=>
    props?.id !== i.id
  )
  // console.log(list,'list')
  // 转化为语法提示
  list.forEach(item => {
    // console.log(item)
    const config = item
    tips.value.push({
      label: $t('FRuleEditor.index.911643-9', [config.name]),
      insertText:`$recent ("${config.id}")`,
      kind: 18,
    })
    tips.value.push({
        label: $t('FRuleEditor.index.911643-10', [config.name]),
        insertText: `$lastState("${config.id}"))`,
        kind: 18
    })
  })
}


// watch(() => _value.value, () => {
//     console.log(_value.value)
//     _disabled.value = true
// })

// const onSuccess = (bool: boolean) => {
//     _disabled.value = bool;
// }
getAllCrud()
</script>
<style lang="less" scoped>
.header {
    margin-bottom: 20px;
    .header-item {
        display: flex;
        gap: 24px;

        div span {
            color: rgba(0, 0, 0, 0.8);
        }
    }
}
.box {
    display: flex;
    justify-content: flex-start;
    width: 100%;

    .left {
        width: 75%;
    }

    .right {
        flex: 1 1 0;
        margin-left: 10px;
        padding-left: 10px;
        border-left: 1px solid lightgray;
    }
}
</style>
