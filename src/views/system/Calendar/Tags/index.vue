<template>
    <div class="tagsContainer" ref="tags">
        <a-button type="text" @click="addTag"> +新增标签 </a-button>
    </div>
    <EditTag v-if="editVisible"/>
</template>

<script setup name="CalendarTags">
import { Draggable } from '@fullcalendar/interaction';
import EditTag from './components/editTag.vue';
const editVisible = ref(false);
const tags = ref();
const list = ['123', '456'];
const addTag = () =>{
    editVisible.value = true
}
onMounted(() => {
    new Draggable(tags.value, {
        itemSelector: '.tag',
        eventData: function (eventEl) {
            return {
                title: eventEl.innerText,
            };
        },
    });
});
</script>
<style lang="less" scoped>
.tagsContainer {
    width: 20%;
}
</style>
