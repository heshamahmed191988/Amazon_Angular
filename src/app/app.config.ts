import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),provideHttpClient(withFetch()),importProvidersFrom(HttpClientModule),
  importProvidersFrom(TranslateModule.forRoot({
    loader:{
      provide:TranslateLoader,
      useFactory:httploaderfactory,
      deps:[HttpClient]
    }
  }))]


};

export function httploaderfactory(httpClient: HttpClient){
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');

}
