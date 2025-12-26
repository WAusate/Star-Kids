import { useState, useEffect } from "react";

interface DeviceInfo {
  isTouch: boolean;
  isMobile: boolean;
  isSmallScreen: boolean;
}

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isTouch: false,
    isMobile: false,
    isSmallScreen: false,
  });

  useEffect(() => {
    // Detectar se é um dispositivo com touch
    const isTouch =
      typeof window !== "undefined" &&
      (("ontouchstart" in window) ||
        (navigator.maxTouchPoints > 0));

    // Detectar tamanho da tela
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const isMobile = width < 768; // md breakpoint no Tailwind
      const isSmallScreen = width < 1024; // lg breakpoint

      setDeviceInfo({
        isTouch,
        isMobile,
        isSmallScreen,
      });
    };

    checkScreenSize();

    // Adicionar listener para resize
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return deviceInfo;
}
