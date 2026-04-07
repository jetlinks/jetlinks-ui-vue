<template>
    <div class="firmwareContainer" v-if="firmwareList?.length">
        <div v-for="i in firmwareList" class="firmwareBox">
            <CardBox
                :showStatus="false"
                :value="i"
                @click="() => showTask(i.id)"
                v-bind="i"
            >
                <template #content>
                    <div class="cardContent">
                        <div class="firmwareHead">
                            <j-ellipsis style="width: 200px">
                                {{ i.name }}
                            </j-ellipsis>
                        </div>
                        <div class="firmwareDes">
                            <j-ellipsis style="width: 200px">{{
                                i.description
                            }}</j-ellipsis>
                        </div>
                        <div class="firmwareFoot">
                            <div>
                                <span class="firmwareFootTitle">{{ $t('Firmware.index.751928-0') }}</span
                                >{{ i.signMethod }}
                            </div>
                            <div>
                                <span class="firmwareFootTitle">{{ $t('Firmware.index.751928-1') }}</span
                                >{{
                                    dayjs(i.createTime).format(
                                        'YYYY-MM-DD HH:mm:ss',
                                    )
                                }}
                            </div>
                        </div>
                        <div class="version">
                            <j-ellipsis style="max-width: 100px">
                                V {{ i.version }}
                            </j-ellipsis>
                        </div>
                    </div>
                    <!-- <div class="mask">查看升级任务</div> -->
                </template>
            </CardBox>
        </div>
    </div>
    <JEmpty v-else></JEmpty>
    <Task
        v-if="visibleTask"
        :firmwareId="firmwareId"
        :type="type"
        showPosition="detail"
        :deviceId="props.type === 'device' ? current.id : undefined"
        @close-drawer="visibleTask = false"
    />
</template>

<script setup>
import { useInstanceStore } from '../../../../../store/instance';
import { useProductStore } from '../../../../../store/product';
import { queryPaginateNot, historyPaginateNot } from '../../../../../api/firmware';
import Task from '../../../Firmware/Task/index.vue';
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
                        value:
                            props.type === 'device'
                                ? current.productId
                                : current.id,
                        termType: 'eq',
                        column: 'productId',
                    },
                ],
            },
        ],
    });
    if (res.success) {

    if (props.type === 'device') {
        // 查看固件所属产品下所有的任务 过滤掉不包含该设备的升级任务的固件
        const resp = await historyPaginateNot({
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
                firmwareList.value = res.result.filter((i) => {
                    return resp.result.find((item) => {
                        return (
                            i.id === item.firmwareId &&
                            current.id === item.deviceId
                        );
                    });
                });
            }
        }else{
            firmwareList.value = res.result;
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
    flex-wrap: wrap;
    gap: 8px;
    .firmwareBox {
        width: 33%;
        position: relative;
        margin-bottom: 20px;
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
    .cardContent {
        position: relative;
        .version {
            position: absolute;
            top: -10px;
            right: 5px;
        }
    }
    .firmwareHead,
    .firmwareFoot {
        display: flex;
    }
    .firmwareHead {
        font-size: 16px;
        font-weight: 600;
    }
    .firmwareDes {
        height: 22px;
        color: #777777;
        margin: 8px 0;
    }
    .firmwareFoot {
        justify-content: space-between;
        .firmwareFootTitle{
            color:#A3A3A3
        }
    }
}
</style>
