export const productIds =
  process.env.NODE_ENV == 'development'
    ? {
        standard: 'prod_NSzyi7HH7kAAF4',
        oneTime: 'prod_NT0DFcVRMuAJau'
      }
    : {
        standard: 'prod_NX2inao2U2IajE',
        oneTime: 'prod_NX2hbIfYg6aJpr'
      };
