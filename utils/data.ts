import { parse } from 'yaml';
import { readFile } from 'fs-extra';
import path from 'path';

if (!(process.env.DATA_FOLDER || (process.env.DATA_URL && process.env.DATA_TOKEN))) {
  throw new Error('Data provider not configured')
}

export async function readData(key: string): Promise<any> {
  if (process.env.DATA_FOLDER) {
    return parse((await readFile(path.join(process.env.DATA_FOLDER, key + '.yaml'))).toString());
  } else if (process.env.DATA_URL && process.env.DATA_TOKEN) {
    throw new Error('Url+Token data provider not implemented');
  } else {
    throw new Error('Data provider not configured');
  }
}

export function createGSP(requested_keys: string[], transformer: any) {
  return async () => {
    const data = await Promise.all(requested_keys.map(readData));
    const obj = {};
    for (let i = 0; i < requested_keys.length; i++) {
      const key = requested_keys[i].split('/').pop();
      obj[key] = data[i];
    }
    return {
      props: await transformer(obj),
    };
  }
}
