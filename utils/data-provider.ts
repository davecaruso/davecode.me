import { parse } from 'yaml';
import { readFile } from 'fs-extra';
import path from 'path';

export async function readData(key: string): Promise<any> {
  if (process.env.DATA_FOLDER) {
    return parse((await readFile(path.join(process.env.DATA_FOLDER, key))).toString());
  } else if (process.env.DATA_URL && process.env.DATA_TOKEN) {
    throw new Error('Url+Token data provider not implemented');
  } else {
    throw new Error('Data provider not configured');
  }
}

if (!(process.env.DATA_FOLDER || (process.env.DATA_URL && process.env.DATA_TOKEN))) {
  throw new Error('Data provider not configured')
}
