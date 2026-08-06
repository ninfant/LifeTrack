import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}

// Max width and gutters for the inner pages, defined in a single place.
// Home does not use it: it is a full-bleed landing with its own background.
const Container = ({ children }: ContainerProps) => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {children}
    </div>
  );
};

export default Container;
