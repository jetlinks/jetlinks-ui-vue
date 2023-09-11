import server from '@/utils/request';

// 获取用户类型
export const getUserType_api = () => server.get(`/user/detail/types`);

// 获取用户列表
export const getUserList_api = (data: object) => server.post(`/user/detail/_query`, data);

// 校验字段合法性
export const validateField_api = (type: 'username' | 'password', name: string) => server.post(`/user/${type}/_validate`, name,{}, {
    headers: {
        'Content-Type': 'text/plain'
    }
})

// 获取角色列表
export const getRoleList_api = () => server.get(`/role/_query/no-paging?paging=false`);

//获取角色列表
export const getRoleList = () => server.post('/role/group/detail/_query/tree')
// 获取组织列表
export const getDepartmentList_api = () => server.get(`/organization/_all/tree?paging=false`);

// 获取用户信息
export const getUser_api = (id: string) => server.get(`/user/detail/${id}`);
// 添加用户
export const addUser_api = (data: object) => server.post(`/user/detail/_create`, data);
// 更新用户
export const updateUser_api = (data: any) => server.put(`/user/detail/${data.id}/_update`, data);
// 更新密码
export const updatePassword_api = (data: { id: string, password: string }) => server.post(`/user/${data.id}/password/_reset`, data.password,{}, {
    headers: {
        'Content-Type': 'text/plain'
    }
});
// 修改用户状态
export const changeUserStatus_api = (data: object) => server.patch(`/user`,data);
// 删除用户
export const deleteUser_api = (id: string) => server.remove(`/user/${id}`);