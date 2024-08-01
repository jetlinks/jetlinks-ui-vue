<template>
    <div>
        <div>
            <div v-for="group in branchesGroup">
                <div v-for="(branch, index) in group.children">
                    <template v-if="branch.serial?.length">
                        <Actions
                            :actions="branch.serial"
                            :activeKeys="activeKeys"
                            :serial="true"
                        />
                    </template>
                    <template v-if="branch.parallel?.length">
                        <Actions
                            :actions="branch.parallel"
                            :activeKeys="activeKeys"
                        />
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup name="BranchesTabs">
import Actions from './Actions.vue';

const props = defineProps({
    branchesGroup: {
        type: Array,
        default: () => [],
    },
    alarmId: {
        type: String,
        default: undefined,
    },
    sceneId: {
        type: String,
        default: undefined,
    },
    activeKeys: {
        // 后端返回已关联的执行动作
        type: Array,
        default: () => [],
    },

});

const emit = defineEmits(['change', 'select']);

</script>

<style scoped lang="less">
.branches-tabs-title {
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
}

.branches-tabs-alarm {
    padding: 12px 16px;
    border-radius: 4px;
    border: 1px solid #a9a9a9;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:not(:last-child) {
        margin-bottom: 8px;
    }
}
</style>
