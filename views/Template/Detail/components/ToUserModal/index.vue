<template>
  <div style="display: flex">
    <a-input v-model:value="_value" disabled style="flex: 1; min-width: 0"/>
    <a-button type="primary" @click="visible = true">选择</a-button>
  </div>
  <Modal v-if="visible" :value="toUser" :name="_value" :configId="configId" @save="handleSave" @close="visible = false" />
</template>

<script setup lang="ts">
import {useI18n} from "vue-i18n";
import Modal from './Modal.vue'

const {t: $t} = useI18n();
type Emits = {
  (e: 'update:toUser', data: string | undefined): void;
  (e: 'update:toUserName', data: string | undefined): void;
  (e: 'change', data: string | undefined, option: any): void;
};
type Props = {
  toUser: string | undefined;
  toUserName: string | undefined;
  configId: string | undefined;
};

const emit = defineEmits<Emits>();

const props = defineProps<Props>();
const _value = ref()
const visible = ref(false)

watch(() => props.toUserName, (val) => {
  _value.value = val || props.toUser
}, {
  immediate: true
})

const handleSave = (dt) => {
  visible.value = false
  _value.value = dt.name
  emit('update:toUser', dt.id)
  emit('update:toUserName', dt.name)
  emit('change', dt.id, dt)
}
</script>

<style lang="less" scoped>

</style>
