<template>
    <div>
        <div class="rule-item">
            <span>计划状态：</span>
            <a-switch
                v-if="editType"
                v-model:checked="_state"
                checkedValue="enabled"
                un-checked-value="disabled"
            ></a-switch>
            <div v-else>
                <a-badge
                    :status="
                        detail.state?.value === 'enabled' ? 'success' : 'error'
                    "
                />
                {{ detail.state?.value === 'enabled' ? '正常' : '禁用' }}
                <PermissionButton
                    type="link"
                    hasPermission="device/Instance:action"
                    @click="editType = true"
                >
                    <AIcon type="EditOutlined" />
                </PermissionButton>
            </div>
        </div>
        <div class="rule-item">
            <div>
                保存周期（天）<span style="color: red; margin-right: 10px"
                    >*</span
                >
            </div>
            <a-input-number
                v-if="editType"
                :precision="0"
                :min="1"
                placeholder="请输入录像文件保存天数"
                style="width: 200px"
                v-model:value="detail.others.retention"
            ></a-input-number>
            <div v-else>{{ detail.others.retention }}</div>
            <div class="retentionCycleTip">
                超出保存周期的录像文件将被自动删除
            </div>
        </div>

        <div style="margin-bottom: 24px">
            <!-- <span>录制时段：</span> -->
            <Calendar v-model:value="detail.others.times"  v-model:trigger="detail.others.trigger" />
        </div>
        <a-button
            v-if="editType"
            type="primary"
            :loading="loading"
            @click="save"
            >保存</a-button
        >
    </div>
</template>

<script setup lang="ts" name="Rule">
import Calendar from '../../../components/Calendar/index.vue';
import { useRequest } from '@/hook';
import { updatePlan } from '@/api/media/auto';
import { usePlanDetail } from '../utils';
import { onlyMessage } from '@/utils/comm';

const route = useRoute();
const editType = ref(route.query?.type === 'edit');

const detail = usePlanDetail();
const _state = ref();

const { run, loading } = useRequest(updatePlan, {
    immediate: false,
    onSuccess() {
        onlyMessage('操作成功');
        editType.value = false;
    },
});

const handleArr = (arr) => {
    const _newArr = [];
    arr.forEach((item) => {
        if (item.times.length !== 0) {
            item.times.forEach((i) => {
                if (i?.from) {
                    _newArr.push(i);
                }
            });
        }
    });
    return _newArr;
};

const save = () => {
    const durations = handleArr(detail.value?.others.times);
    const range = durations.map((item) => item.when[0]);
    const obj = {
        trigger: detail.value.others.trigger,
        mod: 'once',
    };
    if (detail.value.others.trigger === 'week') {
        obj['when'] = range;
    } else {
        obj['scheduleTags'] = range;
        detail.value.others.durations = durations.map((item) => {
            const { when, ...others } = item;
            return {
                ...others,
                scheduleTags: when,
            };
        });
    }
    detail.value.state.value = _state.value;
    detail.value.schedules = [obj]
    run(detail.value)
}

watch(
    () => detail.value?.state?.value,
    () => {
        _state.value = detail.value?.state?.value;
    },
    { immediate: true },
);
</script>

<style lang="less">
.rule-item {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    .retentionCycleTip {
        font-size: 12px;
        margin-top: 5px;
        margin-left: 10px;
        color: #a3a3a3;
    }
}
</style>
