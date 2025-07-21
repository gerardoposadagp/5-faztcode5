========================================================================
PROMPT
========================================================================

FORK 'LANDING/DASHBOARD/SIDEBAR/NAVEGACION'
-----------------------

con imagen de dribble
crea una aplicacion de administracion de proyectos y tareas usando next.js, chadcn que tenga landing page con CTA, paginas de signin, signup y dashboard con sidebar fijo a la izquierda no colapsable con las siguientes opciones: Dashboard, Proyectos, Tareas, Ajustes, Soporte y 'Admon usuarios' crea sus respectivas paginas


escogiendo el dropdownmenu
adiciona iconos a 2 ultimos botones

escogiendo dropdownmenu triger
colocale un icono user


FORK 'SIGNIN/SIGNUP/ROLES/PERFILES'
-----------------------

// escoger modelo large
crear paginas independientes de:
  - signup (email, contraseña y confirmar contraseña), sin envio de correo para confirmar. Multiples roles por usuario: 'sysadmin', 'admin', 'user' (tabla 'roles'). Cuando un usuario haga signup por primera vez:
    - debe quedar con rol 'user' (tabla 'user_roles')
    - debe adicionar a la tabla 'user_profiles' su registro. la columna 'profile_status' deben estar configurado en la db con valor 0 por defecto y 'activo' en 1 por defecto.
  - signin (email, contraseña). Si el signin es exitoso y 'profile_status' es 0, debe presentar formulario pidiendo nombre completo, direccion, telefono y edad, con los botones 'Guardar' y 'Ahora no'. Si escoge 'Guardar', guardar datos en tabla 'user_profiles' con profile_status en 1 y redirigir a dashboard. Si escoge 'Ahora no',no guardar datos y redirigir a dashboard.
  - ambos formularios y advertencias deben presentarse en modal
  
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





  escogiendo dropdownmenucontent
  . mostrar el Nombre y los roles del usuario identicado en el header
  . implementar proceso de signout, redirigiendo a landing page

Enhance the application's header to display the authenticated user's name and assigned roles. Implement a sign-out process that, upon execution, redirects the user to the landing page.

  
  Escoger la opcion Mi Perfil.
  Al seleccinar la opción Mi Perfil presentar en modal formulario de profile con opciones Guardar y Cancelar, guardando la data y cerrando el modal. implementar el modal de perfil como un 'componente de diálogo cliente-side' directamente dentro del `DashboardHeader`. 

  la ventana modal del profile debe aparecer en modal sobre el dashboard que se debe alcazar a ver con un gris mas transparente. despues de guardar o cancelar no debe recargarse el dashboard

  implementar el modal de perfil como un **componente de diálogo cliente-side** directamente dentro del `DashboardHeader`.

  Esto significa que el modal de perfil se abrirá y cerrará manejando un estado local, sin depender de la navegación de Next.js para su visualización, lo cual es el patrón que ya funciona en tu aplicación.


FORK 'DASHBOARD, TAREAS Y PROYECTOS CON CACHE'
-----------------------
// hay 2 tecnicas de cache: useEffect() (mejor si hay filtros y manejo de sesiones) o fetch en Server Components (mejor si son registros publicos). preguntarle a chatgpt la diferencia

crea la pagina de proyectos dentro del dashboard. implementa cache de datos para evitar recarga permanentemente. usa useEffect() en Client Component. pon boton de reload con icono para recargar

crea la pagina de tareas dentro del dashboard. implementa cache de datos para evitar recarga permanentemente. usa useEffect() en Client Component. pon boton de reload con icono para recargar

en el dashboard implementa cache de datos para evitar recarga permanentemente. usa fetch() en Server Component. pon boton de reload con icono para recargar
OJO -> en desarrollo continua cargando siempre de la db pero en produccion el comportamiento ya debe ser el esperado

FORK 'FORMULARIOS'
-----------------------

crea formulario para adicionar/editar proyectos 
las operaciones de añadir, editar y eliminar deben actualizar el DOM de forma instantánea sin recargar la página y recargar el dashboard. mensaje de confirmación al eliminar en modal

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










