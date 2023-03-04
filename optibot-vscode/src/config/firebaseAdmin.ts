import * as admin from 'firebase-admin';
var serviceAccount = require('ai-documentor-firebase-adminsdk-q9s8j-10458e8a9b.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export { admin };
