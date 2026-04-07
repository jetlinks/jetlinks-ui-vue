<template>
    <a-modal
        open
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

const emits = defineEmits(['confirm','update:visible']);
const props = defineProps<{
    visible: boolean;
}>();

const handleOk = () => {
    emits('confirm');
    emits('update:visible',false)
};

const cancel = () => {
  emits('update:visible',false)
}

</script>

<style scoped></style>
