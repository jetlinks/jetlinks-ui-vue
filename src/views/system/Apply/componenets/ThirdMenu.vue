<template>
  <j-modal
      class="edit-dialog-container"
      title="集成菜单"
      visible
      width="800px"
      @cancel="cancel"
      @ok="cancel"
  >
  <div style="display: flex;">
    <div class="menuList" >
        菜单列表
      <div class="content">
        <PermissionButton
          type="link"
          :hasPermission="`${permission}:add`"
          @click="addMenu"
        >
            + 新增菜单
        </PermissionButton>
        <div class="treeContainer">
            <j-tree 
              :fieldNames="{
                    title:'name',
                    key:'id',
                    children:'children'
              }"
              :treeData="treeData"
          >
              <template #title="data">
                <div class="tree-item">
                    <div class="title">
                      <j-ellipsis>{{ data.name }}</j-ellipsis>
                    </div>
                    <div class="menuControls">
                        <PermissionButton
                            v-if="data.options?.owner"
                            type="link"
                            :hasPermission="`${permission}:update`"
                            tooltip="编辑"
                            @click="()=>editMenu(data)"
                          >
                          <AIcon type="EditOutlined" />
                        </PermissionButton>
                        <PermissionButton
                          type="link"
                          :hasPermission="`${permission}:add`"
                          :tooltip="{ title: data.level >= 3 ? '仅支持3级菜单' :   '新增子菜单' }"
                          :disabled="data.level >= 3 || data.options?.LowCode"
                          @click="()=>addChildrenMenu(data)"
                        >
                        <AIcon type="PlusCircleOutlined" />
                      </PermissionButton>
                      <PermissionButton
                          v-if="data.options?.owner"
                          type="link"
                          :hasPermission="`${permission}:delete`"
                          tooltip="删除"
                          :popConfirm="{
                            title: `是否删除该菜单`,
                            onConfirm: () => deleteMenu(data),
                          }"
                        >
                        <AIcon type="DeleteOutlined" />
                      </PermissionButton>
                    </div>
                </div>
              </template>
          </j-tree>
        </div>
      </div>
    </div>
    <div class="configuration" v-if="showControls">
      菜单配置
      <div class="content">
        <div class="saveBtn">
          <PermissionButton type="primary" :hasPermission="`${permission}:${ editType === 'add' ? 'add' : 'update'
                }`" :loading='saveLoading' @click="saveMenu">
                保存
          </PermissionButton>
        </div>
        <j-form ref="basicFormRef" :model="formData" class="basic-form" layout="vertical">
                <div class="row" style="display: flex">
                    <j-form-item ref="uploadIcon" label="菜单图标" name="icon" :rules="[
                        {
                            required: true,
                            message: '请上传图标',
                            trigger: 'change',
                        },
                    ]" style="flex: 0 0 186px">
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
                        <j-row>
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
                                  <j-input v-model:value="formData.name" placeholder="请输入名称" />
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
                                      validator: checkCode,
                                      trigger: 'blur',
                                  },
                              ]">
                                  <j-input v-model:value="formData.code" placeholder="请输入编码" />
                              </j-form-item>
                            </j-col>
                       
                           
                       <!-- <j-col :span="12">
                            <j-form-item label="排序" name="sortIndex" :rules="[
                                {
                                    pattern: /^[0-9]*[1-9][0-9]*$/,
                                    message: '请输入大于0的整数',
                                },
                            ]">
                                <j-input-number v-model:value="formData.sortIndex" placeholder="请输入排序"
                                    style="width: 100%" />
                            </j-form-item>
                        </j-col> -->
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
                                <j-input v-model:value="formData.url" placeholder="请输入页面地址" />
                </j-form-item>
                <!-- <j-form-item label="说明" name="describe">
                    <j-textarea v-model:value="formData.describe" :rows="4" show-count :maxlength="200"
                        placeholder="请输入说明" />
                </j-form-item> -->
            </j-form>
      </div>
    </div>
  </div>
  <ChooseIconDialog v-if="dialogVisible" v-model:visible="dialogVisible" :icon="formData.icon"
            @confirm="(typeStr: string) => choseIcon(typeStr)" />
  </j-modal>
</template>

<script name="ThirdMenu" setup lang="ts">
import { getMenuTree_api , validCode_api , addMenuInfo_api ,saveMenuInfo_api , getMenuInfo_api , delMenuInfo_api} from '@/api/system/menu'
import { USER_CENTER_MENU_CODE,messageSubscribe } from '@/utils/consts'
import ChooseIconDialog from '../../Menu/components/ChooseIconDialog.vue'
import { Rule } from 'ant-design-vue/lib/form';
import { onlyMessage } from '@/utils/comm';
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['cancel'])
const permission = 'system/Menu';
const basicFormRef = ref()
const treeData = ref([])
const formData = ref<any>({
  icon:'',
  name:'',
  code:'',
  url:'',
  sortIndex:0
})
const sourceCode = ref()
const dialogVisible = ref(false)
const uploadIcon = ref()
const showControls = ref(false)
const editType = ref()
const saveLoading = ref(false)
const rootMenuTotal = ref<Number>(0)
const queryParams = {
  sorts: [{ name: 'sortIndex', order: 'asc' }],
  paging: false,
  terms: [
                {
                    terms: [
                        {
                            column: 'owner',
                            termType: 'eq',
                            value: 'iot',
                        },
                        {
                            column: 'owner',
                            termType: 'isnull',
                            value: '1',
                            type: 'or',
                        },
                    ],
                },
                {
                terms:[
                    {
                        terms:[
                            {
                                value:"%show\":true%",
                                termType:"like",
                                column:"options",
                                type:'and'
                            },
                            {
                            value:"%owner\"%",
                            termType:"nlike",
                            column:"options",
                            type:"and"
                            }
                        ]
                    },
                    {
                    terms:[
                        {
                            value:`%owner\":\"${props.data.id}%`,
                            termType:"like",
                            column:"options"
                        }
                    ],
                    type:"or"
                }
                ]
            }
            ],
}
const addChildrenMenu = (data:any) =>{
  basicFormRef.value?.clearValidate()
  initFormData()
  showControls.value = true
  editType.value = 'add'
  formData.value.parentId = data?.id
  formData.value.url = data?.url
  formData.value.sortIndex = data?.children?.length + 1|| 0;
}
const addMenu = () =>{
  initFormData()
  formData.value.sortIndex = rootMenuTotal.value
  showControls.value = true
  editType.value = 'add'
}
const editMenu = (data:any) =>{
  basicFormRef.value?.clearValidate()
  initFormData()
  showControls.value = true
  editType.value = 'edit'
  getMenuInfo_api(data.id).then((res:any)=>{
      formData.value = res.result
      sourceCode.value = res.result?.code
  })
}
const deleteMenu = (data:any) =>{
  delMenuInfo_api(data.id).then((resp: any) => {
            if (resp.status === 200) {
                onlyMessage('操作成功');
                queryMenu();
            }
        });
}
const initFormData = () =>{
  formData.value = {
    icon:'',
    name:'',
    code:'',
    url:'',
  }
}
const choseIcon = (typeStr: string) => {
    formData.value.icon = typeStr;
    uploadIcon.value?.clearValidate();
}
const saveMenu = () =>{
  basicFormRef.value.validate().then(()=>{
    const api = editType.value === 'add' ? addMenuInfo_api : saveMenuInfo_api
    saveLoading.value = true
    const params ={
      ...formData.value,
      owner: 'iot',
      options: { show: true ,owner:props.data?.id },
    } 
    api(params).then((res)=>{
      if(res.status === 200){
        onlyMessage('操作成功')
        queryMenu()
      }else{
        onlyMessage('操作失败')
      }
    }).finally(() => (saveLoading.value = false));
  })
}
const checkCode = async (_rule: Rule, value: string): Promise<any> => {
        if (!value) return Promise.reject('');
        else if (value.length > 64) return Promise.reject('最多可输入64个字符');
        // 编辑时不校验原本的编码
        else if (editType.value = 'edit' && value === sourceCode.value)
            return Promise.resolve('');
        else {
            const resp: any = await validCode_api({
                code: value,
                owner: 'iot',
            });
            if (resp.result.passed) return Promise.resolve();
            else return Promise.reject('该编码重复');
        }
}
const cancel = () =>{
  emit('cancel')
}
const queryMenu = () =>{
  getMenuTree_api(queryParams).then((res:any)=>{
    treeData.value = res.result?.filter((item: { code: string }) => ![USER_CENTER_MENU_CODE,messageSubscribe].includes(item.code))
    const lastItem = res.result[res.result.length - 1];
    rootMenuTotal.value = lastItem ? lastItem.sortIndex + 1 : 1;
  })
}
onMounted(()=>{
  queryMenu()
})
</script>

