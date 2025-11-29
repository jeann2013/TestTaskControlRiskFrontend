# 🖥️ TaskManager Frontend — React + Vite + TailwindCSS

Aplicación frontend del proyecto **TaskManager**, desarrollada con **React**, **Vite**, **TypeScript** y **TailwindCSS**.
Este frontend consume la API del backend para gestionar tareas, autenticar usuarios con JWT y mostrar análisis de IA.

---

## 🚀 Características principales

* Login y registro de usuarios
* Listado y creación de tareas
* Completado de tareas
* Llamadas al servicio IA:

  * **Análisis de tareas (resumen y prioridad)**
  * **Generación de subtareas**
* Cliente HTTP centralizado (`useApi.ts`)
* Interfaz moderna con TailwindCSS
* Integración con React Router

---

# 📦 Instalación del Frontend

## 1️⃣ Requisitos previos

Asegúrate de tener instalado:

* **Node.js 18+**
* **npm** o **yarn**
* Backend ejecutándose en:

  ```
  https://localhost:7179
  ```

---

## 2️⃣ Clonar el repositorio

```bash
git clone https://github.com/jeann2013/TestTaskControlRiskFrontend.git
```

Luego entra al frontend:

```bash
cd TestTaskControlRiskFrontend
```

---

## 3️⃣ Instalar dependencias

```bash
npm install
```

---

## 4️⃣ Archivo de configuración `.env`

Crear un archivo `.env` en la raíz del frontend:

```
VITE_API_URL=https://localhost:7179
```

---

## 5️⃣ Ejecutar el proyecto en modo desarrollo

```bash
npm run dev
```

La aplicación abrirá en:

```
http://localhost:5173
```

---

# 🏗️ Estructura del Proyecto

```
taskmanager-frontend/
│
├── src/
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── TasksPage.tsx
│   │   └── AnalyzeTask.tsx
│   │
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── TaskCard.tsx
│   │
│   ├── hooks/
│   │   └── useApi.ts
│   │
│   ├── context/
│   │   └── AuthContext.tsx
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── public/
│
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

# 🔌 Comunicación con el Backend

El frontend consume la API mediante el hook:

```
src/hooks/useApi.ts
```

Incluye:

* Headers automáticos
* Token JWT desde localStorage
* Manejo de errores
* Cliente unificado

---

# 🧪 Scripts disponibles

| Script            | Descripción                       |
| ----------------- | --------------------------------- |
| `npm run dev`     | Ejecuta la app en modo desarrollo |
| `npm run build`   | Crea el build de producción       |
| `npm run preview` | Previsualiza el build             |
| `npm test`     | Ejecuta los Tests |

---

# 📄 Build de producción

Ejecutar:

```bash
npm run build
```

Luego:

```bash
npm run preview
```

Se abrirá un servidor local para probar el build.

---

# 💡 Notas

* Si cambias la URL del backend, actualiza el `.env`.
* TailwindCSS recompilará la UI automáticamente.
* La app se integra automáticamente con los endpoints `/tasks`, `/auth`, `/tasks/analyze`, `/tasks/suggest`.

---

¿Quieres también un README para el backend o uno combinado para todo el proyecto?
