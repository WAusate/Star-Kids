import { useState } from "react";
import { useApp } from "../lib/store";
import { useLocation } from "wouter";
import { Settings, Play, Lock, X, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

// Import images
import bgImage from "@assets/generated_images/magical_floating_islands_without_rainbow.png";
import sunImg from "@assets/generated_images/happy_cartoon_sun_waving.png";
import desenhosImg from "@assets/generated_images/cartoon_tv_with_happy_kids.png";
import jogosImg from "@assets/generated_images/cartoon_game_controller_with_portals.png";
import musicasImg from "@assets/generated_images/cartoon_guitar_and_drum.png";
import historiasImg from "@assets/generated_images/open_magical_storybook_with_dragons.png";

type Category = "desenhos" | "jogos" | "musicas" | "historias";

export default function KidsDashboard() {
  const { childName, playlist, user } = useApp();
  const [, setLocation] = useLocation();
  const [gateOpen, setGateOpen] = useState(false);
  const [gateAnswer, setGateAnswer] = useState("");
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

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

  const handlePlay = (content: any) => {
    setCurrentVideo(content);
    setVideoModalOpen(true);
  };

  if (!user) {
    setLocation("/");
    return null;
  }

  const categories = [
    { id: "desenhos", label: "DESENHOS", img: desenhosImg, color: "bg-blue-500" },
    { id: "jogos", label: "JOGOS", img: jogosImg, color: "bg-green-500" },
    { id: "musicas", label: "MÚSICAS", img: musicasImg, color: "bg-orange-500" },
    { id: "historias", label: "HISTÓRIAS", img: historiasImg, color: "bg-pink-500" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#87CEEB]">
      {/* Background elements */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      
      {/* Decorative Suns */}
      <img src={sunImg} className="absolute top-4 left-4 w-24 h-24 animate-bounce-sm" alt="Sun" />
      <img src={sunImg} className="absolute top-10 right-24 w-32 h-32 animate-pulse" alt="Sun" />
      <img src={sunImg} className="absolute top-48 right-4 w-20 h-20 animate-bounce-sm" alt="Sun" />

      {/* Cloud Header */}
      <header className="relative pt-6 flex flex-col items-center z-20">
        <div className="relative">
          {/* Cloud Shape Wrapper */}
          <div className="bg-white rounded-3xl px-8 py-3 shadow-xl border-b-4 border-blue-200/40">
            <h1 className="text-2xl md:text-4xl font-heading text-center leading-tight">
              <span className="text-pink-500 block">EI,</span>
              <span className="text-blue-600 block">AMIGO!</span>
            </h1>
          </div>
          
          {/* Settings Button */}
          <button
            className="fixed top-6 right-6 p-3 rounded-full bg-white shadow-xl text-blue-400 border-4 border-blue-50 hover:scale-110 transition-transform z-50"
            onClick={() => setGateOpen(true)}
          >
            <Settings className="w-8 h-8" />
          </button>
        </div>
      </header>

      <main className="relative p-6 md:p-12 max-w-4xl mx-auto z-10">
        {!selectedCategory ? (
          <div className="grid grid-cols-2 gap-x-8 gap-y-16">
            {categories.map((cat) => (
              <div key={cat.id} className="flex flex-col items-center pt-8">
                <button
                  onClick={() => setSelectedCategory(cat.id as Category)}
                  className="relative group w-40 h-40 md:w-48 md:h-48 transition-all duration-300 hover:scale-110 active:scale-95 animate-float"
                >
                  {/* Character/Object Image - Floating */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img src={cat.img} alt={cat.label} className="w-full h-full object-contain drop-shadow-2xl filter brightness-110" />
                  </div>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="animate-in zoom-in-95 duration-500">
            <div className="flex items-center gap-4 mb-8">
              <button 
                onClick={() => setSelectedCategory(null)}
                className="bg-white p-4 rounded-full shadow-lg hover:scale-110 active:scale-90 transition-all border-4 border-primary/10"
              >
                <ArrowLeft className="w-8 h-8 text-primary" strokeWidth={4} />
              </button>
              <div className="bg-white/90 px-8 py-3 rounded-full shadow-xl border-4 border-white">
                <h2 className="text-3xl font-heading text-primary">
                  {categories.find(c => c.id === selectedCategory)?.label}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {playlist.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handlePlay(item)}
                  className="group relative aspect-[4/3] rounded-[3rem] overflow-hidden cursor-pointer shadow-2xl bg-white border-[10px] border-white transition-all hover:scale-105"
                >
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <Play className="w-10 h-10 text-primary ml-1 fill-primary" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals remain the same but with larger fonts/buttons */}
      <Dialog open={gateOpen} onOpenChange={setGateOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-[3rem] border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-center font-heading text-3xl text-primary">ÁREA DOS PAIS</DialogTitle>
            <DialogDescription className="text-center text-lg">Quanto é {mathProblem}?</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleGateSubmit} className="space-y-6 mt-4">
            <div className="flex justify-center">
              <Input type="number" value={gateAnswer} onChange={(e) => setGateAnswer(e.target.value)} className="text-center text-5xl font-bold w-40 h-24 rounded-3xl bg-muted border-4 border-primary/10" placeholder="?" autoFocus />
            </div>
            <div className="flex justify-center gap-4">
              <Button type="button" variant="ghost" className="text-lg" onClick={() => setGateOpen(false)}>Sair</Button>
              <Button type="submit" className="rounded-2xl px-12 h-16 text-xl font-heading bg-primary text-white hover:bg-primary/90">ENTRAR <Lock className="ml-2 w-6 h-6" /></Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={videoModalOpen} onOpenChange={setVideoModalOpen}>
        <DialogContent className="max-w-5xl w-full h-[85vh] bg-black p-0 border-0 rounded-[4rem] overflow-hidden">
          <div className="absolute top-6 right-6 z-50">
            <Button size="icon" variant="secondary" className="rounded-full h-16 w-16 bg-white/20 text-white" onClick={() => setVideoModalOpen(false)}>
              <X className="w-10 h-10" />
            </Button>
          </div>
          <div className="flex-1 flex items-center justify-center bg-zinc-900 relative">
            {currentVideo && (
              <>
                <img src={currentVideo.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-20 blur-xl" />
                <div className="z-10 text-center">
                  <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                    <Play className="w-16 h-16 text-white ml-2 fill-white" />
                  </div>
                  <h2 className="text-white text-5xl font-heading mb-4 tracking-wide">{currentVideo.title}</h2>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
