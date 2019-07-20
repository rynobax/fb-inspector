import { getAccessToken, isErrorRes } from './access_token/server';

export interface Event {
  queryStringParameters: {
    [key: string]: string | undefined;
  };
}

exports.handler = function(ev: Event, _context: any, callback: any) {
  getAccessToken(ev.queryStringParameters).then(res => {
    callback(null, {
      statusCode: isErrorRes(res) ? 400 : 200,
      body: JSON.stringify(res),
    });
  });
};
