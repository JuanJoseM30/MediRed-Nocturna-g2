# MEDIRED-NOCTURNO-G1
Este proyecto implementa una arquitectura en capas basada en microservicios, organizada en capas independientes (controladores, servicios, modelos y repositorios) para gestionar de forma escalable la lógica de negocio y el acceso a datos de la plataforma MediRed.
# Integrantes: 
Juan Jose Marin  - 2235452 - JuanJoseM30 - ms-pacientes
Santiago Garzon  - 2235761 - 
Jhoan Esteban Burgos - 
Juan Felipe Vega - 
# Tabla de Microservicios 
| Carpeta | Entidad | Responsable | Puerto | Dependencias |
| :--- | :--- | :--- | :--- | :--- |
|`ms-usuarios` | Usuarios / Autenticación | Plantilla hecha por la profesora | 3001 | Ninguna (Autónomo) |
| `ms-pacientes` | Pacientes | Juan José Marín | 3002 | Ninguna (Autónomo) |

# Estructura del repositorio
MediRed-Nocturna-g2/
├── README.md            # Documentación general del proyecto y del grupo
├── ms-usuarios/         # Microservicio base de autenticación y roles de usuario (proporcionado por la docente)
├── ms-pacientes/        # Microservicio de gestión de información y datos de pacientes
├── ms-medicos/          # Microservicio de gestión de cuerpo médico y especialidades
├── ms-citas/            # Microservicio de programación y gestión de citas médicas
└── ms-historias/        # Microservicio de gestión de historias clínicas y registros médicos

# Como ejecutar el microservicio
 Se debe de instalar node.js desde el navegador web a preferencia, posteriormente se abrira la carpeta con em micro servicio, en la terminal (CMD) de nuestro editor de codigo en este caso visual studio deberemos de abrir la ruta con el comando cd  ms-(microservicio) con la carpeta en la terminar deberemos de colocar el comando npm install esto nos instalara express y con esto ya podremos crear el .env  cuando el env este creado, solamente con el npm run dev podremos correr el microservicio si el microservicio funciona en la terminal se mostraara en que puerto esta y en link en el localhost, para comprobar su funcionamiento deberemos de solamente en nuestro navegador web copiar este link y la ruta especifica si se muestra un archivo json comprobaremos que el microservicio funciona.
