import JSEncrypt from "jsencrypt";

export const encrypt =(txt:string,publicKey:string)=>{
    const encryptor = new JSEncrypt()
    encryptor.setPublicKey(publicKey)
    return encryptor.encrypt(txt)
}