query "crypto/signverify" verb=GET {
  api_group = "foo"

  input {
  }

  stack {
    api.lambda {
      code = """
            const algorithm = 'SHA256';
            const data = 'some data to sign';
        
            // Generate a key pair
            const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem'
                }
            });
        
            // Create a Sign object and sign the data
            const sign = crypto.createSign(algorithm);
            sign.update(data);
            sign.end();
            const signature = sign.sign(privateKey, 'hex');
            console.log('Signature:', signature);
        
            // Create a Verify object and verify the signature
            const verify = crypto.createVerify(algorithm);
            verify.update(data);
            verify.end();
            const isValid = verify.verify(publicKey, signature, 'hex');
            console.log('Signature valid:', isValid);
        
            return isValid
        """
    
      timeout = 10
    } as $x1
  }

  response = $x1

  history = "inherit"
}