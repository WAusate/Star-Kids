import { useState } from "react";
import { useApp } from "../lib/store";
import { useLocation } from "wouter";
import { Settings, Lock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useDeviceDetection } from "@/hooks/use-device-detection";

// Import images
import headerLogo from "@assets/Logo_PEEI_(1)_1766726369234.png";
import universeBg from "@assets/Fundo_imagem_1766726108333.png";
import desenhosImg from "@assets/generated_images/cartoon_tv_with_happy_kids.png";
import jogosImg from "@assets/generated_images/cartoon_game_controller_with_portals.png";
import musicasImg from "@assets/generated_images/cartoon_guitar_and_drum.png";
import historiasImg from "@assets/generated_images/open_magical_storybook_with_dragons.png";

type Category = "desenhos" | "jogos" | "musicas" | "historias";

export default function KidsDashboard() {
  const { childName, user } = useApp();
  const [, setLocation] = useLocation();
  const [gateOpen, setGateOpen] = useState(false);
  const [gateAnswer, setGateAnswer] = useState("");
  const { isTouch, isMobile, isSmallScreen } = useDeviceDetection();

  const mathProblem = "3 + 2";
  const correctAnswer = "5";

  const handleGateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gateAnswer.trim() === correctAnswer) {
      setGateOpen(false);
      setGateAnswer("");
      setLocation("/parent");
    } else {
      toast({ title: "Ops!", description: "Tente novamente.", variant: "destructive" });
    }
  };


  if (!user) {
    setLocation("/");
    return null;
  }

  // Determinar se mostra o menu "Jogos"
  // Mostra em: dispositivos com touch OU telas pequenas/móveis
  // Esconde em: telas grandes sem touch (Smart TV, desktop sem mouse)
  const showJogos = isTouch || isMobile || isSmallScreen;

  const allCategories = [
    { id: "desenhos", label: "DESENHOS", img: desenhosImg },
    { id: "jogos", label: "JOGOS", img: jogosImg },
    { id: "musicas", label: "MÚSICAS", img: musicasImg },
    { id: "historias", label: "HISTÓRIAS", img: historiasImg },
  ];

  // Filtrar categorias baseado na detecção de dispositivo
  const categories = showJogos 
    ? allCategories 
    : allCategories.filter(cat => cat.id !== "jogos");

  const handleCategoryClick = (categoryId: string) => {
    setLocation(`/category/${categoryId}`);
  };

  return (
    <div className="min-h-screen relative bg-background">
      {/* Background elements */}
      <div 
        className="fixed inset-0 bg-cover bg-center opacity-100 pointer-events-none z-0"
        style={{ backgroundImage: `url(${universeBg})` }}
      />
      

      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-gradient-to-b from-blue-500/80 to-blue-700/80 py-1 md:py-2 px-6 z-20 shadow-lg flex items-center justify-between">
        <div className="flex-1">
          <img src={headerLogo} alt="StarKids Logo" className="h-24 md:h-32 w-auto object-contain" />
        </div>
        <h1 className="text-3xl md:text-5xl font-heading text-center leading-none text-white flex-1">
          EI, {childName ? childName.toUpperCase() + "!" : "AMIGO!"}
        </h1>
        <div className="flex-1 flex justify-end">
          <button
            className="p-1.5 rounded-full bg-white/70 shadow-md text-blue-400 border-2 border-white hover:scale-105 transition-transform"
            onClick={() => setGateOpen(true)}
            data-testid="button-settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>
      <div className="h-28 md:h-36" />

      <main className="relative p-6 md:p-12 max-w-4xl mx-auto z-10">
        <div className="flex flex-col md:grid md:grid-cols-4 gap-0 md:gap-60">
          {categories.map((cat) => (
            <div key={cat.id} className="flex flex-col items-center pt-2">
              <button
                onClick={() => handleCategoryClick(cat.id)}
                className="relative group w-70 h-70 md:w-70 md:h-70 transition-all duration-300 hover:scale-110 active:scale-95 animate-float"
                data-testid={`button-category-${cat.id}`}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <img src={cat.img} alt={cat.label} className="w-full h-full object-contain drop-shadow-2xl filter brightness-110" />
                </div>
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Parent Gate Modal */}
      <Dialog open={gateOpen} onOpenChange={setGateOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-[3rem] border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-center font-heading text-3xl text-primary">ÁREA DOS PAIS</DialogTitle>
            <DialogDescription className="text-center text-lg">Quanto é {mathProblem}?</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleGateSubmit} className="space-y-6 mt-4">
            <div className="flex justify-center">
              <Input type="number" value={gateAnswer} onChange={(e) => setGateAnswer(e.target.value)} className="text-center text-5xl font-bold w-40 h-24 rounded-3xl bg-muted border-4 border-primary/10" placeholder="?" autoFocus data-testid="input-gate-answer" />
            </div>
            <div className="flex justify-center gap-4">
              <Button type="button" variant="ghost" className="text-lg" onClick={() => setGateOpen(false)} data-testid="button-cancel-gate">Sair</Button>
              <Button type="submit" className="rounded-2xl px-12 h-16 text-xl font-heading bg-primary text-white hover:bg-primary/90" data-testid="button-submit-gate">ENTRAR <Lock className="ml-2 w-6 h-6" /></Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
