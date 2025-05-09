import { createPinia } from 'pinia';

export * from './auth'
export * from './user'
export * from './menu'
export * from './system'
export * from './application'

const pinia = createPinia();

export default pinia;
