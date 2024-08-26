<template>
    <div>
        <div class="rule-item">
            <span>计划状态：</span>
            <a-switch
                v-if="editType"
                v-model:checked="_ref.state"
                checkedValue="enabled"
                unCheckedValue="disabled"
            ></a-switch>
            <div v-else>
                <a-badge
                    :status="
                        detail?.state?.value === 'enabled' ? 'success' : 'error'
                    "
                    :text="detail?.state?.value === 'enabled' ? '正常' : '禁用'"
                />
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
                保存周期（天）*<a-tooltip
                    ><template #title
                        >超出保存周期的录像文件将被自动删除</template
                    ><AIcon
                        type="QuestionCircleOutlined"
                        style="margin-left: 5px"
                    ></AIcon></a-tooltip
                >:
            </div>
            <a-input-number
                v-if="editType"
                :precision="0"
                :min="1"
                placeholder="请输入录像文件保存天数"
                v-model:value="_ref.retention"
                style="width: 200px"
            ></a-input-number>
            <div v-else style="margin-left: 10px">{{ _ref.retention }}</div>
        </div>

        <div>
            <span>录制时段：</span>
            <Calendar
                v-model:value="_ref.times"
                v-model:trigger="_ref.trigger"
                type="timing"
                :disabled="!editType"
            />
        </div>
        <a-button v-if="editType" style="margin-top: 20px" type="primary" @click="handleSave"
            >保存</a-button
        >
    </div>
</template>

<script setup lang="ts" name="Rule">
import Calendar from '@/views/media/AutoVideo/components/Calendar/index.vue';
import { inject, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { updatePlan } from '@/api/media/auto';
import { onlyMessage } from '@/utils/comm';

const route = useRoute();
const editType = ref(route.query?.type === 'edit');
const detail = inject<any>('detail');
const _ref = reactive({
    state: 'enabled',
    retention: 1,
    times: [],
    trigger: 'week',
});

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
    const schedules = handleArr(_ref.times);
    console.log('schedules====', schedules);
    const _data: any = {
        state: _ref.state,
        id: detail.value?.id,
        type: 'photo',
        others: {
            retention: _ref.retention,
            times: _ref.times,
            trigger: _ref.trigger,
        },
    };
    if (_data.others.trigger === 'week') {
        _data.schedules = schedules;
    } else {
        _data.schedules = [
            {
                trigger: 'multi',
                multi: {
                    type: 'or',
                    spec: schedules.map((item) => {
                        const { when, ...other } = item;
                        return {
                            ...other,
                            scheduleTags: item.when,
                        };
                    }),
                },
            },
        ];
    }
    const res = await updatePlan(_data);
    if (res.success) {
        onlyMessage('操作成功')
    }
    console.log('_data====', _data);
};

watch(
    () => detail.value,
    (val) => {
        if (val) {
            _ref.state = detail.value?.state?.value;
            _ref.retention = detail.value?.others?.retention;
            _ref.times = detail.value?.others?.times;
            _ref.trigger = detail.value?.others?.trigger;
        }
    },
);

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
    }
}
</style>
