# 🧪 Guía de Testing - LifeTrack

## 🛠️ Stack de Testing

### 1. **Vitest** - Test Runner

- Similar a Jest pero más rápido
- Integrado con Vite
- Soporte nativo para TypeScript

### 2. **React Testing Library** - Para testear componentes React

- Renderiza componentes
- Simula interacciones del usuario
- Busca elementos en el DOM

### 3. **Allure** - Reportes visuales

- Genera reportes HTML bonitos
- Muestra qué tests pasaron/fallaron
- Estadísticas y gráficos

## 📁 Estructura de Tests

```
src/
├── utils/
│   ├── formatDate.ts
│   └── __tests__/
│       └── formatDate.test.ts  ← Tests de utilidades
├── components/
│   └── Button/
│       ├── Button.tsx
│       └── __tests__/
│           └── Button.test.tsx  ← Tests de componentes
```

**Convención**: Los tests van en carpetas `__tests__` o archivos `.test.ts`

## 🚀 Comandos Disponibles

### Ejecutar Tests

```bash
# Modo watch (se ejecuta automáticamente al cambiar archivos)
npm run test

# Interfaz visual de Vitest
npm run test:ui

# Ejecutar una vez y salir
npm run test:run

# Con coverage (cobertura de código)
npm run test:coverage
```

### Generar Reportes Allure

```bash
# 1. Ejecutar tests y generar datos de Allure
npm run test:allure

# 2. Generar reporte HTML
npm run allure:generate

# 3. Abrir reporte en el navegador
npm run allure:open

# O todo en uno (genera y abre)
npm run allure:serve
```

## 📝 Conceptos Básicos

### 1. **describe** - Agrupa tests relacionados

```typescript
describe("formatDate", () => {
  // Todos los tests de formatDate van aquí
});
```

### 2. **it** o **test** - Un test individual

```typescript
it("debe formatear una fecha correctamente", () => {
  // Código del test
});
```

### 3. **expect** - Verifica que algo sea cierto

```typescript
expect(result).toBe("15/01/2024");
expect(button).toBeInTheDocument();
expect(handleClick).toHaveBeenCalled();
```

### 4. **Arrange-Act-Assert (AAA)**

```typescript
it("ejemplo de estructura AAA", () => {
  // Arrange (Preparar): Datos de entrada
  const input = "test";

  // Act (Actuar): Ejecutar función
  const result = myFunction(input);

  // Assert (Afirmar): Verificar resultado
  expect(result).toBe("expected");
});
```

## 🎯 Ejemplos de Tests

### Test de Función (Utils)

```typescript
import { describe, it, expect } from "vitest";
import { formatDate } from "../formatDate";

describe("formatDate", () => {
  it("debe formatear una fecha correctamente", () => {
    const date = new Date("2024-01-15");
    const result = formatDate(date);
    expect(result).toBe("15/01/2024");
  });
});
```

### Test de Componente React

```typescript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "../Button";

describe("Button", () => {
  it("debe ejecutar onClick cuando se hace click", async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByText("Click me");
    const user = userEvent.setup();
    await user.click(button);

    expect(handleClick).toHaveBeenCalled();
  });
});
```

## 📊 Allure Reports

### ¿Qué es Allure?

Allure genera reportes HTML visuales con:

- ✅ Tests que pasaron
- ❌ Tests que fallaron
- 📊 Estadísticas
- 📈 Gráficos de tendencias
- 🔍 Detalles de cada test

### Flujo de Trabajo

1. **Escribir tests** → `Button.test.tsx`
2. **Ejecutar tests** → `npm run test:allure`
3. **Generar reporte** → `npm run allure:generate`
4. **Ver reporte** → `npm run allure:open`

### Estructura del Reporte

```
Allure Report
├── Overview (Resumen general)
├── Behaviors (Agrupado por features)
├── Suites (Agrupado por archivos)
├── Graphs (Gráficos y estadísticas)
└── Timeline (Línea de tiempo)
```

## 🎓 Mejores Prácticas

### ✅ DO (Hacer)

- Testea comportamiento, no implementación
- Un test = una cosa
- Nombres descriptivos: `it('debe retornar error cuando email es inválido')`
- Tests independientes (no dependen unos de otros)

### ❌ DON'T (No hacer)

- No testees detalles internos
- No hagas tests muy complejos
- No dependas de orden de ejecución
- No ignores tests que fallan

## 🔍 Matchers Comunes

```typescript
// Igualdad
expect(value).toBe(4);
expect(value).toEqual({ name: "test" });

// Verdadero/Falso
expect(value).toBeTruthy();
expect(value).toBeFalsy();

// Strings
expect(str).toContain("substring");
expect(str).toMatch(/regex/);

// Arrays
expect(array).toHaveLength(3);
expect(array).toContain("item");

// DOM (con @testing-library/jest-dom)
expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(button).toBeDisabled();

// Funciones
expect(fn).toHaveBeenCalled();
expect(fn).toHaveBeenCalledWith("arg");
```

## 🐛 Debugging Tests

### Ver qué está pasando

```typescript
it("debug test", () => {
  const result = myFunction();
  console.log(result); // Ver en consola
  debug(); // Ver HTML renderizado (solo en componentes)
});
```

### Ejecutar un solo test

```typescript
// Agrega .only al describe o it
describe.only("solo este test", () => {
  // Solo este describe se ejecutará
});
```

## 📚 Recursos

- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Allure Docs](https://docs.qameta.io/allure/)

## ❓ Preguntas Frecuentes

**Q: ¿Cuántos tests debo escribir?**
A: No hay número mágico. Testea lo importante: lógica de negocio, funciones críticas, componentes principales.

**Q: ¿Debo testear TODO?**
A: No. Prioriza:

1. Funciones complejas
2. Lógica de negocio
3. Componentes que usan muchos usuarios
4. Bugs que ya encontraste

**Q: ¿Qué pasa si un test falla?**
A: ¡Perfecto! Eso significa que encontraste un problema. Revisa el error, corrige el código o el test, y vuelve a ejecutar.
