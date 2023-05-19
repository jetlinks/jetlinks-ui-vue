<template>
    <j-modal
        visible
        title="绑定"
        width="520px"
        @ok="handleOk"
        :maskClosable="false"
        class="edit-dialog-container"
        @cancel="cancel"
    >
        是否继续分配产品下的具体设备
    </j-modal>
</template>

<script setup lang="ts">
import { useDepartmentStore } from 'store/department'

const emits = defineEmits(['confirm','update:visible']);
const departmentStore = useDepartmentStore();
const props = defineProps<{
    visible: boolean;
}>();

const handleOk = () => {
    emits('confirm');
    emits('update:visible',false)
};

const cancel = () => {
  departmentStore.setProductId()
  emits('update:visible',false)
}

</script>

<style scoped></style>
