<template>
    <a-modal visible title="未保存" width="500px" @cancel="emit('close')">
        <span style="margin: 12px 0;">存在未保存数据,确认关闭</span> 
        <template #footer>
            <div class="footer">
                <a-button @click="emit('close')">不保存，直接关闭</a-button>
                <div>
                    <a-button type="primary" @click="emit('cancel')">取消</a-button>
                    <a-button type="primary" @click="emit('ok')">保存并关闭</a-button>
                </div>
             
            </div>
        </template>
    </a-modal>
</template>

<script setup>

const emit = defineEmits(['cancel','close','ok']);

</script>

<style lang="less" scoped>
.footer{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
