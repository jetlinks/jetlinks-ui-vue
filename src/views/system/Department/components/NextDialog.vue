<template>
    <j-modal
        visible
        :title="$t('components.NextDialog.338026-0')"
        width="520px"
        @ok="handleOk"
        :maskClosable="false"
        class="edit-dialog-container"
        @cancel="cancel"
    >
        {{ $t('components.NextDialog.338026-1') }}
    </j-modal>
</template>

<script setup lang="ts">
import { useDepartmentStore } from 'store/department'
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

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
