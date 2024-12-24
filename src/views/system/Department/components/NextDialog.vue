<template>
    <a-modal
        visible
        :title="$t('components.NextDialog.372830-0')"
        width="520px"
        @ok="handleOk"
        :maskClosable="false"
        class="edit-dialog-container"
        @cancel="cancel"
    >
        {{ $t('components.NextDialog.372830-1') }}
    </a-modal>
</template>

<script setup lang="ts">
import { useDepartmentStore } from '@/store/department'

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
//   departmentStore.setProductId()
  emits('update:visible',false)
}

</script>

<style scoped></style>
