const fs = require('fs');
const http = require('http');

const react = ['react.development.js', 'react.production.min.js'];
const reactDom = ['react-dom.development.js', 'react-dom.production.min.js'];

const dlToFile = folder => filename => {
  return new Promise(resolve => {
    const fp = fs.createWriteStream(`./vendor/${folder}/${filename}`);
    http.get(
      `http://react.zpao.com/builds/master/latest/${filename}`,
      response => response.pipe(fp)
    );
    fp.on('close', resolve);
  });
};

async function main() {
  await Promise.all([
    ...react.map(dlToFile('react')),
    ...reactDom.map(dlToFile('react-dom')),
  ]);
}

main()
  .then(() => console.log('done'))
  .catch(err => {
    console.error(err);
    process.exit(-1);
  });
