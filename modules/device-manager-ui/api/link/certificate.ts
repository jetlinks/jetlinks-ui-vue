import { request } from '@jetlinks-web/core'
import {getBaseApi} from "@jetlinks-web-core/utils";

export const NETWORK_CERTIFICATE_UPLOAD = () => `${getBaseApi()}/network/certificate/upload`;

export const save = (data: object) => request.post(`/network/certificate`, data);

export const update = (data: object) => request.patch(`/network/certificate`, data);

export const query = (data: object) => request.post(`/network/certificate/_query`, data);

export const queryDetail = (id: string) => request.get(`/network/certificate/${id}`);

export const remove = (id: string) => request.remove(`/network/certificate/${id}`);

