<template>
	<div class="left-contain">
		<a-input v-model:value="searchValue" :placeholder="$t('RoleLeft.index.507330-0')" @change="searchChange" @pressEnter="search">
			<template #suffix>
				<AIcon type="SearchOutlined" @click="search"/>
			</template>
		</a-input>
		<div v-if="isAdmin" class="controls">
			<a-button style="width: 100%" type="primary" @click="addGroup">
				{{ $t('RoleLeft.index.507330-1') }}
			</a-button>
		</div>
		<div class="listBox">
			<a-tree v-if="listData.length" :default-expanded-keys="['global_role']"
							:fieldNames="{ title: 'name', key: 'id', children: 'children' }"
							:selectedKeys="selectedKeys" :showLine="{ showLeafIcon: false }" :tree-data="listData"
							blockNode>
				<template #title="item">
					<div v-if="selectId === item.data.id">
						<a-input ref="inputRef" v-model:value="addName" :maxlength="64"
										 @blur="() => saveGroup(item.data)"></a-input>
					</div>
					<div v-else class="treeItem" @click="() => selectGroup(item.data.id)">
						<template v-if="!item?.children">
							<div class="itemText">
								<j-ellipsis style="width: calc(100%-100px)">{{ item.i18nName || item.name }}</j-ellipsis>
							</div>
							<div v-if="item.id !== 'default_group' && isAdmin" @click="(e) => e.stopPropagation()">
								<j-permission-button :disabled="item.id === 'default_group'" :popConfirm="{
                                    title: $t('RoleLeft.index.507330-2'),
                                    onConfirm: () => deleteGroup(item.id),
                                }" hasPermission="system/Role:groupDelete" type="text">
									{{ $t('RoleLeft.index.507330-3') }}
								</j-permission-button>
								<j-permission-button :disabled="item.id === 'default_group'" hasPermission="system/Role:groupUpdate"
																		 type="text" @click="editGroup(item.data)">
									{{ $t('RoleLeft.index.507330-4') }}
								</j-permission-button>
							</div>
						</template>
						<template v-else>
							<j-ellipsis style="width: calc(100%-100px)">{{ item.name }}</j-ellipsis>
						</template>
					</div>
				</template>
			</a-tree>
			<j-empty v-else style="margin-top: 100px;"/>
		</div>
	</div>
</template>

<script lang="ts" name="RoleLeft" setup>
import { onlyMessage, randomString } from '@jetlinks-web/utils';
import { queryRoleGroup, saveRoleGroup, deleteRoleGroup } from '@/api/system/role';
import { useUserStore } from '@/store/user'
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const emit = defineEmits(['selectData'])
const { isAdmin } = useUserStore();
const listData: any = ref([{
	name: $t('RoleLeft.index.507330-5'),
	id: 'global_role',
	children: []
}])
const selectedKeys = ref<string[]>(['global_role'])
const searchValue = ref()
const inputRef = ref()
const addName = ref()
const selectId = ref()
const queryGroup = async (select?: Boolean, searchName?: string) => {
	const params = searchName ? {
		sorts: [{ name: 'createTime', order: 'desc' }],
		terms: [{ terms: [{ value: '%' + searchName + '%', termType: 'like', column: 'name' }] }]
	} : { sorts: [{ name: 'createTime', order: 'desc' }] }
	const req: any = await queryRoleGroup(params)
	if (req.status === 200) {
		listData.value[0].children = req.result
		if (req.result[req.result.length - 1].id === 'default_group') {
			req.result.unshift(req.result[req.result.length - 1])
			req.result.pop()
		}
		// if(req.result.length && select){
		//     selectGroup(req.result[0].id)
		// }
	}
}
const addGroup = () => {
	addName.value = ''
	const newId = randomString()
	listData.value[0].children.splice(1, 0, ({
		name: '',
		id: newId
	}))
	selectId.value = newId
	nextTick(() => {
		inputRef.value.focus()
	})
}
const saveGroup = async (data: any) => {
	if (addName.value === '') {
		listData.value[0].children.splice(1, 1)
	} else {
		const saveData = {
			name: addName.value,
			id: data.id
		}
		const res = await saveRoleGroup(saveData)
		if (res.status === 200) {
			onlyMessage($t('RoleLeft.index.507330-6'))
			queryGroup()
		} else {
			onlyMessage($t('RoleLeft.index.507330-7'))
		}
	}
	setTimeout(() => {
		selectId.value = ''
	}, 300)
}
const search = () => {
	queryGroup(true, searchValue.value)
}
const searchChange = () => {
	if (searchValue.value === '') {
		queryGroup()
	}
}
const selectGroup = (id: string) => {
	selectedKeys.value = [id]
	id === 'global_role' ? emit('selectData', '') : emit('selectData', selectedKeys.value)
}
const deleteGroup = async (id: string) => {
	const res: any = await deleteRoleGroup(id)
	if (res.status === 200) {
		onlyMessage($t('RoleLeft.index.507330-6'))
		queryGroup(true)
	} else {
		onlyMessage($t('RoleLeft.index.507330-7'))
	}
}
const editGroup = (data: any) => {
	if (!selectId.value) {
		selectId.value = data.id
		addName.value = data.name
		listData.value[0].children.forEach((item: any) => {
			if (item.id === data.id) {
				item.edit = true
			}
		})
		nextTick(() => {
			inputRef.value.focus()
		})
	}

}
onMounted(() => {
	queryGroup(true)
})
</script>
<style lang="less" scoped>
.left-contain {
	height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.treeItem {
	display: flex;
	justify-content: space-between;

	.itemText {
		line-height: 32px;
		max-width: 40%
	}
}

.listBox {
	flex: 1 auto;
	overflow-y: auto;
}
</style>
