//Entry point for the Angular application

import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideHttpClient, withFetch } from '@angular/common/http';
import 'zone.js';


bootstrapApplication(App, {
  providers: [
    provideHttpClient(withFetch())
  ]
});
