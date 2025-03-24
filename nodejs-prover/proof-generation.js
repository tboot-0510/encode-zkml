const fs = require('fs'); 
const path = require('path');
const ezkl = require('@ezkljs/engine');

const baseEzklPath = path.join(__dirname, '../ezkl');

async function generateProof() {
    console.log('########################################################');
    console.log('#                LOADING REQUIRED FILES                #');
    console.log('########################################################');

    console.time('Loading settings');
    const settingsPath = path.join(baseEzklPath, 'settings.json');
    if (!fs.existsSync(settingsPath)) throw new Error('Setting file not found. You might need to run `ezkl gen-settings` to generate setting from your model')
    const settings = fs.readFileSync(settingsPath);
    console.timeEnd('Loading settings');

    console.time('Loading model');
    const modelPath = path.join(baseEzklPath, 'network.compiled');
    if (!fs.existsSync(modelPath)) throw new Error('Compiled model not found. You might need to run `ezkl compile-circuit` to compile your ONNX model into a circuit')
    const model = fs.readFileSync(modelPath);
    console.timeEnd('Loading model');

    console.time('Loading input');
    const inputPath = path.join(baseEzklPath, 'input.json');
    if (!fs.existsSync(inputPath)) throw new Error('Witness input not found. You might need to run `ezkl gen-witness` to generate your witness for proof generation')
    const input =  fs.readFileSync(inputPath);
    console.timeEnd('Loading input');

    console.time('Loading kzg srs');
    const kzgPath = path.join(baseEzklPath, 'kzg18.srs');
    if (!fs.existsSync(kzgPath)) throw new Error('SRS kzg commitment not found. You might need to download it with `ezkl get-srs` command');
    const kzg =  fs.readFileSync(kzgPath);
    console.timeEnd('Loading kzg srs');

    console.log('\n\n########################################################');
    console.log('#                LOADING PROVER KEY                    #');
    console.log('########################################################');
    const pkPath = path.join(baseEzklPath, 'pk.key');
    if (!fs.existsSync(pkPath)) throw new Error('Prover key not found. You might need to set it up with `ezkl setup` command');
    console.log('Checking memory usage before loading prover key');
    const memoryUsage = process.memoryUsage();
    console.log(`RSS: ${memoryUsage.rss / (1024 * 1024)} MB`);
    console.log(`Heap Total: ${memoryUsage.heapTotal / (1024 * 1024)} MB`);
    console.log(`Heap Used: ${memoryUsage.heapUsed / (1024 * 1024)} MB`);
    console.log(`External: ${memoryUsage.external / (1024 * 1024)} MB`);

    console.log('Loading prover key...');
    console.time('Prover key loaded');
    const pk = await readLargeFile(pkPath);
    console.timeEnd('Prover key loaded');

    console.log('\n\n########################################################');
    console.log('#                  GENERATE PROOF                      #');
    console.log('########################################################');
    
    console.log('Generating witness...');
    console.time('Witness generated');
    const witness = await ezkl.genWitness(model, input);
    console.timeEnd('Witness generated');
    

    console.log('Generating proof...');
    console.time('Proof generated');
    const result = await ezkl.prove(witness, pk, model, kzg);
    console.timeEnd('Proof generated');
}

function readLargeFile(filePath) {
    return new Promise((resolve, reject) => {
        const chunks = []; // This will hold the full file content as a string
  
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

generateProof()