<template>
    <div>
        {{data.value || '--'}}
    </div>
</template>

<script lang="ts" setup>
const _data = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});
</script>