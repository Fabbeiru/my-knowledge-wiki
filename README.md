# MyKnowledgeWiki

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.8.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Roadmap / Mejoras futuras

Notas de decisiones y mejoras pendientes, pensadas para ir evolucionando el proyecto por fases mientras se aprende:

- **Fuente de datos → base de datos.** Ahora mismo las notas viven en un único `notes.json` estático. La idea a medio plazo es migrar a una base de datos real con su propio backend (y más adelante añadir autenticación/login), como siguiente paso de aprendizaje del proyecto.
- **Sanitización del HTML de markdown.** `markdown-renderer.ts` inyecta el HTML generado por `marked` directamente vía `innerHTML` sin sanitizar (ni `DomSanitizer` ni una librería tipo DOMPurify). Hoy no es grave porque todo el contenido lo escribe el propio autor del proyecto, pero si en el futuro las notas dejan de ser 100% de autoría propia (importación externa, colaboración, etc.), esto debería sanitizarse antes de renderizar.
- **Servicio `Search` sin usar.** `core/services/search.ts` es una clase vacía (scaffold de `ng generate service`) que no se usa en ningún sitio — el filtrado real vive en `NotesService` como signals computados. Pendiente decidir: eliminarlo, o convertirlo en el sitio donde vivan búsquedas más avanzadas (fuzzy search, ranking de resultados) si se separa esa lógica de `NotesService` en el futuro.
- **Delay artificial de 3s al cargar notas.** En `NotesService.loadNotes()` hay un `setTimeout` de 3000ms intencionado para poder probar visualmente los skeletons de carga. Se debe quitar antes de dar el proyecto por "terminado" en su diseño visual.
