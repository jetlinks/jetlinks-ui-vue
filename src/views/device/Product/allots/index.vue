<template>
    <j-modal
        :visible="openView"
        :title="title"
        width="650px"
        @ok="confirm"
        @cancel="cancel"
        cancelText="取消"
        okText="确定下发"
        :confirmLoading="loading"
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
import {
    queryFactoryList,
    queryFactoryIssued,
    sandProduct,
} from '@/api/factory/factory';
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
const loading = ref<boolean>(false);
const targetKeys = ref<string[]>([]);
const factoryList = ref<any>([]);

const confirm = () => {
    loading.value = true;
    let foundObjects = targetKeys.value.map((key) => {
        return factoryList.value.find((obj: any) => {
            delete obj.key;
            return obj.id === key;
        });
    });
    if (props.disProductId && foundObjects.length > 0) {
        sandProduct(props.disProductId, foundObjects)
            .then((res: any) => {
                if (res.status === 200) {
                    onlyMessage('下发成功！');
                    loading.value = false;
                    emit('close');
                }
            })
            .catch((error) => {
                loading.value = false;
                console.log(error);
            });
    } else {
        onlyMessage('请选中下发工厂，并添加到目标列表中', 'error');
        loading.value = false;
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
    queryFactoryIssued(props.disProductId).then((res: any) => {
        if (res.status === 200) {
            if (res.result.length > 0) {
                targetKeys.value = res.result.map((item: any) => {
                    return item.factoryId;
                });
            } else {
                targetKeys.value = [];
            }
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
