// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    //   apiUrl: 'http://localhost:8000/api/',
//  apiUrl: 'http://develop-api.goldsikka.com/api/',
 apiUrl: 'https://staging-api.dev.goldsikka.in/api/',
    paymentServiceUrl: 'http://127.0.0.1:8001',
    facebookAppId: '782456515797813',//mine facebook
    facebookAppSecret: 'f2732a5457b2f669be8519d34266b318',
    googleClientId: '1054771871420-idtlk02ss5vr4cpfoi4saa8t18esvn8f.apps.googleusercontent.com',//from other
    app: {
        name: 'GoldSikka',
    },
    company: {
        legalName: 'Goldsikka Limited',
    },
    razorPayApiKey: 'rzp_test_0VM20Pg2VIA2aR',
    razorPayApiUrl: 'https://api.razorpay.com',
    gstPercentage: 0,
    aws: {
        region: 'ap-south-1',
        iotMqtt: 'a1qmqtxgd00r5i-ats.iot.ap-south-1.amazonaws.com',
        cognito: {
            region: 'ap-south-1',
            identityPoolRegion: 'ap-south-1',
            userPoolId: 'ap-south-1_cg6ME8de4',
            identityPoolId: 'ap-south-1:cadda96d-aed7-496d-9d47-6b2661d37e39',
            userPoolWebClientId: '7fSV9bpq7TpZAZVeBs2RM75Auh',

        },
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
