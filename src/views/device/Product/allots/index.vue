<template>
    <j-modal
        :visible="openView"
        :title="title"
        width="650px"
        @ok="confirm"
        @cancel="cancel"
        cancelText="取消"
        okText="确定下发"
    >
        <j-transfer
            v-model:target-keys="targetKeys"
            :data-source="factoryList"
            show-search
            :list-style="{
                width: '250px',
                height: '300px',
            }"
            :operations="['加入右侧', '加入左侧']"
            :titles="['源列表', '目标列表']"
            :render="(item:any) => `${item.name}`"
            :rowKey="(item:any) => item.id"
        >
            <template #notFoundContent>
                <span>没数据</span>
            </template>
        </j-transfer>
    </j-modal>
</template>
<script lang="ts" setup>
import { queryFactoryList } from '@/api/factory/factory';
import { sandProduct } from '@/api/factory/factory';
import { onlyMessage } from '@/utils/comm';

const props = defineProps({
    disProductId: {
        type: String,
        default: '',
    },
});
const emit = defineEmits(['close']);

const openView = ref(true);
const title = ref('下发');
const targetKeys = ref<string[]>([]);
const factoryList = ref<any>([]);

const confirm = () => {
    let foundObjects = targetKeys.value.map((key) => {
        return factoryList.value.find((obj: any) => {
            delete obj.key;
            return obj.id === key;
        });
    });
    if (props.disProductId && foundObjects) {
        sandProduct(props.disProductId, foundObjects)
            .then((res: any) => {
                if (res.status === 200) {
                    onlyMessage('下发成功！');
                    emit('close');
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
};
const cancel = () => {
    emit('close');
};

//获取穿梭框数据源
const getMock = () => {
    queryFactoryList({
        paging: false,
    }).then((response: any) => {
        if (response.status === 200) {
            factoryList.value = response.result.data;
        }
    });
};

onMounted(() => {
    getMock();
});
</script>

<style lang="less" scoped>
.ant-transfer-list-header {
    .ant-transfer-list-header-selected {
        display: inline-block;
        margin-left: 20px;
        padding-left: 10px;
        .ant-transfer-list-header-title {
            display: inline-block;
            width: 50%;
        }
    }
}
</style>
