<template>
    <div>
        <div class="rule-item">
            <span>计划状态：</span>
            <a-switch
                v-if="editType"
                v-model:checked="_state"
                checkedValue="enabled"
                unCheckedValue="disabled"
            ></a-switch>
            <div v-else>
                <a-badge
                    :status="
                        detail?.state?.value === 'enabled' ? 'success' : 'error'
                    "
                />
                {{ detail?.state?.value === 'enabled' ? '正常' : '禁用' }}
                <PermissionButton
                    type="link"
                    :hasPermission="true"
                    @click="editType = true"
                >
                    <AIcon type="EditOutlined" />
                </PermissionButton>
            </div>
        </div>
        <div class="rule-item">
            <div>
                保存周期（天）<span style="color:red;">*</span>
            </div>
            <a-input-number
                v-if="editType"
                :precision="0"
                :min="1"
                placeholder="请输入录像文件保存天数"
                v-model:value="detail.saveDays"
                style="width: 200px"
            ></a-input-number>
            <div v-else style="margin-left: 10px">{{ detail.saveDays }}</div>
            <div class="retentionCycleTip">
                超出保存周期的录像文件将被自动删除
            </div>
        </div>

        <div>
            <span>录制时段：</span>
            <Calendar
                v-model:value="detail.others.times"
                v-model:trigger="detail.others.trigger"
                type="timing"
                :disabled="!editType"
            />
        </div>
        <a-button
            v-if="editType"
            style="margin-top: 20px"
            type="primary"
            @click="handleSave"
            >保存</a-button
        >
    </div>
</template>

<script setup lang="ts" name="Rule">
import Calendar from '@/views/media/AutoVideo/components/Calendar/index.vue';
import { inject, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { updatePlan } from '@/api/media/auto';
import { onlyMessage } from '@/utils/comm';

const route = useRoute();
const editType = ref(route.query?.type === 'edit');
const detail = inject<any>('detail');
const _state = ref();

const handleArr = (arr) => {
    const schedules = [];
    arr.forEach((item) => {
        if (item.times.length !== 0) {
            item.times.forEach((i) => {
                if (i?.period?.from !== '') {
                    schedules.push(i);
                }
            });
        }
    });
    return schedules;
};

const handleSave = async () => {
    const schedules = handleArr(detail.value?.others.times);
    detail.value.state = _state.value ;
    if (detail.value.others.trigger === 'week') {
        detail.value.schedules = schedules;
    } else {
        detail.value.schedules = [
            {
                trigger: 'multi',
                multi: {
                    type: 'or',
                    spec: schedules.map((item) => {
                        const { when, ...other } = item;
                        return {
                            ...other,
                            scheduleTags: when,
                        };
                    }),
                },
            },
        ];
    }
    const res = await updatePlan(detail.value);
    if (res.success) {
        onlyMessage('操作成功');
    }
};

// onMounted(() => {
//     _state.value = detail.value?.state?.value;
// });
watch(
    () => detail.value?.state?.value,
    (val)=>{
        _state.value = detail.value?.state?.value
    },
    {immediate:true}
)

</script>

<style lang="less">
.rule-item {
    margin-bottom: 24px;
    display: flex;
    justify-items: center;
    align-items: center;
    .retentionCycleTip {
        font-size: 12px;
        margin-top: 5px;
        margin-left: 10px;
        color: #a3a3a3;
    }
}
</style>
