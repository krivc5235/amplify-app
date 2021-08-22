import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';

import Amplify, { Auth, API } from 'aws-amplify';
import awsconfig from './aws-exports';
import config from './config'



import { AppModule } from './app/app.module';


Amplify.configure({
  ... awsconfig,
  Auth: {
    region: environment.region,
    userPoolId: environment.userPoolId,
    mandatorySignIn: false,
    userPoolWebClientId: environment.userPoolWebClientId
  }
});
API.configure({
  API: {
    endpoints: [
      {
        name: "blogsApi",
        endpoint: "https://ja7ut9by56.execute-api.eu-west-1.amazonaws.com/dev"
      }
    ]
  }
})



if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
