<template>
    <j-modal visible :title="$t('Export.index.464663-0')" @cancel="close" @ok="downLoad" :maskClosable="false" 
        :confirmLoading="loading" :width="900">
        <JProTable 
            :columns="columns" 
            model="CARD" 
            :request="getDic_page"
            :gridColumn="2"
            :defaultParams="{sorts: [{ name: 'createTime', order: 'desc' }]}"
        >
            <template #headerTitle>
                {{ $t('Export.index.464663-1') }}
            </template>
            <template #card="slotProps">
                <CardBox :value="slotProps" :showStatus="false"  :active="_selectedRowKeys.includes(slotProps.id)" @click="onSelectChange">
                    <template #content>
                        <j-row>
                                <j-col :span="12">
                                    <Ellipsis style="width: 100%">
                                    <div>{{ $t('Export.index.464663-2') }}{{ slotProps.name }}</div>
                                    </Ellipsis>
                                </j-col>
                                <j-col :span="12">
                                    <Ellipsis style="width: 100%">
                                       {{ $t('Export.index.464663-3') }}{{ slotProps.id }}
                                    </Ellipsis>
                                </j-col>
                        </j-row>
                    </template>
                </CardBox>
            </template>
        </JProTable>
    </j-modal>
</template>

<script lang="ts" setup>
import { getDic_page , downDic} from '@/api/system/dictionary';
import { onlyMessage } from '@/utils/comm';
import { downloadFileByUrl } from '@/utils/utils';
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
            downloadFileByUrl(url, $t('Export.index.464663-4')+dayjs().format('YYYY-MM-DD HH:mm:ss'), 'json');
            emit('closeDown');
            }
            emit('closeDown')
        }
    }else{
        onlyMessage($t('Export.index.464663-5'))
    }
}
</script>
<style lang="less" scoped>
</style>