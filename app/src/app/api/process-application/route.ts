/* eslint-disable */
import { NextResponse } from "next/server";
import fs from 'fs'; 
import path from 'path';
import ezkl from '@ezkljs/engine';

const baseEzklPath = path.join(__dirname, '../../../ezkl');

async function generateProof() {
    console.log('########################################################');
    console.log('#                LOADING REQUIRED FILES                #');
    console.log('########################################################');

    const settingsPath = path.join(baseEzklPath, 'settings.json');
    console.log(`Loading settings at path: ${settingsPath}`);
    console.time('Loading settings');
    if (!fs.existsSync(settingsPath)) throw new Error('Setting file not found. You might need to run `ezkl gen-settings` to generate setting from your model')
    const settings = fs.readFileSync(settingsPath);
    console.timeEnd('Loading settings');

    const modelPath = path.join(baseEzklPath, 'network.compiled');
    console.log(`Loading model at path: ${modelPath}`);
    console.time('Loading model');
    if (!fs.existsSync(modelPath)) throw new Error('Compiled model not found. You might need to run `ezkl compile-circuit` to compile your ONNX model into a circuit')
    const model = fs.readFileSync(modelPath);
    console.timeEnd('Loading model');

    // @todo read input from function param
    const inputPath = path.join(baseEzklPath, 'input.json');
    console.log(`Loading input at path: ${inputPath}`);
    console.time('Loading input');
    if (!fs.existsSync(inputPath)) throw new Error('Witness input not found. You might need to run `ezkl gen-witness` to generate your witness for proof generation')
    const input =  fs.readFileSync(inputPath);
    console.timeEnd('Loading input');

    const kzgPath = path.join(baseEzklPath, 'kzg14.srs');
    console.log(`Loading kzg srs at path: ${kzgPath}`);
    console.time('Loading kzg srs');
    if (!fs.existsSync(kzgPath)) throw new Error('SRS kzg commitment not found. You might need to download it with `ezkl get-srs` command');
    const kzg =  fs.readFileSync(kzgPath);
    console.timeEnd('Loading kzg srs');

    console.log('\n\n########################################################');
    console.log('#                LOADING PROVER KEY                    #');
    console.log('########################################################');
    const pkPath = path.join(baseEzklPath, 'pk.key');
    console.log(`Loading prover key at path: ${pkPath}`);
    if (!fs.existsSync(pkPath)) throw new Error('Prover key not found. You might need to set it up with `ezkl setup` command');
    console.log('Checking memory usage before loading prover key');
    const memoryUsage = process.memoryUsage();
    console.log(`RSS: ${memoryUsage.rss / (1024 * 1024)} MB`);
    console.log(`Heap Total: ${memoryUsage.heapTotal / (1024 * 1024)} MB`);
    console.log(`Heap Used: ${memoryUsage.heapUsed / (1024 * 1024)} MB`);
    console.log(`External: ${memoryUsage.external / (1024 * 1024)} MB`);

    
    console.time('Prover key loaded');
    const pk = await readLargeFile(pkPath);
    console.timeEnd('Prover key loaded');

    console.log('\n\n########################################################');
    console.log('#                  GENERATE PROOF                      #');
    console.log('########################################################');
    
    console.log('Generating witness...');
    console.time('Witness generated');
    const witness = await ezkl.genWitness(model as any, input as any);
    console.timeEnd('Witness generated');
    

    console.log('Generating proof...');
    console.time('Proof generated');
    const proof = await ezkl.prove(witness as any, pk as any, model as any, kzg as any);
    console.timeEnd('Proof generated');


    console.log('\n\n########################################################');
    console.log('#                  VERIFYING PROOF                     #');
    console.log('########################################################');
  
    const vkPath = path.join(baseEzklPath, 'vk.key');
    console.log(`Loading verifier key at path: ${vkPath}`);
    console.time('Verifier key loaded');
    const vk = await readLargeFile(vkPath);
    console.timeEnd('Verifier key loaded');

    console.log('Verifying proof...');
    console.time('Proof verified');
    await ezkl.verify(proof as any, vk as any, settings as any, kzg as any);
    console.timeEnd('Proof verified');
    return proof;
}

function readLargeFile(filePath: string) {
    return new Promise((resolve, reject) => {
        const chunks:any[] = []; // This will hold the full file content as a string
  
      const readStream = fs.createReadStream(filePath, {highWaterMark: 1024 * 1024 }); // 1MB chunks
  
      readStream.on('data', (chunk) => {
        chunks.push(chunk); // Append each chunk to the `data` variable
      });
  
      readStream.on('end', () => {
        const data = Buffer.concat(chunks);
        resolve(data); // Resolve the promise with the full file content
      });
  
      readStream.on('error', (err) => {
        reject(err); // Reject the promise if an error occurs
      });
    });
  }



export async function POST(request:any) {
  try {
    const data = await request.json();

    console.log("data", data);

    // @todo normalize input and pass it to the generate proof
    
    // @todo execute ML model to predict outcome
    
    // @todo expose input as a function parameter
    const proof = generateProof();

    return NextResponse.json({ success: true, proof });
  } catch (error:any) {
    console.error("Email sending failed:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
