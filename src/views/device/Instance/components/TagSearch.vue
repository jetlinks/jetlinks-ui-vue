<template>
    <j-input @click="show" v-model:value="presentation"> </j-input>
    <j-modal v-if="showTagSearch" title="筛选条件" visible @cancel="showTagSearch = false" @ok="submitSearch">
        <j-form layout="vertical">
            <j-form-item label="设备标签:">
                <j-row :gutter="16" v-for="(i,index) in searchValue" style="margin-bottom: 10px;">
                    <j-col :span="10">
                        <j-input placeholder="请输入标签key" v-model="i.key"></j-input>
                    </j-col>
                    <j-col :span="10">
                        <j-input placeholder="请输入标签value" v-model="i.value"></j-input>
                    </j-col>
                    <j-col :span="4">
                        <j-button type="link">
                            <template #icon><AIcon type="MinusCircleOutlined" @click="deletePair(index)"/></template>
                        </j-button>
                    </j-col>
                </j-row>
            </j-form-item>
            <j-button type="link" @click="addPair">
              添加
            </j-button>
        </j-form>
    </j-modal>
</template>

<script lang="ts" setup>
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
      presentation.value = index !== 0 ? item.key + '=' + item.value :presentation.value + ';' + item.key + '=' + item.value
    })
    console.log( presentation.value)
    showTagSearch.value = false
}
</script>
<style lang="less" scoped></style>
