import { useEffect } from "react";
import { useApp } from "../lib/store";
import { useLocation } from "wouter";

export default function LoginPage() {
  const { login } = useApp();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Auto-login for testing purposes
    login("test@kids.com");
    setLocation("/kids");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl mb-4">✨</div>
        <h1 className="text-3xl font-heading text-primary mb-2">Carregando...</h1>
      </div>
    </div>
  );
}
