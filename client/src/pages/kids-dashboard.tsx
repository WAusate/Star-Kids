import { useState } from "react";
import { useApp } from "../lib/store";
import { useLocation } from "wouter";
import { Settings, Play, Lock, X, Tv, Gamepad2, Music, BookOpen, Star, Cloud, Sun, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import bgImage from "@assets/generated_images/magical_floating_island_background.png";

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
    { id: "desenhos", label: "DESENHOS", icon: Tv, color: "from-blue-400 to-blue-500", shadow: "shadow-blue-200" },
    { id: "jogos", label: "JOGOS", icon: Gamepad2, color: "from-green-400 to-green-500", shadow: "shadow-green-200" },
    { id: "musicas", label: "MÚSICAS", icon: Music, color: "from-yellow-400 to-yellow-500", shadow: "shadow-yellow-200" },
    { id: "historias", label: "HISTÓRIAS", icon: BookOpen, color: "from-purple-400 to-purple-500", shadow: "shadow-purple-200" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#E0F2FE]">
      {/* Whimsical Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      
      {/* Animated Floating Elements */}
      <div className="absolute top-10 left-10 animate-bounce duration-[3000ms] opacity-60"><Cloud className="w-16 h-16 text-white" /></div>
      <div className="absolute top-40 right-20 animate-pulse opacity-40"><Star className="w-8 h-8 text-yellow-400" /></div>
      <div className="absolute bottom-20 left-1/4 animate-bounce duration-[4000ms] opacity-50"><Cloud className="w-20 h-20 text-white" /></div>

      <header className="relative p-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-4">
          {selectedCategory && (
            <button 
              onClick={() => setSelectedCategory(null)}
              className="bg-white/90 p-3 rounded-full shadow-lg hover:scale-110 active:scale-90 transition-all border-4 border-primary/20"
            >
              <ArrowLeft className="w-8 h-8 text-primary" strokeWidth={4} />
            </button>
          )}
          <div className="bg-white/80 backdrop-blur-md px-6 py-2 rounded-full border-4 border-white shadow-xl">
            <h1 className="text-3xl md:text-5xl font-heading text-primary flex items-center gap-3">
              <Sun className="w-8 h-8 text-yellow-500 animate-spin-slow" />
              {selectedCategory ? categories.find(c => c.id === selectedCategory)?.label : `OI, ${childName || "AMIGUINHO"}!`}
            </h1>
          </div>
        </div>
        <button
          className="p-3 rounded-full bg-white/40 backdrop-blur-sm text-primary/40 hover:text-primary transition-colors"
          onClick={() => setGateOpen(true)}
        >
          <Settings className="w-6 h-6" />
        </button>
      </header>

      <main className="relative p-4 md:p-8 max-w-7xl mx-auto z-10">
        {!selectedCategory ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pt-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as Category)}
                className={`
                  relative group h-64 md:h-80 rounded-[4rem] bg-gradient-to-br ${cat.color}
                  border-[12px] border-white shadow-2xl transition-all duration-300
                  hover:scale-[1.05] active:scale-95 hover:-rotate-2
                  flex flex-col items-center justify-center overflow-hidden
                `}
              >
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-xl group-hover:scale-150 transition-transform" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-black/10 rounded-full blur-2xl" />

                <div className="bg-white/95 p-8 rounded-full shadow-2xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <cat.icon className="w-20 h-20 md:w-28 md:h-28 text-primary" strokeWidth={2.5} />
                </div>
                
                <h2 className="mt-6 text-white font-heading text-4xl md:text-5xl tracking-wide drop-shadow-2xl">
                  {cat.label}
                </h2>

                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 animate-in zoom-in-95 duration-500">
            {playlist.slice(0, 6).map((item) => (
              <div
                key={item.id}
                onClick={() => handlePlay(item)}
                className="group relative aspect-[4/3] rounded-[3rem] overflow-hidden cursor-pointer shadow-2xl bg-white border-[10px] border-white hover:border-primary/20 transition-all"
              >
                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white/90 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-12 h-12 text-primary ml-2 fill-primary" />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white font-heading text-3xl drop-shadow-lg">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

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
