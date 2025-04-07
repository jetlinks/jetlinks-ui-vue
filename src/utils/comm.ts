import dayjs from "dayjs";
import { downloadFileByUrl, getImage, LocalStore } from "@jetlinks-web/utils";
import { getFileUrlById } from "@/api/comm";
import { message } from "ant-design-vue";

const modules = import.meta.glob("../modules/*/index.ts", { eager: true });

export const downloadJson = (
  record: Record<string, any>,
  fileName: string,
  format?: string,
) => {
  const _time = dayjs(new Date()).format(format || "YYYY_MM_DD");
  const _download = `${fileName || record?.name}-${_time}`;
  //字符串内容转成Blob地址
  const blob = new Blob([JSON.stringify(record)]);
  const _url = URL.createObjectURL(blob);
  downloadFileByUrl(_url, _download, "json");
};

/**
 * 修改Select参数column的值
 * @param e // 查询参数 e
 * @param column {Object} {需要修改的值: 修改后的值}
 * {
        username: 'context.username',
    }
 */
export const modifySearchColumnValue = (e: any, column: object) => {
  e.terms.forEach((item: any) => {
    item.terms.forEach((t: any) => {
      if (column[t.column]) {
        t.column = column[t.column];
      }
    });
  });
  return e;
};

/**
 * 为了区分是本地的图片还是线上的图片
 * @param id
 */
export const getImageUrl = (id: string) => {
  if (id.includes("localhost")) {
    return getImage(id.replace("localhost", ""));
  }
  return getFileUrlById(id);
};

export const getAppId = () => {
  return LocalStore.get("app_id");
};

export const setAppId = (id: string) => {
  LocalStore.set("app_id", id);
};

/**
 * Select过滤
 * @param value 过滤值
 * @param option
 * @param key
 */
export const filterSelectNode = (
  value: string,
  option: any,
  key: string = "label",
): boolean => {
  return option[key]?.includes(value);
};

/**
 * 仅提示一次的message
 * @param msg 消息内容
 * @param type 消息类型
 */
export const onlyMessage = (
  msg: string,
  type: "success" | "error" | "warning" = "success",
  extra?: any,
) => {
  message[type]({
    content: msg,
    key: type,
    ...extra,
  });
};

export const accessConfigTypeFilter = (data: any[]): any[] => {
  if (!data) return [];
  return data.map((item) => ({ ...item, label: item.name, value: item.id }));
};

export const isFullScreen = () => {
  return !!(
    document.fullscreen ||
    document.mozFullScreen ||
    document.webkitIsFullScreen ||
    document.webkitFullScreen ||
    document.msFullScreen
  );
};

export const getModulesComponents = (name: string) => {
  const components: any = {};
  Object.values(modules).forEach((item) => {
    const c = (item as any).default.getComponents?.();
    if (c) {
      Object.keys(c).forEach((key: string) => {
        if (components[key]) {
          components[key].push(...c[key]);
        } else {
          components[key] = c[key];
        }
      });
    }
  });

  return components[name];
};

export function isZhCN(name: string): boolean {
  return /-cn\/?$/.test(name);
}

export function getLocalizedPathname(
  path: string,
  zhCN?: boolean,
  query = {},
  hash?: {
    zhCN: string;
    enUS: string;
  },
): {
  path: string;
  query: Record<string, any>;
} {
  const pathname = path.startsWith("/") ? path : `/${path}`;
  let fullPath;
  if (!zhCN) {
    // to enUS
    fullPath = /\/?index-cn/.test(pathname) ? "/" : pathname.replace("-cn", "");
  } else if (pathname === "/") {
    fullPath = "/index-cn";
  } else if (pathname.endsWith("/")) {
    fullPath = pathname.replace(/\/$/, "-cn/");
  } else {
    fullPath = `${pathname}-cn`;
  }

  if (hash) {
    const localHash = hash[zhCN ? "zhCN" : "enUS"];
    fullPath += `#${localHash}`;
  }
  return { path: fullPath, query };
}
