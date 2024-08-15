<template>
    <pro-search
        :columns="columns"
        type="simple"
        @search="handleSearch"
        class="scene-search"
        target="scene-trigger-device-device"
    />
    <j-divider style="margin: 0" />
    <JProTable
        ref="actionRef"
        model="CARD"
        :columns="columns"
        :params="params"
        :request="deviceQuery"
        :gridColumn="2"
        :bodyStyle="{
            paddingRight: 0,
            paddingLeft: 0,
        }"
    >
        <template #card="slotProps">
            <CardBox
                :value="slotProps"
                @click="handleClick"
                :active="value[0]?.value === slotProps.id"
                :status="slotProps.state?.value"
                :statusText="slotProps.state?.text"
                :statusNames="{
                    online: 'processing',
                    offline: 'error',
                    notActive: 'warning',
                }"
            >
                <template #img>
                    <slot name="img">
                        <img
                            :src="getImage('/device/instance/device-card.png')"
                        />
                    </slot>
                </template>
                <template #content>
                    <div style="width: calc(100% - 100px)">
                        <Ellipsis>
                            <span style="font-size: 16px; font-weight: 600">
                                {{ slotProps.name }}
                            </span>
                        </Ellipsis>
                    </div>
                    <j-row style="margin-top: 20px">
                        <j-col :span="12">
                            <div class="card-item-content-text">{{ $t('device.Device.54259100-0') }}</div>
                            <div>{{ slotProps.deviceType?.text }}</div>
                        </j-col>
                        <j-col :span="12">
                            <div class="card-item-content-text">{{ $t('device.Device.54259100-1') }}</div>
                            <Ellipsis style="width: 100%">
                                {{ slotProps.productName }}
                            </Ellipsis>
                        </j-col>
                    </j-row>
                </template>
            </CardBox>
        </template>
    </JProTable>
</template>
  
  <script setup lang='ts' name='Product'>
import { query, detail } from '@/api/device/instance';
import { getImage } from '@/utils/comm';
import { PropType } from 'vue';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

type Emit = {
    (e: 'update:value', data: any): void;
    (e: 'change', data: any): void;
};

const actionRef = ref();
const params = ref({
    terms: [],
});
const props = defineProps({
    value: {
        type: Array as PropType<any>,
        default: [],
    },
    detail: {
        type: Object,
        default: () => ({}),
    },
    productId: {
        type: String,
        default: '',
    },
});

const emit = defineEmits<Emit>();

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        width: 300,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('device.Device.54259100-2'),
        dataIndex: 'name',
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: $t('device.Device.54259100-3'),
        dataIndex: 'createTime',
        key: 'createTime',
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: $t('device.Device.54259100-4'),
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: $t('device.Device.54259100-5'), value: 'notActive' },
                { label: $t('device.Device.54259100-6'), value: 'offline' },
                { label: $t('device.Device.54259100-7'), value: 'online' },
            ],
        },
    },
];

const handleSearch = (p: any) => {
    params.value = {
        ...p,
        terms: [
            ...p.terms,
            { terms: [{ column: 'productId', value: props?.productId }] },
        ],
    };
};

const deviceQuery = (p: any) => {
    const sorts: any = [];
    if (props.value[0]?.value) {
        sorts.push({
            name: 'id',
            value: props.value[0]?.value,
        });
    }
    sorts.push({ name: 'createTime', order: 'desc' });
    p.sorts = sorts;
    return query(p);
};

const handleClick = (_detail: any) => {
    if (props.value?.[0]?.value === _detail.id) {
        emit('update:value', undefined);
        emit('change', {});
    } else {
        emit('update:value', [{ value: _detail.id, name: _detail.name }]);
        emit('change', _detail);
    }
};

onMounted(() => {
    if(props.value?.[0]?.value){
        detail(props.value?.[0]?.value).then(resp => {
            emit('change', resp.result);
        })
    }
})

watchEffect(() => {
    params.value = {
        ...params.value,
        terms: params.value?.terms
            ? [
                  ...(params.value.terms || []),
                  { terms: [{ column: 'productId', value: props?.productId }] },
              ]
            : [{ terms: [{ column: 'productId', value: props?.productId }] }],
    };
});
</script>
  
  <style scoped lang='less'>
.search {
    margin-bottom: 0;
    padding: 0 0 24px 0;
}
</style>