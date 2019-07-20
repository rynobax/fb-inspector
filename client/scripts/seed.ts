import key from 'ky';
import { testBig as db } from './creds';

function params(obj: { [k: string]: string | boolean }) {
  let str = '';
  const keys = Object.keys(obj);
  if (keys.length === 0) return str;
  str += '?';
  str += keys
    .filter(k => obj[k] !== '')
    .map(k => `${k}=${obj[k]}`)
    .join('&');
  return str;
}

async function set(path: string, data: any) {
  await key.put(
    `https://${db.path}.firebaseio.com/${path}.json${params({
      auth: db.token,
    })}`,
    { body: JSON.stringify(data) }
  );
}

async function push(path: string, data: any) {
  await key.post(
    `https://${db.path}.firebaseio.com/${path}.json${params({
      auth: db.token,
    })}`,
    { body: JSON.stringify(data) }
  );
}

async function basic() {
  await set('/', {
    boolean: true,
    string: 'its a string alright',
    number: 420,
    object: { its: 'an', object: 'with', lots: 'of', pairs: true },
    array: [1, 1, 2, 3, 5, 8, 13, 21, 34],
  });
}

async function lotsOfKeys() {
  for(let i = 0; i < 100; i++) {
    console.log(i);
    await push('/its/nested', { i, other: 'stuff' })
  }
}

async function main() {
  // await basic();
  // await lotsOfKeys();
}

export const start = () => {
  console.log('seeding');
  main()
    .then(console.log)
    .catch(console.error);
};
