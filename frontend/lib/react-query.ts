import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
    },
  },
});
/* Durante 5 minutos los datos se consideran frescos, así React Query:
NO refetch automáticamente
NO marca la query como "stale"
reutiliza caché
*/
