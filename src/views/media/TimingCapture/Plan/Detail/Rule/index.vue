<template>
    <div>
        <div class="rule-item">
            <span>计划状态：</span>
            <a-switch v-if="editType"></a-switch>
            <div v-else>
                <PermissionButton 
                    type="link"
                    hasPermission="device/Instance:action"
                    @click="editType = true"
                >
                    <AIcon type="EditOutlined"  />
                </PermissionButton>
            </div>
        </div>
        <div class="rule-item">
            <div>
                保存周期（天）*<a-tooltip
                    ><template #title
                        >超出保存周期的录像文件将被自动删除</template
                    ><AIcon
                        type="QuestionCircleOutlined"
                        style="margin-left: 5px"
                    ></AIcon></a-tooltip
                >：
            </div>
            <a-input-number
                v-if="editType"
                :precision="0"
                :min="1"
                placeholder="请输入录像文件保存天数"
                style="width: 200px"
            ></a-input-number>
            <div v-else></div>
        </div>

        <div>
            <span>录制时段：</span>
            <Calendar />
        </div>
        <a-button v-if="editType" type="primary">保存</a-button>
    </div>
</template>

<script setup lang="ts" name="Rule">
import Calendar from '@/views/media/AutoVideo/components/Calendar/index.vue';
const route = useRoute();
const editType = ref(route.query?.type === 'edit')
</script>

<style lang="less">
.rule-item {
    margin-bottom: 40px;
    display: flex;
    .retentionCycleTip {
        font-size: 12px;
        margin-top: 5px;
    }
}
</style>
