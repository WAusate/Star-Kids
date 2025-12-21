import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "wouter";

// Types
export type Behavior = {
  id: string;
  label: string;
  icon: string;
};

export type Content = {
  id: string;
  title: string;
  thumbnail: string;
  type: "video" | "audio";
  tags: string[]; // To filter by behavior
};

type AppState = {
  user: { email: string } | null;
  childName: string;
  selectedBehaviors: string[]; // IDs of selected behaviors
  playlist: Content[];
  login: (email: string) => void;
  logout: () => void;
  updateSettings: (name: string, behaviors: string[]) => void;
};

// Constants
export const BEHAVIORS: Behavior[] = [
  { id: "tantrums", label: "Birras e choro", icon: "😭" },
  { id: "sharing", label: "Não divide brinquedos", icon: "🧸" },
  { id: "stubborn", label: "Teimosia", icon: "😤" },
  { id: "jealousy", label: "Ciúmes com irmão", icon: "😠" },
  { id: "no", label: "Dificuldade com 'não'", icon: "🚫" },
  { id: "eating", label: "Hora de comer", icon: "🥦" },
  { id: "sleeping", label: "Rotina de dormir", icon: "🌙" },
  { id: "aggression", label: "Agressividade", icon: "💥" },
  { id: "whining", label: "Manha excessiva", icon: "🥺" },
  { id: "change", label: "Mudanças na rotina", icon: "🔄" },
];

// Mock Content Database
// Using the generated assets here
import lionImg from "@assets/generated_images/cartoon_lion_singing.png";
import rocketImg from "@assets/generated_images/cartoon_rocket_ship.png";
import vegImg from "@assets/generated_images/cartoon_dancing_vegetables.png";
import dinoImg from "@assets/generated_images/cartoon_dinosaur_reading.png";

const ALL_CONTENT: Content[] = [
  { id: "1", title: "O Leão Cantor", thumbnail: lionImg, type: "video", tags: ["tantrums", "whining", "no"] },
  { id: "2", title: "Viagem ao Espaço", thumbnail: rocketImg, type: "video", tags: ["stubborn", "change"] },
  { id: "3", title: "Vegetais Dançantes", thumbnail: vegImg, type: "video", tags: ["eating", "aggression"] },
  { id: "4", title: "Dino Leitor", thumbnail: dinoImg, type: "video", tags: ["sleeping", "sharing", "jealousy"] },
  { id: "5", title: "Amigos da Floresta", thumbnail: lionImg, type: "video", tags: ["sharing", "aggression"] }, // Reusing img for demo
  { id: "6", title: "Mundo Subaquático", thumbnail: rocketImg, type: "video", tags: ["change", "sleeping"] }, // Reusing img for demo
];

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [childName, setChildName] = useState("");
  const [selectedBehaviors, setSelectedBehaviors] = useState<string[]>([]);
  const [playlist, setPlaylist] = useState<Content[]>(ALL_CONTENT.slice(0, 4)); // Default content
  const [, setLocation] = useLocation();

  const login = (email: string) => {
    setUser({ email });
    setLocation("/kids");
  };

  const logout = () => {
    setUser(null);
    setLocation("/");
  };

  const updateSettings = (name: string, behaviors: string[]) => {
    setChildName(name);
    setSelectedBehaviors(behaviors);
    
    // Simple mock algorithm to "filter" content based on behaviors
    // In a real app, this would query a backend
    let newPlaylist = ALL_CONTENT;
    if (behaviors.length > 0) {
      // Prioritize content that matches tags
      newPlaylist = [...ALL_CONTENT].sort((a, b) => {
        const aMatch = a.tags.some(t => behaviors.includes(t));
        const bMatch = b.tags.some(t => behaviors.includes(t));
        return (bMatch ? 1 : 0) - (aMatch ? 1 : 0);
      });
    }
    setPlaylist(newPlaylist.slice(0, 6)); // Keep top 6
  };

  return (
    <AppContext.Provider value={{ user, childName, selectedBehaviors, playlist, login, logout, updateSettings }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
