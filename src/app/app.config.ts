import { ApplicationConfig } from '@angular/core';
import { provideRouter, withViewTransitions, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withViewTransitions({
        // Sin esto, CUALQUIER navegación dispara la transición, incluida
        // la que hace la search-bar en cada tecla para sincronizar
        // ?query= con la URL (o togglear un filtro): se ve como un
        // tembleque porque el crossfade se relanza en cada letra. Si la
        // ruta activa no cambia (solo cambian query params/fragment),
        // saltamos la transición — solo queremos el efecto al pasar de
        // una página a otra.
        onViewTransitionCreated: ({ transition, from, to }) => {
          if (from.routeConfig === to.routeConfig) {
            // Nota: esto hace que Angular loguee un "AbortError: Transition
            // was skipped" por consola en cada tecla, pero SOLO en `ng
            // serve` (el propio router de Angular hace ese console.error
            // internamente cuando ngDevMode está activo). En el build de
            // producción (el que se despliega) ese logging desaparece, así
            // que no llega a verse fuera de desarrollo.
            transition.skipTransition();
          }
        }
      }),
      // Sube al principio de la página en cada navegación (p. ej. al entrar
      // a una nota desde "Relacionadas" estando ya desplazado hacia abajo).
      // Con el botón atrás del navegador restaura la posición previa en vez
      // de subir, que es el comportamiento esperado ahí.
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
    ),
    provideHttpClient()
  ]
};