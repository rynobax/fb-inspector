import { observable } from 'mobx';

type FirebaseScalar = string | number | boolean;
interface FirebaseObject {
  [key: string]: FirebaseScalar;
}
export type FirebaseValue = null | FirebaseScalar | FirebaseObject;

export const dataStore = observable.map<string, StoreObj>({});

type StoreObj = PendingObj | SuccessObj | ErrorObj;

export enum Status {
  PENDING,
  ERROR,
  SUCCESS,
}

interface PendingObj {
  status: Status.PENDING;
  prom: Promise<void>;
  value: null;
  error: null;
}

interface SuccessObj {
  status: Status.SUCCESS;
  prom: Promise<void>;
  value: FirebaseValue;
  error: null;
}

interface ErrorObj {
  status: Status.ERROR;
  prom: Promise<void>;
  value: null;
  error: Error;
}

export const openStore = observable.map<string, boolean>({});

// Observer will not fire on clear, so we set a key to force it

export const resetOpen = () => {
  console.log('resetting open store');
  openStore.clear();
  openStore.set('$$$$_fire_observer', true);
};

const resetProm = new Promise<void>(r => r);
export const resetData = () => {
  console.log('resetting data store');
  dataStore.clear();
  dataStore.set('$$$$_fire_observer', {
    prom: resetProm,
    status: Status.SUCCESS,
    value: true,
    error: null,
  });
};

// Print
(window as any).printStores = () => {
  console.log(JSON.parse(JSON.stringify(openStore)));
  console.log(JSON.parse(JSON.stringify(dataStore)));
}
