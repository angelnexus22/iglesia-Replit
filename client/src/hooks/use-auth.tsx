import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect } from "react";

interface User {
  id: string;
  username: string;
  nombre: string;
  rol: "parroco" | "coordinador" | "voluntario";
}

export function useAuth(skipFetch = false) {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/me"],
    enabled: !skipFetch,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
  };
}

export function useRequireAuth() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  return { isAuthenticated, isLoading };
}
