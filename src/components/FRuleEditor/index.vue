<template>
    <j-modal
        :zIndex="1200"
        :mask-closable="false"
        visible
        width="70vw"
        title="编辑规则"
        @cancel="handleCancel"
        @ok="handleOk"
    >
        <div class="header" v-if="virtualRule?.windowType && virtualRule?.windowType !== 'undefined'">
            <div class="header-item">
                {{
                    virtualRule?.windowType === 'time' ? '时间窗口' : '频次窗口'
                }}
            </div>
            <div class="header-item">
                <div>聚合函数: <span>{{ aggType || '--' }}</span></div>
                <div>窗口长度(次)：<span>{{ virtualRule?.window?.span || '--' }}</span></div>
                <div>步长(次): <span>{{ virtualRule?.window?.every || '--' }}</span></div>
            </div>
        </div>
        <div class="box">
            <div class="left">
                <div>
                    <Operator :id="id" @add-operator-value="addOperatorValue" />
                </div>
                <div style="margin-top: 10px;">
                    <Editor
                        ref="editor"
                        mode="advance"
                        key="advance"
                        v-model:value="_value"
                    />
                </div>
            </div>
            <div class="right">
                <Debug
                    :virtualRule="{
                        ...virtualRule,
                        script: _value,
                    }"
                    :id="id"
                />
            </div>
        </div>
    </j-modal>
</template>
<script setup lang="ts" name="FRuleEditor">
import Editor from './Editor/index.vue';
import Debug from './Debug/index.vue';
import Operator from './Operator/index.vue';

interface Emits {
    (e: 'save', data: string | undefined): void;
    (e: 'close'): void;
}
const emit = defineEmits<Emits>();

const props = defineProps({
    value: String,
    id: String,
    virtualRule: Object,
    aggList: Array
});

const _value = ref<string | undefined>(props.value);

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
  console.log(val)
    editor.value.addOperatorValue(val);
};
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
        width: 60%;
    }

    .right {
        width: 40%;
        margin-left: 10px;
        padding-left: 10px;
        border-left: 1px solid lightgray;
    }
}
</style>