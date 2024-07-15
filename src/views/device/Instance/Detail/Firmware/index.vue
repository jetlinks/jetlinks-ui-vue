<template>
    <div class="firmwareContainer">
        <div
            v-for="i in firmwareList"
            class="firmwareBox"
            @click="() => showTask(i.id)"
        >
            <div class="firmwareHead">
                <Ellipsis style="width: 200px">
                    {{ i.name }}
                </Ellipsis>
                <Ellipsis style="width: 200px">{{ i.description }}</Ellipsis>
            </div>
            <div class="firmwareFoot">
                <div>固件版本：{{ i.version }}</div>
                <div>签名方式：{{ i.signMethod }}</div>
                <div>
                    创建时间：{{
                        dayjs(i.createTime).format('YYYY-MM-DD HH:mm:ss')
                    }}
                </div>
            </div>
            <div class="mask">查看升级任务</div>
        </div>
    </div>
    <Task
        v-if="visibleTask"
        :firmwareId="firmwareId"
        showPosition="detail"
        :deviceId="props.type === 'device' ? current.id : ''"
        @close-drawer="visibleTask = false"
    />
</template>

<script setup>
import { useInstanceStore } from '@/store/instance';
import { useProductStore } from '@/store/product';
import { queryPaginateNot, queryTaskPaginateNot } from '@/api/device/firmware';
import Task from '@/views/device/Firmware/Task/index.vue';
import dayjs from 'dayjs';
const props = defineProps({
    type: {
        type: String,
        default: 'device',
    },
});
const { current } =
    props.type === 'device' ? useInstanceStore() : useProductStore();
const firmwareList = ref();
const firmwareId = ref();
const visibleTask = ref(false);
const queryFirmwareList = async () => {
    const res = await queryPaginateNot({
        paging: false,
        sorts: [
            {
                name: 'createTime',
                order: 'desc',
            },
        ],
        terms: [
            {
                terms: [
                    {
                        type: 'or',
                        value:  props.type === 'device' ? current.productId : current.id,
                        termType: 'eq',
                        column: 'productId',
                    },
                ],
            },
        ],
    });
    if (res.success) {
        firmwareList.value = res.result;
    }
    if (props.type === 'device') {
        // 查看固件所属产品下所有的任务 过滤掉不包含该设备的升级任务的固件
        const resp = await queryTaskPaginateNot({
            paging: false,
            sorts: [{ name: 'createTime', order: 'desc' }],
            terms: [
                {
                    terms: [
                        {
                            column: 'productId',
                            value: current.productId,
                        },
                    ],
                },
            ],
        });
        if (resp.success) {
            firmwareList.value = firmwareList.value.filter((i) => {
                return resp.result.find((item) => {
                    return (
                        i.id === item.firmwareId &&
                        (!item?.deviceId || item.deviceId.includes(current.id))
                    );
                });
            });
        }
    }
};
const showTask = (id) => {
    firmwareId.value = id;
    visibleTask.value = true;
};
onMounted(() => {
    queryFirmwareList();
});
</script>
<style lang="less" scoped>
.firmwareContainer {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .firmwareBox {
        width: 48%;
        position: relative;
        margin-bottom: 20px;
        border: 1px solid rgb(215, 215, 215);
        box-sizing: border-box;
        padding: 10px;
        .mask {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 999;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            font-size: 16px;
            height: 100%;
            color: transparent;
            padding-top: 10px;
            background-color: rgba(#000, 0);
            cursor: pointer;
            transition: background-color 0.3s;

            &:hover {
                background-color: rgba(#000, 0.4);
                color: #fff;
            }
        }
    }
    .firmwareHead,
    .firmwareFoot {
        display: flex;
    }
    .firmwareFoot {
        justify-content: space-between;
    }
}
</style>
