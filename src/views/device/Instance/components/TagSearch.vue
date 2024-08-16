<template>
    <j-input @click="show" v-model:value="presentation"> </j-input>
    <j-modal v-if="showTagSearch" :title="$t('components.TagSearch.665533-0')" visible @cancel="showTagSearch = false" @ok="submitSearch">
        <j-form layout="vertical">
            <j-form-item :label="$t('components.TagSearch.665533-1')">
                <j-row :gutter="16" v-for="(i,index) in searchValue" style="margin-bottom: 10px;">
                    <j-col :span="10">
                        <j-input :placeholder="$t('components.TagSearch.665533-2')" v-model:value="i.key"></j-input>
                    </j-col>
                    <j-col :span="10">
                        <j-input :placeholder="$t('components.TagSearch.665533-3')" v-model:value="i.value"></j-input>
                    </j-col>
                    <j-col :span="4">
                        <j-button type="link">
                            <template #icon><AIcon type="MinusCircleOutlined" @click="deletePair(index)"/></template>
                        </j-button>
                    </j-col>
                </j-row>
            </j-form-item>
            <j-button type="link" @click="addPair">
              {{ $t('components.TagSearch.665533-4') }}
            </j-button>
        </j-form>
    </j-modal>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const emit =  defineEmits(['change','update:value'])
const showTagSearch = ref(false);
const presentation = ref('');
const searchValue = ref([{
  key:'',
  value:''
}]);
const show = () => {
    showTagSearch.value = true;
};
const addPair = () =>{
    searchValue.value.push({
      key:'',
      value:''
    })
}
const deletePair = (index:number) =>{
    searchValue.value.splice(index,1)
}
const submitSearch = () => {
    searchValue.value.forEach((item:any,index:number)=>{
      presentation.value = index === 0 ? item.key + '=' + item.value :presentation.value + ';' + item.key + '=' + item.value
    })
    emit('update:value',searchValue)
    emit('change')
    showTagSearch.value = false
}
</script>
<style lang="less" scoped></style>
