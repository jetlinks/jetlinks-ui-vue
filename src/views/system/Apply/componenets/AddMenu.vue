<template>
    <j-modal visible title="新增菜单" :width="800" @cancel="emit('closeAddMenu')">
        <div class="menuContent">
            <div class="menuList">
                <div>菜单列表</div>
                <div class="contentBox">
                    <j-button type="link">+ 新增菜单</j-button>
                </div>
            </div>
            <div class="configuration">
                <div>菜单配置</div>
                <div class="contentBox formBox">
                    <div style="margin-bottom: 20px; text-align: right;">
                        <j-button type="primary">保存</j-button>
                    </div>
                    <j-form>
                        <div class="row" style="display: flex">
                            <j-form-item ref="uploadIcon" name="icon" :rules="[
                                {
                                    required: true,
                                    message: '请上传图标',
                                    trigger: 'change',
                                },
                            ]" style="flex: 0 0 130px">
                                <div class="icon-upload has-icon" v-if="formData.icon">
                                    <AIcon :type="formData.icon" style="font-size: 90px" />
                                    <span class="mark" @click="dialogVisible = true">点击修改</span>
                                </div>
                                <div v-else @click="dialogVisible = true" class="icon-upload no-icon">
                                    <span>
                                        <AIcon type="PlusOutlined" style="font-size: 30px" />
                                        <p>点击选择图标</p>
                                    </span>
                                </div>
                            </j-form-item>
                            <j-row :gutter="24" style="flex: 1 1 auto">
                                <j-col :span="24">
                                    <j-form-item label="名称" name="name" :rules="[
                                        {
                                            required: true,
                                            message: '请输入名称',
                                            trigger: 'change',
                                        },
                                        {
                                            max: 64,
                                            message: '最多可输入64个字符',
                                            trigger: 'change',
                                        },
                                    ]">
                                        <j-input placeholder="请输入名称" v-model:value="formData.name"/>
                                    </j-form-item>
                                </j-col>
                                <j-col :span="24">
                                    <j-form-item label="编码" name="code" :rules="[
                                        {
                                            required: true,
                                            message: '请输入编码',
                                            trigger: 'change',
                                        },
                                        {
                                            max: 64,
                                            message: '最多可输入64个字符',
                                            trigger: 'change',
                                        },
                                        {
                                            // validator: form.checkCode,
                                            trigger: 'blur',
                                        },
                                    ]">
                                        <j-input placeholder="请输入编码" v-model:value="formData.code"/>
                                    </j-form-item>
                                </j-col>
                            </j-row>
                        </div>
                        <j-form-item label="页面地址" name="url" :rules="[
                            {
                                required: true,
                                message: '请输入页面地址',
                            },
                            { max: 128, message: '最多可输入128字符' },
                            { pattern: /^\//, message: '请正确填写地址，以/开头' },
                        ]">
                            <j-input placeholder="请输入页面地址" v-model:value="formData.url"/>
                        </j-form-item>
                    </j-form>
                </div>
            </div>
        </div>
        <!-- 弹窗 -->
        <ChooseIconDialog v-if="dialogVisible" v-model:visible="dialogVisible" :icon="formData.icon"
            @confirm="(typeStr: string) => choseIcon(typeStr)" />
    </j-modal>
</template>

<script lang="ts" setup>
import ChooseIconDialog from '@/views/system/Menu/components/ChooseIconDialog.vue'
const emit = defineEmits(['closeAddMenu'])
const dialogVisible = ref(false)
const formData = ref<any>({
    icon: '',
})
const uploadIcon = ref()
const choseIcon = (typeStr: string) => {
    formData.value.icon = typeStr;
    uploadIcon.value?.clearValidate();
}
</script>
<style lang="less" scoped>
.menuContent {
    display: flex;

    .menuList {
        flex: 2;
        margin-right: 20px
    }

    .configuration {
        flex: 3
    }

    .contentBox {
        height: 400px;
        border: .3px solid rgb(215, 215, 215);
    }
    .formBox{
        padding: 10px;
    }
}

:deep(.ant-form-item-control-input-content) {
    .icon-upload {
        width: 100px;
        height: 90px;
        border: 1px dashed #d9d9d9;
        font-size: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        cursor: pointer;
        transition: 0.5s;

        &:hover {
            border-color: #415ed1;
        }
    }

    .has-icon {
        position: relative;
        text-align: center;

        .mark {
            position: absolute;
            left: 0;
            top: 0;
            display: none;
            background-color: rgba(0, 0, 0, 0.35);
            color: #fff;
            width: 100%;
            height: 100%;
            font-size: 16px;
            align-items: center;
            justify-content: center;
        }

        &:hover .mark {
            display: flex;
        }
    }

    .no-icon {
        background-color: rgba(0, 0, 0, 0.06);
    }
}
</style>