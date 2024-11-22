<template>
    <j-card :hoverable="true" class="card-box">
        <!-- <j-spin :spinning="loading"> -->
        <div class="card-container">
            <div class="header">
                <div class="title">
                    <Ellipsis style="width: 100%;">
                        {{ _props.data.name }}
                    </Ellipsis>
                </div>
                <div class="extra">
                    <j-space :size="16">
                        <template v-for="i in actions" :key="i.key">
                            <j-tooltip
                                v-bind="i.tooltip"
                                v-if="i.key !== 'edit'"
                            >
                                <j-button
                                    style="padding: 0; margin: 0"
                                    type="link"
                                    :disabled="i.disabled"
                                    @click="i.onClick && i.onClick(data)"
                                >
                                    <AIcon
                                        :type="i.icon"
                                        style="color: #323130; font-size: 12px"
                                    />
                                </j-button>
                            </j-tooltip>
                            <PermissionButton
                                :disabled="i.disabled"
                                v-else
                                :popConfirm="i.popConfirm"
                                :tooltip="i.tooltip"
                                @click="i.onClick && i.onClick(slotProps)"
                                type="link"
                                style="padding: 0px"
                               
                            >
                                <template #icon
                                    ><AIcon :type="i.icon" style="color: #323130; font-size: 12px"
                                /></template>
                            </PermissionButton>
                        </template>
                    </j-space>
                </div>
            </div>
            <div class="value">
                <ValueRender :data="data" :value="_props.data" type="card" />
            </div>
            <div class="bottom">
                <div style="color: rgba(0, 0, 0, 0.65); font-size: 12px">
                    更新时间
                </div>
                <div class="time-value">
                    {{ _props?.data?.timeString || '--' }}
                </div>
            </div>
        </div>
        <!-- </j-spin> -->
    </j-card>
</template>

<script lang="ts" setup>
import ValueRender from './ValueRender.vue';
const _props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
    actions: {
        type: Array,
        default: () => [],
    },
});
// const loading = ref<boolean>(true);

// watchEffect(() => {
//     if (_props.data) {
//         console.log(_props.data)
//         loading.value = false;
//     }
// });
</script>

<style lang="less" scoped>
.card-box {
    background-color: rgba(0, 0, 0, 0.02);
    width: 100%;

    .card-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 154px;

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .title {
                width: 60%;
                margin-right: 10px;
                color: rgba(0, 0, 0, 0.65);
                font-weight: 400;
                font-size: 12px;
            }
        }

        .value {
            height: 60px;
            line-height: 60px;
            color: #323130;
            font-weight: 700;
            font-size: 24px;
            margin: 10px 0;
        }

        .bottom {
            .time-value {
                margin-top: 5px;
                font-size: 16px;
                min-height: 25px;
                color: #000;
            }
        }
    }
}
</style>