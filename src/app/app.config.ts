import { ApplicationConfig } from '@angular/core';
import { provideRouter, withViewTransitions, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withViewTransitions(),
      // Sube al principio de la página en cada navegación (p. ej. al entrar
      // a una nota desde "Relacionadas" estando ya desplazado hacia abajo).
      // Con el botón atrás del navegador restaura la posición previa en vez
      // de subir, que es el comportamiento esperado ahí.
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
    ),
    provideHttpClient()
  ]
};