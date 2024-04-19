import JSEncrypt from "jsencrypt/bin/jsencrypt.min.js";

export const encrypt =(txt:string,publicKey:string)=>{
    const encryptor = new JSEncrypt()
    encryptor.setPublicKey(publicKey)
    return encryptor.encrypt(txt)
}