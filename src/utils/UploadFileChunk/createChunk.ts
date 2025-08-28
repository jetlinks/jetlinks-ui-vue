import SparkMD5 from 'spark-md5';

export const createChunk = (file: File, index: number, chunkSize: number, chunkCount: number, fileSize: number, fileName: string) => {
  return new Promise((resolve, reject) => {
    const start = index * chunkSize;
    const end = start + chunkSize;
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();
    const blob = file.slice(start, end); // 文件切片
    
    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result;
      
      // 检查是否为 ArrayBuffer 且非 null
      if (result instanceof ArrayBuffer) {
        spark.append(result);
        
        resolve({
          fileSize, // 文件大小
          fileName, // 文件名称
          index, // 当前切片索引
          hash: spark.end(), // 切片hash
          chunkFile: blob, // 切片文件
          chunkSize: blob.size, // 切片大小
          chunkCount, // 切片数量
        });
      } else {
        // 处理类型错误
        reject(new Error("FileReader result is not ArrayBuffer"));
      }
    };
    
    fileReader.onerror = () => {
      reject(new Error("Failed to read chunk"));
    };
    
    fileReader.readAsArrayBuffer(blob);
  });
};