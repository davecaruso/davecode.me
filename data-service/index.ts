require('dotenv').config()
import express from 'express';
import { parse } from 'yaml';
import { readFile } from 'fs-extra';
import path from 'path';

if (!(process.env.DATA_FOLDER && process.env.DATA_SERVICE_TOKEN)) {
  throw new Error('.env file not configured. pass DATA_FOLDER and DATA_SERVICE_TOKEN')
}

const app = express();

app.use(async(req, res) => {
  const token = req.header('Token');

  if (!token) {
    return res.redirect('https://github.com/davecaruso/davecode.me/tree/master/data-service');
  }

  if (token !== process.env.DATA_SERVICE_TOKEN) {
    return res.status(400).send('unauthorized');
  }

  try {
    const parsed = parse((await readFile(path.join(process.env.DATA_FOLDER, req.url.slice(1) + '.yaml'))).toString());
    res.send(parsed);
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404);
      res.send('null');
    } else {
      throw error;
    }
  }
});

const port = process.env.PORT || 8000;
app.listen(port);
console.log('http://localhost:' + port);
