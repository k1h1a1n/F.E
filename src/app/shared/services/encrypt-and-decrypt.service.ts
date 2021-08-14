import { Injectable } from '@angular/core';
// import { AES_GCM } from 'asmcrypto.js';
// import { string_to_bytes, hex_to_bytes, base64_to_bytes, bytes_to_string, bytes_to_hex, bytes_to_base64 } from 'src/app/shared/services/encryptionUtils.js';
import { environment } from 'src/environments/environment';
import { AES256 } from '@ionic-native/aes-256/ngx';
// import { cryptLib } from '@skavinvarnan/cryptlib';
// import node-forge from 'node-forge';
import * as  forge from 'node-forge';
import { async } from '@angular/core/testing';
// import { from } from 'rxjs';

// var forge = require('node-forge'); 
// const cryptLib = require('@skavinvarnan/cryptlib');
declare var JSEncrypt: any;
declare var window: any;

@Injectable({
  providedIn: 'root'
})
export class EncryptAndDecryptService {

  constructor(
    // private aes_gcm: AES_GCM,
    // private string_to_bytes: string_to_bytes,
    private aes256: AES256
  ) { }

  async getRandomKey(length: number) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    let key: String;
    for (var i = length; i > 0; --i) { result += chars[Math.floor(Math.random() * chars.length)]; }
    await this.aes256.generateSecureKey(result).then((res) => key = res);
    return key;
  }

  async getIV(): Promise<any> {
    return await this.generateIv();//this.aes256.generateSecureIV('random password 12345');
  }

  async generateSecureKeyAndIV(encryptionKey: string) {
    var secureIV = environment.encryption_iv;
    var secureKey = await this.aes256.generateSecureKey(encryptionKey);
    return [secureIV,secureKey];
  }

  // generating passwordHash
  private generateHash(encryptionKey: any): any {
    return hash.sha256().update(encryptionKey).digest('hex');
  }


  async encrypt(data) {
    var randomKey;
    var randomIv;
    await this.getRandomKey(16).then((res) => randomKey = res);
    await this.getIV().then((res) => randomIv = res);
    var returnData = this.encryptWithKeyPassed(data, randomKey, randomIv);
    return [returnData[0], randomKey, randomIv]
  }


   encryptWithKeyPassed(data, key, Iv) {
    var encryptedData ;
    
    let cipher = forge.cipher.createCipher('AES-GCM', key);
    cipher.start({iv:Iv,tagLength:128});
    cipher.update(forge.util.createBuffer(data));
    cipher.finish();
    var tag = cipher.mode.tag;
    var tagAsHex = tag.toHex().toString();
    //todo remove
   // Iv = Iv + ":tag:" +tagAsHex;
    encryptedData = forge.util.encode64(cipher.output.getBytes());
    return [encryptedData,tagAsHex];
  }


 async encryptNoKeysPassed(data) {
  let randomKey ;
  let randomIv ;
  await this.getRandomKey(16).then((res) => randomKey = res);
  await this.getIV().then((res) => randomIv = res);
  let res = this.encryptWithKeyPassed(data,randomKey,randomIv);
    
  return [res[0],res[1],randomKey,randomIv]

  }

  async encryptEncKeyPassed(data,key) {

    let randomIv = forge.util.encode64(forge.random.getBytesSync(16));
    var derivedKey = forge.util.encode64(forge.pkcs5.pbkdf2(key, randomIv, 100000, 16));

    let res = this.encryptWithKeyPassed(data,key,randomIv);
    
      
    return [res[0],res[1],randomIv,derivedKey]
  
    }

   decrypt(encryptedData, Key, Iv, Tag, encryptedDataInBinary) {
    var decryptedData,tagAsHex;
    // var splitIV = Iv.split(":tag:");
    // Iv = splitIV[0];
    //tagAsHex = Tag;
    var tagBytes1 = forge.util.hexToBytes(Tag);
    var tagBytes =  new forge.util.ByteStringBuffer(tagBytes1);
   
    let decipher = forge.cipher.createDecipher('AES-GCM', Key);
    
    decipher.start({iv: Iv,tag:tagBytes });
    
    if(encryptedDataInBinary) {
      decipher.update(forge.util.createBuffer(encryptedData));
   }
   else {decipher.update(forge.util.createBuffer(forge.util.decode64(encryptedData)));}
    
    decipher.finish();
    decryptedData = decipher.output.toString();
    //  decryptedData = ""; //cryptLib.decryptCipherTextWithRandomIV(encryptedData,Key)  //bytes_to_string(decryptedData)
    return decryptedData;
  }

  decryptKey(keyToBeDec,key,iv,tag){

  }



  // userPlusDurityEncryption(data, key) {
  //   var returnData1 = this.encryptWithKeyPassed(data, key, environment.encryption_iv);
  //   var encryptedDataWithUserKey = returnData1[0];
  //   var ivForUserEncryption = returnData1[1];
  //   var returnData2 = this.DurityEncryption(data);
  //   var encryptedDataWithDurityKey = returnData2[0];
  //   var ivForDurityEncryption = returnData2[1];
  //   var keyForDurityEncryption = returnData2[2];
  //   return [encryptedDataWithDurityKey, ivForUserEncryption, ivForDurityEncryption, keyForDurityEncryption];
  // }
  async userPlusDurityEncryption (data, userkey, userIv, typeOfUserEnc){
    var durityKey ;
    var durityIv ;
    await this.getRandomKey(16).then((res) => durityKey = res);
    await this.getIV().then((res) => durityIv = res);
      if(typeOfUserEnc === 'userPassphrase'){
         return this.encUsingUserPassphrase(data,userkey, userIv, durityKey, durityIv);
      }
     return 'empty';
        
     
    }

   encUsingUserPassphrase(data, userKey, userIv, durityKey, durityIv){
    // const salt=   generateSalt();
  //  let ivToEncUserKeyNUserIv = forge.pkcs5.pbkdf2(userPassphrase, forge.util.decode64(salt), 4, 16);
    var returnData1 = this.encryptWithKeyPassed(data, userKey, userIv);
    var encryptedDataWithUserKey = returnData1[0];
    userIv = returnData1[1];
    var returnData2 = this.DurityEncryption(encryptedDataWithUserKey,durityKey,durityIv);
    var encryptedDataWithDurityKey = returnData2[0];
    durityIv = returnData2[1];
   // const encryptedKeysNIVtoSave = encryptRndKeyAndIV(durityKey,durityIv)
 return {encryptedData:encryptedDataWithDurityKey,
  keys:{
    userKey:userKey,
    durityKey:durityKey
  },
    Ivs:{
      userIv:userIv,
      durityIv:durityIv
    },
    // userSalt: salt
  }
  }

    DurityEncryption(data,durityKey,durityIv) {
    var returnData = this.encryptWithKeyPassed(data,durityKey,durityIv);
    var encryptedDataWithDurityKey = returnData[0];
    var ivForDurityEncryption = returnData[1];

    return [encryptedDataWithDurityKey, ivForDurityEncryption];

  }
  


  encryptRndKeyAndIV(rndKeyForFileEnc, ivForFileEnc) {
    let doubleEncrypt = new JSEncrypt();
    let doubleDecrypt = new JSEncrypt();
    let keyEncWithSupervisorPubKey;
    let supervisorEncIv;
    let keyEncWithAgentPubKey;
    let agentEncIv;
    const hybridAsymmetricDecrypt = new JSEncrypt();
    const hybridAsymmetricEnc = new JSEncrypt();
    console.log(rndKeyForFileEnc);
    //encrypting with agent key
    //this.hybridAsymmetricEnc.setPublicKey(environment.publicKeySupervisor);
    hybridAsymmetricEnc.setPublicKey(environment.publicKeySupervisor);
    keyEncWithSupervisorPubKey = hybridAsymmetricEnc.encrypt(
      rndKeyForFileEnc
    );
    supervisorEncIv = hybridAsymmetricEnc.encrypt(ivForFileEnc);
    //Encrypting with supervisor key
    //doubleEncrypt.setPublicKey(environment.publicKeyAgent);
    doubleEncrypt.setPublicKey(environment.publicKeyAgent);
    // doubleDecrypt.setPrivateKey(environment.privateKeySupervisor);
    keyEncWithAgentPubKey = doubleEncrypt.encrypt(keyEncWithSupervisorPubKey);
    agentEncIv = doubleEncrypt.encrypt(supervisorEncIv);
    
    return [keyEncWithAgentPubKey, agentEncIv];
  }
  // encryptRndKeyAndIV(rndKeyForFileEnc, ivForFileEnc) {
  //   let doubleEncrypt = new JSEncrypt();
  //   let doubleDecrypt = new JSEncrypt();
  //   let keyEncWithSupervisorPubKey;
  //   let supervisorEncIv;
  //   let keyEncWithAgentPubKey;
  //   let agentEncIv;
  //   const hybridAsymmetricDecrypt = new JSEncrypt();
  //   const hybridAsymmetricEnc = new JSEncrypt();
  //   //encrypting with agent key
  //   //this.hybridAsymmetricEnc.setPublicKey(environment.publicKeySupervisor);
  //   hybridAsymmetricEnc.setPublicKey(environment.publicKeyAgent);
  //   keyEncWithSupervisorPubKey = hybridAsymmetricEnc.encrypt(
  //     rndKeyForFileEnc
  //   );
  //   console.log("supervisorEncKey : ",keyEncWithSupervisorPubKey)
  //   supervisorEncIv = hybridAsymmetricEnc.encrypt(ivForFileEnc);
  //   //Encrypting with supervisor key
  //   //doubleEncrypt.setPublicKey(environment.publicKeyAgent);
  //   // doubleEncrypt.setPublicKey(environment.publicKeyAgent);
  //   doubleDecrypt.setPrivateKey(environment.privateAgent);
  //   const temp = doubleDecrypt.decrypt(keyEncWithSupervisorPubKey);
  //   console.log(temp);
  //   // keyEncWithAgentPubKey = doubleEncrypt.encrypt(keyEncWithSupervisorPubKey);
  //   // agentEncIv = doubleEncrypt.encrypt(supervisorEncIv);
  //   return [keyEncWithAgentPubKey, agentEncIv];
  // }

  biometricEncrypt(rndKey) {
    // let biometricEncKey;
    window.cordova.plugins.CustomBiometricPlugin.encrypt(rndKey, "mdurity",
      (res) => {
        console.log(res);
       // biometricEncKey = res;
       return res;
      })
    //   ,
    //   (err) => { return err}
    // );
    //return biometricEncKey;
  }


  public generateSalt() {
    return forge.util.encode64(forge.random.getBytesSync(128));
}

