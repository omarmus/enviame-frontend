# enviame-frontend

## Requisitos

- NodeJS 16 LTS

## Pregunta 1

Ejecutar en la raiz del proyecto
```
node scripts/primes.js A B
```

Donde:
- A: Parámetro de inicio del rango
- B: Parámetro final del rango

Ejemplos:
```
node scripts/primes.js 1 10
node scripts/primes.js 20 100000
```

## Pregunta 2

Ejecutar en la raiz del proyecto
```
node scripts/query.js
```

## Pregunta 3

### Instalando el API

Ejecutar en la raiz del proyecto e ingresar a la carpeta `api` para instalar dependencias
```
cd api
npm install
```

Configurar la llave pública y privada en el archivo `api/.env`
```
API_KEY_PUBLIC=xxxxx
API_KEY_PRIVATE=yyyyy
```

Iniciar el API
```
npm run dev
```

### Instalando el frontend

Ejecutar en la raiz del proyecto e instalar dependencias
```
npm install
```

Iniciar el frontend
```
npm run serve
```