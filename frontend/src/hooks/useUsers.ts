import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/userService";

// GET user by id
export const useUserById = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
  });
};
