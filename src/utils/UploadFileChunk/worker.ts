import {createChunk} from './createChunk';

onmessage = async (e) => {
  const result = [];
  const {start, end, file, fileHash, chunkSize, chunkCount, fileSize, fileName} = e.data;
  
  try {
    // 创建切片
    for (let i = start; i < end; i++) {
      result.push(createChunk(file, i, chunkSize, chunkCount, fileHash, fileSize, fileName));
    }
    
    const chunks = await Promise.all(result);
    
    postMessage(chunks);
  } catch (error) {
    console.error('Worker error:', error);
  }
}
