import moment from "moment";
import { LocalStore } from "./comm";
import { TOKEN_KEY } from "./variable";
import {SystemConst} from './consts';

/**
 * 把数据下载成JSON
 * @param record
 * @param fileName
 */
export const downloadObject = (record: Record<string, any>, fileName: string, format?: string) => {
  // 创建隐藏的可下载链接
  const ghostLink = document.createElement('a');
  ghostLink.download = `${fileName ? '' : record?.name}${fileName}_${moment(new Date()).format(
    format || 'YYYY_MM_DD',
  )}.json`;
  ghostLink.style.display = 'none';
  //字符串内容转成Blob地址
  const blob = new Blob([JSON.stringify(record)]);
  ghostLink.href = URL.createObjectURL(blob);
  //触发点击
  document.body.appendChild(ghostLink);
  ghostLink.click();
  //移除
  document.body.removeChild(ghostLink);
};

/**
 * 下载文件
 * @param url 下载链接
 * @param params 参数
 */
 export const downloadFile = (url: string, params?: Record<string, any>) => {
  const formElement = document.createElement('form');
  formElement.style.display = 'display:none;';
  formElement.method = 'GET';
  formElement.action = url;
  // 添加参数
  if (params) {
    Object.keys(params).forEach((key: string) => {
      const inputElement = document.createElement('input');
      inputElement.type = 'hidden';
      inputElement.name = key;
      inputElement.value = params[key];
      formElement.appendChild(inputElement);
    });
  }
  const inputElement = document.createElement('input');
  inputElement.type = 'hidden';
  inputElement.name = ':X_Access_Token';
  inputElement.value = LocalStore.get(TOKEN_KEY);
  formElement.appendChild(inputElement);
  document.body.appendChild(formElement);
  formElement.submit();
  document.body.removeChild(formElement);
};

export const downloadFileByUrl = (url: string, name: string, type: string) => {
  const downNode = document.createElement('a');
  downNode.style.display = 'none';
  downNode.download = `${name}.${type}`;
  downNode.href = url;
  document.body.appendChild(downNode);
  downNode.click();
  document.body.removeChild(downNode);
};

// 是否不是community版本
export const isNoCommunity = !(localStorage.getItem(SystemConst.VERSION_CODE) === 'community');


/**
 * 生成随机数
 * @param length 
 * @returns 
 */
export const randomString = (length?: number) => {
  const tempLength = length || 32;
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  const maxPos = chars.length;
  let pwd = '';
  for (let i = 0; i < tempLength; i += 1) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
};
