import { request } from '@jetlinks-web/core';

// //查询标签列表
export const queryTags = () => request.get('/calendar/tags')
