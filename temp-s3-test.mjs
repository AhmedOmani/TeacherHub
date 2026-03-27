import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';

const envFile = fs.readFileSync('/home/hp/5alo2/teacherhub-pro/.env.local', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  if (line.includes('=')) {
    const [key, ...rest] = line.split('=');
    env[key.trim()] = rest.join('=').trim();
  }
});

async function testS3() {
  console.log("🔍 Checking credentials...");
  console.log("Access Key ending with:", env.VITE_AWS_ACCESS_KEY_ID?.slice(-4));
  
  const s3 = new S3Client({
    region: env.VITE_AWS_REGION,
    credentials: {
      accessKeyId: env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: env.VITE_AWS_SECRET_ACCESS_KEY,
    }
  });

  try {
    console.log(`\n🚀 Testing upload to bucket: ${env.VITE_AWS_BUCKET_NAME} in ${env.VITE_AWS_REGION}`);
    await s3.send(new PutObjectCommand({
      Bucket: env.VITE_AWS_BUCKET_NAME,
      Key: 'test-from-node.txt',
      Body: 'Hello from Node!',
      ContentType: 'text/plain'
    }));
    console.log("✅ SUCCESS: Upload worked from Node.");
    console.log("Since it works here, the keys and IAM permissions are 100% CORRECT.");
    console.log("Your problem is DEFINITELY the CORS configuration on your S3 bucket.");
  } catch (err) {
    console.log("❌ FAILED: Upload rejected by AWS.");
    console.log("Error Name:", err.name);
    console.log("Error Message:", err.message);
    
    if (err.name === 'AccessDenied') {
      console.log("\n💡 DIAGNOSIS: Because it failed in Node, your 'omani' user STILL does not have IAM permissions to upload.");
      console.log("Make sure you EXACTLY copy-pasted the JSON policy and attached it to the 'omani' user.");
    } else if (err.name === 'SignatureDoesNotMatch' || err.name === 'InvalidAccessKeyId') {
      console.log("\n💡 DIAGNOSIS: Your Access Key or Secret Key in .env.local is WRONG or invalid.");
    }
  }
}

testS3();