<style  lang="less" scoped>
.menuList{
  width: 35%;
  margin-right: 20px;
}
.configuration{
  width: 60%;
}
.content{
  border: .3px solid rgb(220, 220, 220);
  position: relative;
  .saveBtn{
    position: absolute;
    right: 20px;
    top: 10px;
  }
  .basic-form{
    height: 432px;
    padding: 32px 20px;
    :deep(.ant-form-item-control-input-content) {
                    .icon-upload {
                        width: 160px;
                        height: 150px;
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
  }
  .treeContainer{
    height: 400px;
    overflow-y: auto;
  }
  .tree-item{
    display: flex;
    position: relative;
    align-items: stretch;
    justify-content: space-around;
    .title {
                flex: 1;
                min-width: 80px;
                margin-right: 80px;
            }
    .menuControls {
      position: absolute;
      right: 10px;
      display: none;
      font-size: 14px;
      :deep(.ant-btn-link) {
            padding: 0 4px;
            height: 24px;
          }
      }
  }
}

  :deep(.ant-tree-treenode) {
        width: 100%;
        .ant-tree-node-content-wrapper {
            flex: 1 1 auto;
          }
          .ant-tree-title {
                &:hover {
                    .menuControls{
                        display: block;
                    }
                }
            }
  }
</style>
