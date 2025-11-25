// Tests para el componente Button
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "../Button";

/**
 * Tests de Componentes React
 *
 * Testing Library nos ayuda a:
 * - render: Renderiza el componente
 * - screen: Accede a elementos del DOM
 * - userEvent: Simula interacciones del usuario
 */

describe("Button Component", () => {
  it("debe renderizar el texto del botón", () => {
    // Renderizamos el componente
    render(<Button>Click me</Button>);

    // Buscamos el texto en el DOM
    const button = screen.getByText("Click me");

    // Verificamos que existe
    expect(button).toBeInTheDocument();
  });

  it("debe ejecutar onClick cuando se hace click", async () => {
    // Creamos una función mock (falsa) para verificar que se llame
    const handleClick = vi.fn();

    // Renderizamos con el onClick
    render(<Button onClick={handleClick}>Click me</Button>);

    // Buscamos el botón
    const button = screen.getByText("Click me");

    // Simulamos un click (userEvent es más realista que fireEvent)
    const user = userEvent.setup();
    await user.click(button);

    // Verificamos que la función se llamó
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("debe aplicar la variante primary por defecto", () => {
    render(<Button>Primary Button</Button>);
    const button = screen.getByText("Primary Button");

    // Verificamos que tiene las clases de primary
    expect(button).toHaveClass("bg-blue-500");
  });

  it("debe aplicar la variante secondary cuando se especifica", () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByText("Secondary Button");

    expect(button).toHaveClass("bg-gray-500");
  });

  it("debe estar deshabilitado cuando disabled es true", () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByText("Disabled Button");

    // Verificamos que está deshabilitado
    expect(button).toBeDisabled();

    // Verificamos que tiene las clases de disabled
    expect(button).toHaveClass("opacity-50");
  });

  it("no debe ejecutar onClick cuando está deshabilitado", async () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Disabled Button
      </Button>
    );

    const button = screen.getByText("Disabled Button");
    const user = userEvent.setup();

    // Intentamos hacer click
    await user.click(button);

    // Verificamos que NO se llamó
    expect(handleClick).not.toHaveBeenCalled();
  });
});
