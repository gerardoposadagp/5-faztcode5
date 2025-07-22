========================================================================
PROMPT
========================================================================

FORK 1 'LANDING/DASHBOARD/SIDEBAR/NAVEGACION'
========================================================================

con imagen de dribble
crea una aplicacion de administracion de proyectos y tareas usando next.js, chadcn que tenga landing page con CTA, paginas de signin, signup y dashboard con sidebar fijo a la izquierda no colapsable con las siguientes opciones: Dashboard, Proyectos, Tareas, Ajustes, Soporte y 'Admon usuarios' crea sus respectivas paginas


escogiendo el dropdownmenu
adiciona iconos a 2 ultimos botones

escogiendo dropdownmenu triger
colocale un icono user


FORK 2 'SIGNIN/SIGNUP/ROLES/PERFILES'
========================================================================

// escoger modelo large

Develop independent signup and signin pages with the following specifications: 

Signup Page: 

* signup form, along with any associated warnings or prompts, should be displayed within modal window on top of the landing page
* Implement a signup form with fields for email, password, and password confirmation. Do not include email confirmation functionality. 
* Implement a multi-role system for users, including 'sysadmin', 'admin', and 'user' roles, managed within a 'roles' table. 
* Upon initial signup, assign the 'user' role to the new user in the 'user_roles' table. 
* Automatically create a corresponding entry in the 'user_profiles' table for each new user. In the database, set the 'profile_status' column to 0 by default and the 'active' column to 1 by default

Signin Page: 

* signin form, along with any associated warnings or prompts, should be displayed within modal window on top of the landing page, including the complete profile form
* Implement a signin form with fields for email and password. 
* Upon successful signin, check the 'profile_status' of the user. If 'profile_status' is 0, present a modal form requesting the user's full name, address, phone number, and age, with 'Save' and 'Not Now' buttons. 
* If the user selects 'Save', update the provided data to the 'user_profiles' table, with 'profile_status' to 1, and redirect to the dashboard. 
* If the user selects 'Not Now', do not save the data and redirect to the dashboard. Presentation: 
* Both signup and signin forms, along with any associated warnings or prompts, should be displayed within modal windows.
* closing the complete profile form with the cross at right top corner should redirect to dashboard
* In the application's header, display the authenticated user's name and associated roles. 

* Implement a sign-out process that, upon execution, redirects the user to the landing page.

  Enlaza la opcion Mi Perfil 
  Al seleccinar la opción Mi Perfil presentar en modal formulario de profile con opciones Guardar y Cancelar, guardando la data y cerrando el modal. implementar el modal de perfil como un 'componente de diálogo cliente-side' directamente dentro del `DashboardHeader`. 

  implementar el modal de perfil como un **componente de diálogo cliente-side** directamente dentro del `DashboardHeader`. 
  /// no se usó.


FORK 3 'PROYECTOS CON CACHE' (v2)
========================================================================

Adjust the sidebar's width, reducing it by 65 pixels. Subsequently, reconfigure the main content area to accommodate this change, ensuring that the layout remains responsive and visually balanced across different screen sizes.

// hay 2 tecnicas de cache: useEffect() (mejor si hay filtros y manejo de sesiones) o fetch en Server Components (mejor si son registros publicos). preguntarle a chatgpt la diferencia
// otra estrategia de cachin que parece que es mejor.... use SWR for robust caching.
-----

crea la pagina de proyectos dentro del dashboard. implementa cache de datos para evitar recarga permanentemente. usa useEffect() en Client Component. pon boton de reload con icono para recargar. sidebar y header deben permanecer estaticos

Develop a 'Projects' page within the dashboard interface. Implement data caching to optimize performance and prevent constant reloading of project data. Utilize  SWR for robust caching. Include a reload button with an appropriate icon to allow users to manually refresh the project data. Ensure that the sidebar and header components maintain a fixed, static position throughout the user's interaction with the 'Projects' page.
------

FORK 4 'TAREAS CON CACHE' (v2.1)
========================================================================

crea la pagina de tareas dentro del dashboard. implementa cache de datos para evitar recarga permanentemente. usa useEffect() en Client Component. pon boton de reload con icono para recargar

Develop a 'Tasks' page within the dashboard interface. Implement data caching to optimize performance and prevent constant reloading of project data. Utilize the `useEffect()` hook within a Client Component to manage data fetching and updates. Include a reload button with an appropriate icon to allow users to manually refresh the project data. Ensure that the sidebar and header components maintain a fixed, static position throughout the user's interaction with the 'Tasks' page.

It should be that once a change is made to the database, the DOM is then updated. This ensures data consistency between what's displayed and what's stored in the database. If the database operation fails, we show an error toast and don't update the UI.



------
///// ME LO SALTE
en el dashboard implementa cache de datos para evitar recarga permanentemente. usa fetch() en Server Component. pon boton de reload con icono para recargar
OJO -> en desarrollo continua cargando siempre de la db pero en produccion el comportamiento ya debe ser el esperado

FORK 4 'FORMULARIOS'
========================================================================

crea formulario para adicionar/editar proyectos en la db de Supabase
las operaciones de añadir, editar y eliminar deben actualizar el DOM de forma instantánea sin recargar la página, ni recargar el dashboard. mensaje de confirmación al eliminar debe presentarse en modal

Develop a form to facilitate the addition and editing of project entries within a Supabase database. Implement functionality for adding new projects, modifying existing project details, and deleting projects. Ensure that all create, read, update, and delete (CRUD) operations are performed without requiring a page reload, providing an instant update to the Document Object Model (DOM). Before deletion of a project, display a confirmation message within a modal window to confirm the action.
------


haz la integracion

editar y adicionar en supabase. implementa inmediato

quita */

crear relacion entre tablas
subiendo la imagen de la relación entre projects y projects_status por status_id
  -> implement 

crea formulario para adicionar/editar tareas. las operaciones de añadir, editar y eliminar deben actualizar el DOM de forma instantánea sin recargar la página y recargar el dashboard actualiza dashboard

aqui aparecía ajustada a la la derecha la pagina de tareas

reescribe project-chart.tsx que está truncado

FORK 'ADMON USUARIOS'
-----------------------
// meter usuarios de administración desde Supabase
- adiciona al sidebar la opcion 'Admon usuarios'. solo los usuarios con rol sysadmin y admin pueden ver esta opción
- crea pagina de administracion de usuarios:
  - solo los usuarios con rol sysadmin y admin tienen acceso a esta página
  - muestra tabla en la que se podrán hacer las operaciones crud de los usuarios. 
  - la tabla mostrará las columnas nombre completo, direccion, telefono, edad, activo, roles asignados y fecha de signup.
  - implementa cache de datos para evitar recarga permanentemente. usa useEffect() en Client Component. 
  - boton de reload con icono para recargar.
  - Los íconos para agregar, editar y eliminar deben ser visibles, dependiendo del rol otorgado al usuario.
  - las operaciones crud se podrán hacer sobre esta tabla así:
    - sysadmin: all operations
    - admin: Retrieve y Update.
    - user: ninguna
  
crea pagina con formulario para adicionar/editar usuarios. usa grupo de Checkboxes para asignacion de roles. las operaciones de añadir, editar y eliminar deben actualizar el DOM de forma instantánea sin recargar la página. mensaje de confirmación al eliminar en modal. solo los usuarios con rol sysadmin y admin tienen acceso a esta página










