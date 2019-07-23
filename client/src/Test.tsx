import React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyCw9PaBquYxXtDkcno5nWQxmVdlmjQ0nmM',
  authDomain: 'fb-inspector-test.firebaseapp.com',
  databaseURL: 'https://fb-inspector-test.firebaseio.com',
  projectId: 'fb-inspector-test',
  storageBucket: 'fb-inspector-test.appspot.com',
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();

const Test: React.FC = () => {
  db.ref('/')
    .orderByValue()
    .limitToLast(2)
    .once('value')
    .then(snap => {
      console.log(snap.val());
    });
  return null;
};

export default Test;