public generateIv() {
    return forge.util.encode64(forge.random.getBytesSync(16));
}

 /**
   * encrypt function we are expecting a string to be encrypted, a password to encrypt with which in our case will be the master password, a random salt and a random initialization vector. When the encryption process completes we will be returned a ciphertext string.
   *
   * @param {string} message
   * @param {string} masterPassword
   * @param {*} salt
   * @param {*} iv
   * @returns
   * @memberof ForgeProvider
   */
  public encryptForge(message: string, masterPassword: string, salt: any, iv: any) {
    let key = forge.pkcs5.pbkdf2(masterPassword, forge.util.decode64(salt), 4, 16);
    let cipher = forge.cipher.createCipher('AES-GCM', key);
    cipher.start({iv: forge.util.decode64(iv)});
    cipher.update(forge.util.createBuffer(message));
    cipher.finish();
    return forge.util.encode64(cipher.output.getBytes());
}


/**
 * decrypt function will take pretty much the same information, but instead of a plaintext message we’ll pass the ciphertext. Plaintext will be returned after a successful decryption.
 * @param {string} cipherText
 * @param {string} masterPassword
 * @param {string} salt
 * @param {string} iv
 * @returns
 * @memberof ForgeProvider
 */
public decryptForge(cipherText: string, masterPassword: string, salt: string, iv: string) {
    let key = forge.pkcs5.pbkdf2(masterPassword, forge.util.decode64(salt), 4, 16);
    let decipher = forge.cipher.createDecipher('AES-GCM', key);
    decipher.start({iv: forge.util.decode64(iv)});
    decipher.update(forge.util.createBuffer(forge.util.decode64(cipherText)));
    decipher.finish();
    return decipher.output.toString();
}




}
