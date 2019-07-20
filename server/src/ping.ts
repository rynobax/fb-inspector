exports.handler = function(_event: any, _context: any, callback: any) {
  callback(null, {
    statusCode: 200,
    body: 'Hello, World',
  });
};
