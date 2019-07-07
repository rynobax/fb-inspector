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

export const openState = observable.map<string, boolean>({});

export const resetStores = () => {
  openState.clear();
  dataStore.clear();
};
