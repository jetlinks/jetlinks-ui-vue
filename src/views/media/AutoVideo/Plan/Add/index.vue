<template>
  <a-modal visible title="新增-录像计划" @ok="submitData" @cancel="$emit('closeModal')">
    <a-form ref="formRef" layout="vertical" :model="formData">
        <a-form-item label="计划名称" name="name" :rules="[
            {
                required:true,
                message:'请输入计划名称'
            },{
                max:64,
                message:'最多可输入64个字符'
            }
        ]">
            <a-input v-model:value="formData.name"></a-input>
        </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
const emit = defineEmits(['closeModal'])
const formRef = ref()
const formData = reactive({
    name: ''
})
const submitData = formRef.value?.validate().then((res)=>{

})
</script>
<style lang="less" scoped>
</style>