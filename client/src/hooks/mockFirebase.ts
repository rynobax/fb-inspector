import { FirebaseValue } from 'stores/store';
import times from 'lodash/times';
import get from 'lodash/get';

const QUERY_TIME_MS = 0;

const dataChoices = {
  small: createSmall(),
  long: createLong(),
  test: createTest(),
};

const data = dataChoices.long;

export function mockQueryData(pathStr: string) {
  return new Promise<FirebaseValue>(resolve => {
    setTimeout(() => {
      const path = pathStr.split('/').slice(1);
      const value = pathStr === '/' ? data : get(data, path);
      const shallowValue = shallowify(value);
      resolve(shallowValue);
    }, QUERY_TIME_MS);
  });
}

function shallowify(v: any) {
  if (typeof v === 'object' && v !== null) {
    return Object.keys(v).reduce<{ [k: string]: boolean }>((acc, k) => {
      acc[k] = true;
      return acc;
    }, {});
  } else {
    return v;
  }
}

function createSmall() {
  return {
    number: 5,
    string: "It's a string",
    longstring: times(10)
      .map(i => `This is sentence #${i}.`)
      .join(' '),
    boolean: true,
    booleanFalse: false,
    object: {
      this: 'is',
      an: 'object',
      with: 'keys',
      nested: {
        object: 'works',
        with: {
          deep: {
            nesting: {
              and: {
                stuff: {
                  when: {
                    will: {
                      it: {
                        stop: {
                          ok: 'here',
                          boy: 'thats deep',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
}

function createLong() {
  const toReturn: any = { stuff: {} };
  for (let i = 0; i < 5000; i++) {
    const key = String(Math.random()).slice(3);
    toReturn.stuff[key] = Math.random();
  }
  return toReturn;
}

function createTest() {
  return {
    '-aaaaa': 0,
    '-LjETJxjC4D4qd2If9V1': 1,
    '-LjGofqVYWzdUeRg6oYz': 2,
    '-LjgBG8PfX1b0ao11Hrr': 3,
    '-LjgoQwTC__RF-1xMylo': 4,
    '-zzzzzzz': 5,
  };
}
