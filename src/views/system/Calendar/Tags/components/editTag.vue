<template>
    <a-modal visible title="新增标签">
        <a-form :model="tagInfo">
            <a-form-item name="color">
                <input
                    type="color"
                    :value="tagInfo.color"
                    @change="changeColor"
                />
            </a-form-item>
            <a-form-item name="tagName"></a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup name="EditTag">
const tagInfo = reactive({
    color: '',
    tagName:''
});
const changeColor = (event) => {
    console.log(event);
};
</script>
<style lang="less" scoped></style>
