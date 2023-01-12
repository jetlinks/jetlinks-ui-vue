<template>
    <a-card
        hoverable
        :class="['card-render', checked === data.id ? 'checked' : '']"
        @click="checkedChange(data.id)"
    >
        <div class="title">
            <a-tooltip placement="topLeft" :title="data.name">{{
                data.name
            }}</a-tooltip>
        </div>
        <slot name="other"></slot>
        <div class="desc">
            <a-tooltip placement="topLeft" :title="data.description">{{
                data.description
            }}</a-tooltip>
        </div>
        <div class="checked-icon">
            <div><a-icon type="check" /></div>
        </div>
    </a-card>
</template>

<script lang="ts" setup name="AccessCard">


const emit = defineEmits(['checkedChange']);

const props = defineProps({
    checked: {
        type: Array,
        default: () => [],
    },
    data: {
        type: Object,
        default: () => {},
    },
});
console.log(1112,props);

const checkedChange=(id:string)=>{
  emit('checkedChange', id);
}


</script>

<style lang="less" scoped>
.card-render {
    width: 100%;
    overflow: hidden;
    background: url('/public/images/access.png') no-repeat;
    background-size: 100% 100%;
    min-height: 105px;

    .title {
        width: calc(100% - 88px);
        overflow: hidden;
        font-weight: 800;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .desc {
        width: 100%;
        margin-top: 10px;
        color: rgba(0, 0, 0, 0.55);
        font-weight: 400;
        font-size: 13px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .checked-icon {
        position: absolute;
        right: -22px;
        bottom: -22px;
        z-index: 2;
        display: none;
        width: 44px;
        height: 44px;
        color: #fff;
        background-color: red;
        background-color: #2f54eb;
        transform: rotate(-45deg);

        > div {
            position: relative;
            height: 100%;
            transform: rotate(45deg);
            font-size: 12px;
            padding: 4px 0 0 6px;
        }
    }
    &.checked {
        position: relative;
        color: #2f54eb;
        border-color: #2f54eb;

        .checked-icon {
            display: block;
        }
    }
}
</style>
