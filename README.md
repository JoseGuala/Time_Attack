# TIME ATTACK

Juego de precisión temporal hecho con **Vue 3**, **Vue Router**, **Pinia** y **Socket.IO**.

El jugador debe pulsar las teclas **A**, **S**, **D** y **F** cuando hayan pasado, respectivamente, **2, 4, 5 y 7 segundos** desde el inicio de la partida, sin ver el cronómetro. Cada tecla solo se puede pulsar una vez. Gana quien acumula menos error.

## Funcionalidades

- Formulario de entrada con el nombre del jugador (guardado en Pinia).
- Teclado en pantalla y teclado físico (se ignoran las repeticiones de una tecla mantenida).
- Tabla con los resultados de la partida actual.
- Historial local de partidas (las más recientes primero), con botón para borrarlo y la mejor marca.
- **Clasificación global en tiempo real** compartida entre navegadores a través de un servidor Socket.IO: ordenada de menor a mayor error, con la posición de cada jugador y el mejor resultado destacado.

## Estructura

| Fichero | Responsabilidad | Comunicación |
| --- | --- | --- |
| `src/views/GameBoardView.vue` | Controla toda la lógica de la partida y la conexión con el servidor | — |
| `src/components/KeyPad.vue` | Muestra los botones A, S, D, F | Props y emits |
| `src/components/ResultsTable.vue` | Muestra el resultado de la partida actual | Props |
| `src/components/ScoreBoard.vue` | Muestra el historial local y la clasificación global | Pinia |
| `src/stores/game.js` | Nombre del jugador, historial y clasificación global | Store de Pinia |
| `src/services/socket.js` | Cliente Socket.IO (`autoConnect: false`) | Socket.IO |

### Flujo de comunicación con el servidor

```
GameBoardView.vue
       |  socket.emit('resultat', { nom, errorTotal })
       v
  SERVIDOR NODE.JS
       |  io.emit('classificacio', dades)
       v
   Navegadores
       |  socket.on('classificacio', ...)
       v
   STORE PINIA  ->  ScoreBoard.vue
```

## Puesta en marcha

### 1. Backend (servidor Node.js con Docker)

```sh
git clone https://github.com/alvaroph/backend_TIME_ATTACK.git
cd backend_TIME_ATTACK
docker compose up --build -d
```

Comprueba que funciona abriendo <http://localhost:3000/health>.

### 2. Frontend (este proyecto)

El fichero `.env` indica dónde está el servidor:

```
VITE_SOCKET_URL=http://localhost:3000
```

Si el servidor está en otro ordenador, sustituye `localhost` por su IP. Después de modificar `.env`, reinicia el servidor de desarrollo de Vite.

```sh
npm install
npm run dev
```

Para generar la versión de producción:

```sh
npm run build
```

> Si no hay conexión con el servidor, el juego sigue funcionando en local y guardando las partidas en el historial; solo deja de compartirse la clasificación global.
