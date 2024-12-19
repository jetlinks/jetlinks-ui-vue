<template>
    <a-card
        hoverable
        :class="[
            'card-render',
            `access-${data.type || 'network'}`,
            checked === data.id ? 'checked' : '',
            disabled ? 'disabled' : ''
        ]"
        @click="checkedChange(data)"
    >
        <div class="title">
            <Ellipsis style="width: calc(100% - 100px); margin-bottom: 24px">
                {{ data.name }}
            </Ellipsis>
        </div>

        <slot name="other"></slot>
        <div class="desc">
            <a-tooltip placement="topLeft" :title="data.description">{{
                data.description
            }}</a-tooltip>
        </div>
        <div class="checked-icon">
            <div><a-icon type='CheckOutlined' /></div>
        </div>
    </a-card>
</template>

<script lang="ts" setup name="AccessCard">

const emit = defineEmits(['checkedChange']);

const props = defineProps({
    checked: {
        type: String,
        default: undefined,
    },
    data: {
        type: Object,
        default: () => {},
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

const checkedChange = (data:any) => {
  if (!props.disabled) {
    emit('checkedChange', data);
  }
};
</script>

<style lang="less" scoped>
.card-render {
    width: 100%;
    overflow: hidden;
    // background: url('/public/images/access.png') no-repeat;
    // background-size: 100% 100%;
    height: 140px;
    background: #fafafa;
    border: 1px solid #e6e6e6;
    .title {
        font-style: normal;
        font-weight: 800;
        font-size: 16px;
        line-height: 22px;
        color: rgba(0, 0, 0, 0.85);
        opacity: 0.85;
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
        background-color: @primary-color;
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
        color: @primary-color;
        border-color: @primary-color;
        z-index: 0;
        .checked-icon {
            display: block;
        }
    }
  &.disabled {
    cursor: not-allowed;
  }
}
.access-media {
    background: url('/images/access-media.png') no-repeat;
    background-position: bottom right;
}
.access-network, .access-plugin {
    background: url('/images/access-network.png') no-repeat;
    background-position: bottom right;
}
.access-protocol {
    background: url('/images/access-protocol.png') no-repeat;
    background-position: bottom right;
}
</style>
