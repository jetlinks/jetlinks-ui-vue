<template>
    <a-modal visible :title="$t('Export.index.047269-0')" @cancel="close" @ok="downLoad" :maskClosable="false"
        :confirmLoading="loading" :width="900">
        <JProTable
            :columns="columns"
            mode="CARD"
            :request="getDic_page"
            :gridColumn="2"
            :defaultParams="{sorts: [{ name: 'createTime', order: 'desc' }]}"
        >
            <template #headerLeftRender>
                {{ $t('Export.index.047269-1') }}
            </template>
            <template #card="slotProps">
                <CardBox :value="slotProps" :showStatus="false"  :active="_selectedRowKeys.includes(slotProps.id)" @click="onSelectChange">
                    <template #content>
                        <a-row>
                                <a-col :span="12">
                                    <j-ellipsis style="width: 100%">
                                    <div>{{ $t('Export.index.047269-2') }}{{ slotProps.name }}</div>
                                    </j-ellipsis>
                                </a-col>
                                <a-col :span="12">
                                    <j-ellipsis style="width: 100%">
                                       {{ $t('Export.index.047269-3') }}{{ slotProps.id }}
                                    </j-ellipsis>
                                </a-col>
                        </a-row>
                    </template>
                </CardBox>
            </template>
        </JProTable>
    </a-modal>
</template>

<script lang="ts" setup name="DictionaryExport">
import { getDic_page , downDic} from '@/api/system/dictionary';
import { onlyMessage , downloadFileByUrl } from '@jetlinks-web/utils';
import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const emit = defineEmits(['closeDown'])
const loading = ref(false)
const columns = [ {
        title:'name',
        dataIndex:'name',
        key:'name',
        ellipsis: true,
    },
    {
        title: 'name',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
    }]
const _selectedRowKeys:any = ref([])
const onSelectChange = (dt: any) => {
    if (_selectedRowKeys.value.includes(dt.id)) {
        const _index = _selectedRowKeys.value.findIndex((i:any) => i === dt.id);
        _selectedRowKeys.value.splice(_index, 1);
    } else {
        _selectedRowKeys.value = [..._selectedRowKeys.value, dt.id];
    }
};
const close = () =>{
    emit('closeDown')
}
const downLoad = async() =>{
    if(_selectedRowKeys.value.length){
        const res:any = await downDic({
            terms:[
                {
                    terms:[
                        {
                            value:_selectedRowKeys.value,
                            termType:'in',
                            column:'id'
                        }
                    ]
                }
            ]
        })
        if(res.status === 200 && res.result){
            const json = JSON.stringify(res.result)
            if (json) {
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            downloadFileByUrl(url, $t('Export.index.047269-4', [dayjs().format('YYYY-MM-DD HH:mm:ss')]), 'json');
            emit('closeDown');
            }
            emit('closeDown')
        }
    }else{
        onlyMessage($t('Export.index.047269-5'))
    }
}
</script>
<style lang="less" scoped>
</style>
