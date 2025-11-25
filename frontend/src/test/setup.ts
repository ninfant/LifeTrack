// Configuración inicial para todos los tests
import "@testing-library/jest-dom";
import {  afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Limpia después de cada test
afterEach(() => {
  cleanup();
});

// Extiende expect con matchers de jest-dom
// Esto permite usar: expect(element).toBeInTheDocument()
