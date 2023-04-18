export type FileUploadResult = {
  id: string
  name: string
  description: string
  version: string
  type: {
    text: string
    value: string
  }
  accessUrl: string
  filename: string
  extension: string
  length: string
  md5: string
  sha256: string
}