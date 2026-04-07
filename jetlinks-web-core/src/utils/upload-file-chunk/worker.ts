self.onmessage = async (event) => {
  const result = []
  const { start, end, file, fileHash, chunkSize, chunkCount, fileSize, fileName, fileType } = event.data

  try {
    for (let i = start; i < end; i++) {
      const chunkStart = i * chunkSize
      const chunkEnd = Math.min(chunkStart + chunkSize, fileSize)
      const blob = file.slice(chunkStart, chunkEnd)

      result.push({
        fileSize,
        fileName,
        fileHash,
        fileType,
        chunkHash: `${fileHash}-${i}`,
        chunkIndex: i,
        chunkFile: blob,
        chunkSize: blob.size,
        chunkCount,
        chunkOffset: chunkStart,
      })
    }

    self.postMessage(result)
  } catch (error) {
    console.error('Worker error:', error)
  }
}

export {}
