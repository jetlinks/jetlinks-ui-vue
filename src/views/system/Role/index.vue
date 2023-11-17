<template>
    <page-container>
         <FullPage>
             <div class="dictionary_contain">
                 <div class="dictionary_left">
                     <Left @select-data="selectData"/>
                 </div>
                 <div class="dictionary_right">
                     <Right :groupId="groupId"/>
                 </div>
             </div>
         </FullPage>
    </page-container>
 </template>
 
 <script lang="ts" setup>
 import Left from './RoleLeft/index.vue'
 import Right from './RoleRight/index.vue'
 const groupId = ref()
 const selectData = (data:any)=>{
    groupId.value = data[0]
 }
 </script>
 <style lang="less" scoped>
 .dictionary_contain{
     display: flex;
     background-color: #fff;
     padding: 24px;
     height: 100%;
 }
 .dictionary_left{
     border-right: 1px solid #f0f0f0;
     padding-right: 24px;
     flex:1;
     height:100%
 }
 .dictionary_right{
     flex:4
 }
 </style>