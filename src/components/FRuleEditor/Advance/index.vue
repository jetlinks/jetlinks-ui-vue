<template>
  <a-modal :mask-closable="false" visible width="70vw" title="设置属性规则" @cancel="handleCancel" @ok="handleOk">
    <div class="advance-box">
        <div class="left">
          <Editor
            ref="editor"
            mode="advance"
            key="advance"
            v-model:value="_value"
          />
          <Debug
            :virtualRule="{
              ...virtualRule,
              script: _value,
            }"
            :id="id"
          />
        </div>
        <div class="right">
          <Operator :id="id" @add-operator-value="addOperatorValue"/>
        </div>
      </div>
  </a-modal>
</template>
<script setup lang="ts" name="Advance">
import Editor from '../Editor/index.vue'
import Debug from '../Debug/index.vue'
import Operator from '../Operator/index.vue'

interface Emits {
  (e: 'update:value', data: string | undefined): void;
  (e: 'change', data: string): void;
}
const emit = defineEmits<Emits>();

const props = defineProps({
  value: String,
  id: String,
  virtualRule: Object
})

const _value = ref<string | undefined>(props.value)

const handleCancel = () => {
  emit('change', 'simple')
}
const handleOk = () => {
  emit('update:value', _value.value)
  emit('change', 'simple')
}

const editor = ref()
const addOperatorValue = (val: string) => {
  editor.value.addOperatorValue(val)
}

</script>
<style lang="less" scoped>
.advance-box {
  display: flex;
  justify-content: flex-start;
  width: 100%;

  .left {
    width: 70%;
  }

  .right {
    width: 30%;
    margin-left: 10px;
    padding-left: 10px;
    border-left: 1px solid lightgray;
  }
}
</style>