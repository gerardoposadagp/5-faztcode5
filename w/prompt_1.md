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

FORK 3 'DASHBOARD/HEADER/SIDEBAR/NAVEGACION' 

...


FORK 4 'PROYECTOS CON CACHE SENCILLO' (v2)
========================================================================

Adjust the sidebar's width, reducing it by 65 pixels. Subsequently, reconfigure the main content area to accommodate this change, ensuring that the layout remains responsive and visually balanced across different screen sizes.

// hay 2 tecnicas de cache: useEffect() (mejor si hay filtros y manejo de sesiones) o fetch en Server Components (mejor si son registros publicos). preguntarle a chatgpt la diferencia
// otra estrategia de cachin que parece que es mejor.... use SWR for robust caching.
-----

crea la pagina de proyectos dentro del dashboard. implementa cache de datos para evitar recarga permanentemente. usa useEffect() en Client Component. pon boton de reload con icono para recargar. sidebar y header deben permanecer estaticos

Develop a 'Projects' page within the dashboard interface. Implement data caching to optimize performance and prevent constant reloading of project data. Utilize SWR for robust caching. Include a reload button with an appropriate icon to allow users to manually refresh the project data. Ensure that the sidebar and header components maintain a fixed, static position throughout the user's interaction with the 'Projects' page.
------

**Global Cache Object**: Created a cache outside the component that persists across navigation
**Cache Validation**: 5-minute cache duration with timestamp checking
**Smart Fetching**: Only fetches from database if cache is invalid or empty
**Cache Updates**: Updates cache whenever CRUD operations succeed
**Visual Feedback**: Shows cache age in the UI

**First visit**: Fetches from database and caches the result
**Return visits**: Uses cached data if still valid (< 5 minutes old)
**CRUD operations**: Updates both local state and cache immediately
**Manual refresh**: Invalidates cache and forces fresh fetch


FORK 4 'faztcode5 - 5. PAGINA TAREAS CON CACHING, PAGINACION Y FILTROS' (v2.1)
========================================================================
Write the scripts to create the following tables and schemas:
  - 'status' table:
		- id (int, PK)
		- status_name (varchar)
  - 'tasks' table:
		- id (int, PK)			
		- task_name (varchar)
		- project_id (int, FK linked to projects.id table.column)
		- status_id (int, FK linked to status.id table.column)
    - progress (int)
    - due_date (date)
    - created_by (int, FK linked to users.id table.column)

let's add some fake data
  - 'status' table: add 'Active', 'Completed', 'Pending', 'On Hold'
  - 'items' table: add 10000 tasks this way:
		loop 10000 times
			task_name = 'Task '+id
			project_id = id selected ramdomly from the 'projects' table
			status_id = selected ramdomly from the 'status' table
      progress = random number between 0 and 100
      due_date = random date AFTER 01/01/2023
      created_by = id selected ramdomly from the 'users' table
			add record
		end loop

ACA VOY
***************************

Develop a 'Tasks' page within the dashboard interface. 
	- remove cards with simulate data
  - show table with records from the 'tasks' table and its linked tables, showing the following columns:
		- Task
		- Project
    - Status
		- Progress
		- Due Date
		- Created By
    - Edit and update option icons
	- The add or edit option icons should be linked to a modal window with a form so that the user can create or modify its data.
  - Implement 'Server-Side Pagination' with @supabase/supabase-js (100 records per page) to avoid sending a massive amount of data over the network in a single request and 'List Virtualization' (Windowing - 20 records height) with `@tanstack/react-virtual` to avoid rendering a huge number of DOM elements at once. 
  - Create a cache outside the component (Global Cache) that persists across navigation
  - Include a reload button with an appropriate icon to allow users to manually refresh the tasks data. 
  - It should be that once a change is made to the database, the DOM is then updated. This ensures data consistency between what's displayed and what's stored in the database. The DB information should not be reloaded after any CRUD operation.
  - If the database operation fails, we show an error toast and don't update the UI.
	- Filter
    - At the top of the table, users should be able to filter information by:
      - Project
      - Status
      - User (Created By)
    - Put a filter button after the comboboxes to apply the filter. 
    - Filter should not be triggered by changing any of the comboboxes.

CRUD operations:
  - Addition and editing form, along with any associated warnings or prompts, should be displayed within modal window on top of the current page
  - Ensure that all create, read, update, and delete (CRUD) operations once performed do not require a page reload, providing an instant update to the Document Object Model (DOM). 
  * Before deletion of a task, display a confirmation message within a modal window to confirm the action.
* Ensure that the sidebar and header components maintain a fixed, static position throughout the user's interaction with the 'Tasks' page.



------
///// ME LO SALTE
en el dashboard implementa cache de datos para evitar recarga permanentemente. usa fetch() en Server Component. pon boton de reload con icono para recargar
OJO -> en desarrollo continua cargando siempre de la db pero en produccion el comportamiento ya debe ser el esperado


crear relacion entre tablas
subiendo la imagen de la relación entre projects y projects_status por status_id
  -> implement 


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


FORK SEGURIDAD
-----------------------
POR CADA PAGINA....
	- Users granted with the 'sys_admin', 'facility_admin', 'facility_operator' and 'user' roles can:
		- see the `Items` option menu on the Sidebar
		- access this page.
	- CRUD operations should be able to be performed on this table (items) as follows:
		- 'sys_admin' role: all operations
		- 'facility_admin' role: Retreive
		- 'facility_operator' role: Retreive
		- 'user' role: Retreive








