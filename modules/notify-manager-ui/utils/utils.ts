import dayjs from "dayjs";
/**
 * 把数据下载成JSON
 * @param record
 * @param fileName
 */
export const downloadObject = (record: Record<string, any>, fileName: string, format?: string) => {
    // 创建隐藏的可下载链接
    const ghostLink = document.createElement('a');
    ghostLink.download = `${fileName ? '' : record?.name}${fileName}-${dayjs(new Date()).format(
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