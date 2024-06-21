import {getImage} from "@/utils/comm";

export const defaultImg = getImage('/apply/internal-standalone.png');
export const iconMap = new Map();
iconMap.set('dingtalk-ent-app', getImage('/bind/dingtalk.png'));
iconMap.set('wechat-webapp', getImage('/bind/wechat-webapp.png'));
iconMap.set('internal-standalone', getImage('/apply/internal-standalone.png'));
iconMap.set('third-party', getImage('/apply/third-party.png'));
iconMap.set('wechat-miniapp', getImage('/apply/wechat-miniapp.png'));
