import {createChunk} from './createChunk';

onmessage = async (e) => {
  const result = [];
  const {start, end, file, CHUNK_SIZE, chunkCount, fileSize, fileName} = e.data;
  
  for (let i = start; i < end; i++) {
    result.push(createChunk(file, i, CHUNK_SIZE, chunkCount, fileSize, fileName));
  }
  const chunks = await Promise.all(result);
  
  postMessage(chunks);
}