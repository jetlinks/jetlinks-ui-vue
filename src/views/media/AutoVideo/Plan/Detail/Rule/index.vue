<template>
    <div>
        <div class="rule-item">
            <span>计划状态：</span>
            <a-switch v-if="editType" v-model:checked="detail.state.value" checkedValue="enabled" un-checked-value="disabled" ></a-switch>
            <div v-else>
                <a-badge
                    :status="
                        detail.state?.value === 'enabled'
                            ? 'success'
                            : 'error'
                    "
                    :text="
                        detail.state?.text"
                />
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
                保存周期（天）*<a-tooltip
                    ><template #title
                        >超出保存周期的录像文件将被自动删除</template
                    ><AIcon
                        type="QuestionCircleOutlined"
                        style="margin-left: 5px"
                    ></AIcon></a-tooltip
                > :
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
        </div>

        <div style="margin-bottom: 24px">
            <span>录制时段：</span>
            <Calendar v-model:value="detail.others.times"  v-model:trigger="detail.others.trigger" />
        </div>
        <a-button v-if="editType" type="primary" :loading="loading" @click="save" >保存</a-button>
    </div>
</template>

<script setup lang="ts" name="Rule">
import Calendar from '../../../components/Calendar/index.vue';
import { useRequest } from '@/hook'
import { updatePlan} from "@/api/media/auto";
import {usePlanDetail} from "../utils";
import {onlyMessage} from "@/utils/comm";

const route = useRoute();
const editType = ref(route.query?.type === 'edit');

const detail = usePlanDetail()

const { run, loading } = useRequest(updatePlan, {
  immediate: false,
  onSuccess() {
    onlyMessage('操作成功')
  }
})

const save = () => {
  detail.value.schedules = detail.value.others.times?.map(item => {}) || []
  run(detail.value)
}

</script>

<style lang="less">
.rule-item {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    .retentionCycleTip {
        font-size: 12px;
        margin-top: 5px;
    }
}
</style>
