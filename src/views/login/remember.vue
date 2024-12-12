<template>
    <a-checkbox :checked="checked" @change="change" >{{ $t('login.remember.102238-0') }}</a-checkbox>
</template>
<script setup name="Remember" lang="ts">
const emit = defineEmits(['update:value', 'update:expires'])
const checked = ref(false)

const change = (e: any) => {
    checked.value = e.target.checked
    emit('update:value', e.target.checked)
    emit('update:expires', e.target.checked ? -1 : 3600000)
}

</script>