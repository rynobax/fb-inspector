import { FirebaseValue } from 'stores/store';
import times from 'lodash/times';
import get from 'lodash/get';

const QUERY_TIME_MS = 0;

const dataChoices = {
  small: createSmall(),
  long: createLong(),
  test: createTest(),
};

const data = dataChoices.test;

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
    one: {
      '-LjETJxjC4D4qd2If9V1': 1,
      '-LjGofqVYWzdUeRg6oYz': 2,
      '-LjgBG8PfX1b0ao11Hrr': 3,
      '-LjgoQwTC__RF-1xMylo': 4,
      '-aaaaa': 5,
      '-zzzzzzz': 6,
    },
    two: {
      '-LkMS-RHt65-eMHILt7t': 1,
      '-LkMS0RCL_9dm5f7mylo': 2,
      '-LkMS1U2L87bIrIxOInU': 3,
      '-LkMS2MTKXWtNR369n_C': 4,
      '-LkMS2R0hEdRXMdTuexu': 5,
      '-LkMS2TsEcVOkCQ0rWq2': 6,
      '-LkMS2WpjJb0UOWPxTTe': 7,
      '-LkMS2ZwoaB6EmzKCg1H': 8,
      '-LkMS2cT_nlZD4l_AC45': 9,
    },
    three: {
      '-LkMSwJh8pmNIoQ6bzCx': 0,
      '-LkMSwJh8pmNIoQ6bzCy': 1,
      '-LkMSwJh8pmNIoQ6bzCz': 2,
      '-LkMSwJh8pmNIoQ6bzD0': 4,
      '-LkMSwJh8pmNIoQ6bzD1': 5,
      '-LkMSwJh8pmNIoQ6bzD-': 3,
    },
    four: {
      '-LkMTRFvjq80RUEQs5gz': 0,
      '-LkMTRFvjq80RUEQs5h-': 1,
      '-LkMTRFvjq80RUEQs5h0': 2,
      '-LkMTRFvjq80RUEQs5h1': 3,
      '-LkMTRFvjq80RUEQs5h2': 4,
      '-LkMTRFvjq80RUEQs5h3': 5,
      '-LkMTRFvjq80RUEQs5h4': 6,
      '-LkMTRFvjq80RUEQs5h5': 7,
      '-LkMTRFvjq80RUEQs5h6': 8,
      '-LkMTRFvjq80RUEQs5h7': 9,
      '-LkMTRFvjq80RUEQs5h8': 10,
      '-LkMTRFvjq80RUEQs5h9': 11,
      '-LkMTRFvjq80RUEQs5hA': 12,
      '-LkMTRFvjq80RUEQs5hB': 13,
      '-LkMTRFvjq80RUEQs5hC': 14,
      '-LkMTRFvjq80RUEQs5hD': 15,
      '-LkMTRFvjq80RUEQs5hE': 16,
      '-LkMTRFvjq80RUEQs5hF': 17,
      '-LkMTRFvjq80RUEQs5hG': 18,
      '-LkMTRFvjq80RUEQs5hH': 19,
      '-LkMTRFvjq80RUEQs5hI': 20,
      '-LkMTRFvjq80RUEQs5hJ': 21,
      '-LkMTRFvjq80RUEQs5hK': 22,
      '-LkMTRFvjq80RUEQs5hL': 23,
      '-LkMTRFvjq80RUEQs5hM': 24,
      '-LkMTRFvjq80RUEQs5hN': 25,
      '-LkMTRFvjq80RUEQs5hO': 26,
      '-LkMTRFvjq80RUEQs5hP': 27,
      '-LkMTRFvjq80RUEQs5hQ': 28,
      '-LkMTRFvjq80RUEQs5hR': 29,
      '-LkMTRFvjq80RUEQs5hS': 30,
      '-LkMTRFvjq80RUEQs5hT': 31,
      '-LkMTRFvjq80RUEQs5hU': 32,
      '-LkMTRFvjq80RUEQs5hV': 33,
      '-LkMTRFvjq80RUEQs5hW': 34,
      '-LkMTRFvjq80RUEQs5hX': 35,
      '-LkMTRFvjq80RUEQs5hY': 36,
      '-LkMTRFvjq80RUEQs5hZ': 37,
      '-LkMTRFvjq80RUEQs5h_': 38,
      '-LkMTRFvjq80RUEQs5ha': 39,
      '-LkMTRFvjq80RUEQs5hb': 40,
      '-LkMTRFvjq80RUEQs5hc': 41,
      '-LkMTRFvjq80RUEQs5hd': 42,
      '-LkMTRFvjq80RUEQs5he': 43,
      '-LkMTRFvjq80RUEQs5hf': 44,
      '-LkMTRFvjq80RUEQs5hg': 45,
      '-LkMTRFvjq80RUEQs5hh': 46,
      '-LkMTRFvjq80RUEQs5hi': 47,
      '-LkMTRFvjq80RUEQs5hj': 48,
      '-LkMTRFvjq80RUEQs5hk': 49,
      '-LkMTRFvjq80RUEQs5hl': 50,
      '-LkMTRFvjq80RUEQs5hm': 51,
      '-LkMTRFvjq80RUEQs5hn': 52,
      '-LkMTRFvjq80RUEQs5ho': 53,
      '-LkMTRFvjq80RUEQs5hp': 54,
      '-LkMTRFvjq80RUEQs5hq': 55,
      '-LkMTRFvjq80RUEQs5hr': 56,
      '-LkMTRFvjq80RUEQs5hs': 57,
      '-LkMTRFvjq80RUEQs5ht': 58,
      '-LkMTRFvjq80RUEQs5hu': 59,
      '-LkMTRFvjq80RUEQs5hv': 60,
      '-LkMTRFvjq80RUEQs5hw': 61,
      '-LkMTRFvjq80RUEQs5hx': 62,
      '-LkMTRFvjq80RUEQs5hy': 63,
      '-LkMTRFvjq80RUEQs5hz': 64,
      '-LkMTRFvjq80RUEQs5i-': 65,
      '-LkMTRFvjq80RUEQs5i0': 66,
      '-LkMTRFvjq80RUEQs5i1': 67,
      '-LkMTRFvjq80RUEQs5i2': 68,
      '-LkMTRFvjq80RUEQs5i3': 69,
      '-LkMTRFvjq80RUEQs5i4': 70,
      '-LkMTRFvjq80RUEQs5i5': 71,
      '-LkMTRFvjq80RUEQs5i6': 72,
      '-LkMTRFvjq80RUEQs5i7': 73,
      '-LkMTRFvjq80RUEQs5i8': 74,
      '-LkMTRFvjq80RUEQs5i9': 75,
      '-LkMTRFvjq80RUEQs5iA': 76,
      '-LkMTRFvjq80RUEQs5iB': 77,
      '-LkMTRFvjq80RUEQs5iC': 78,
      '-LkMTRFvjq80RUEQs5iD': 79,
      '-LkMTRFvjq80RUEQs5iE': 80,
      '-LkMTRFvjq80RUEQs5iF': 81,
      '-LkMTRFvjq80RUEQs5iG': 82,
      '-LkMTRFvjq80RUEQs5iH': 83,
      '-LkMTRFw4KHf21j5KJua': 84,
      '-LkMTRFw4KHf21j5KJub': 85,
      '-LkMTRFw4KHf21j5KJuc': 86,
      '-LkMTRFw4KHf21j5KJud': 87,
      '-LkMTRFw4KHf21j5KJue': 88,
      '-LkMTRFw4KHf21j5KJuf': 89,
      '-LkMTRFw4KHf21j5KJug': 90,
      '-LkMTRFw4KHf21j5KJuh': 91,
      '-LkMTRFw4KHf21j5KJui': 92,
      '-LkMTRFw4KHf21j5KJuj': 93,
      '-LkMTRFw4KHf21j5KJuk': 94,
      '-LkMTRFw4KHf21j5KJul': 95,
      '-LkMTRFw4KHf21j5KJum': 96,
      '-LkMTRFw4KHf21j5KJun': 97,
      '-LkMTRFw4KHf21j5KJuo': 98,
      '-LkMTRFw4KHf21j5KJup': 99,
    },
  };
}
