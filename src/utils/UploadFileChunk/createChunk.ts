export const createChunk = (file: File, index: number, chunkSize: number, chunkCount: number, fileHash: string, fileSize: number, fileName: string) => {
  return new Promise((resolve, reject) => {
    const start = index * chunkSize;
    const end = Math.min(start + chunkSize, fileSize);
    
    const blob = file.slice(start, end); // 文件切片
    
    resolve({
      fileSize, // 文件大小
      fileName, // 文件名称
      fileHash, // 文件hash
      chunkHash: `${fileHash}-${index}`, // 切片hash (fileHash + index)
      chunkIndex: index, // 当前切片索引
      chunkFile: blob, // 切片文件
      chunkSize: blob.size, // 切片实际大小
      chunkCount, // 切片总数量
    });
  });
};