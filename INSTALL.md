# Lop

## Install

Antes de trabajar modificando o instalando este proyecto hay que realizar las siguientes actividades:

### 1. Crear un proyecto en Firebase

+ Habilitar la Autorización mediante Google

+ Iniciar una Base de Datos Firestore con todos los permisos liberados por el momento, luego se deben pasar a Auth

+ Si será hosteado en Firebase Hosting, activar el mismo. 

### 2. Parametrizar los datos de Firebase en los Environments

+ Ingresar a /src/environments y renombrar ambos archivos de la siguiente manera:

<pre>
    ren environment.prod.ts.install environment.prod.ts
    ren environment.ts.install environment.ts
</pre>

+ Y dentro de estos archivos se deben completar los campos del objeto firebase de acuerdo a los datos que te provee la plataforma Firebase, los mismos los puedes obtener en tu proyecto de Firebase en la sección General de los Settings

