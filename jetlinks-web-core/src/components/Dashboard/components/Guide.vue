<template>
 <div class="home-title">
     <div v-if="title">{{ title }}</div>
     <div v-else>
         <slot name="title"></slot>
     </div>
     <div class="extra-text">
         <slot name="extra"></slot>
     </div>
     <div class="home-title-english">{{ english }}</div>
 </div>
</template>

<script setup lang="ts" name="Guide">
interface guideProps {
 title?: string;
 english?: string;
}

const props = defineProps<guideProps>();
</script>

<style scoped lang="less">
.home-title {
 position: relative;
 z-index: 2;
 display: flex;
 justify-content: space-between;
 margin-bottom: 12px;
 padding-left: 18px;
 font-weight: 700;
 font-size: 18px;

 &::after {
     position: absolute;
     top: 50%;
     left: 0;
     width: 8px;
     height: 8px;
     background-color: @primary-color;
     border: 1px solid #b4c0da;
     transform: translateY(-50%);
     content: ' ';
 }

 .extra-text {
     font-size: 14px;
     font-weight: 400;
 }

 .home-title-english {
     position: absolute;
     top: 30px;
     color: rgba(0, 0, 0, 0.3);
     font-size: 12px;
 }
}
</style>
