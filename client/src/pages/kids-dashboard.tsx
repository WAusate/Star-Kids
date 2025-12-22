import { useState } from "react";
import { useApp } from "../lib/store";
import { useLocation } from "wouter";
import { Settings, Play, Lock, X, Tv, Gamepad2, Music, BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

type Category = "desenhos" | "jogos" | "musicas" | "historias";

export default function KidsDashboard() {
  const { childName, playlist, user } = useApp();
  const [, setLocation] = useLocation();
  const [gateOpen, setGateOpen] = useState(false);
  const [gateAnswer, setGateAnswer] = useState("");
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Security gate for parents
  const mathProblem = "3 + 2";
  const correctAnswer = "5";

  const handleGateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gateAnswer.trim() === correctAnswer) {
      setGateOpen(false);
      setGateAnswer("");
      setLocation("/parent");
    } else {
      toast({
        title: "Ops!",
        description: "Tente novamente.",
        variant: "destructive",
      });
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
    { id: "desenhos", label: "Desenhos Animados", icon: Tv, color: "bg-blue-400", hover: "hover:bg-blue-500", animation: "animate-bounce" },
    { id: "jogos", label: "Jogos", icon: Gamepad2, color: "bg-green-400", hover: "hover:bg-green-500", animation: "animate-pulse" },
    { id: "musicas", label: "Músicas", icon: Music, color: "bg-yellow-400", hover: "hover:bg-yellow-500", animation: "animate-bounce [animation-delay:200ms]" },
    { id: "historias", label: "Histórias", icon: BookOpen, color: "bg-purple-400", hover: "hover:bg-purple-500", animation: "animate-pulse [animation-delay:400ms]" },
  ];

  const filteredPlaylist = selectedCategory 
    ? playlist.slice(0, 6) 
    : null;

  return (
    <div className="min-h-screen bg-background pb-8 overflow-x-hidden">
      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-transparent sticky top-0 z-10">
        <div className="flex items-center gap-3">
          {selectedCategory && (
            <Button 
              variant="ghost" 
              onClick={() => setSelectedCategory(null)}
              className="rounded-full h-14 w-14 bg-white shadow-lg hover:bg-white/90 active:scale-90 transition-transform flex items-center justify-center"
            >
              <ArrowLeft className="w-8 h-8 text-primary" strokeWidth={3} />
            </Button>
          )}
          <h1 className="text-3xl md:text-4xl font-heading text-primary drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">
            {selectedCategory ? categories.find(c => c.id === selectedCategory)?.label : `Olá, ${childName || "Amiguinho"}!`}
          </h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-white/50 text-muted-foreground/30"
          onClick={() => setGateOpen(true)}
        >
          <Settings className="w-5 h-5" />
        </Button>
      </header>

      <main className="p-4 md:p-8 max-w-6xl mx-auto">
        {!selectedCategory ? (
          /* Main Menu: 4 Big Buttons */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as Category)}
                className={`
                  ${cat.color} ${cat.hover}
                  h-56 md:h-72 rounded-[3rem] flex flex-col items-center justify-center gap-4
                  transition-all active:scale-90 shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.15)] 
                  border-b-[12px] border-black/20 hover:border-b-[6px] hover:translate-y-[6px] active:border-b-0 active:translate-y-[12px]
                  relative overflow-hidden group
                `}
              >
                <div className={`bg-white/30 p-8 rounded-full shadow-inner ${cat.animation}`}>
                  <cat.icon className="w-20 h-20 md:w-24 md:h-24 text-white drop-shadow-lg" strokeWidth={3} />
                </div>
                <span className="text-white font-heading text-3xl md:text-4xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                  {cat.label}
                </span>
                
                {/* Visual "shine" effect */}
                <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-white/20 skew-x-[-25deg] group-hover:left-[150%] transition-all duration-700 ease-in-out" />
              </button>
            ))}
          </div>
        ) : (
          /* Category View: Content Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {filteredPlaylist?.map((item) => (
              <div
                key={item.id}
                onClick={() => handlePlay(item)}
                className="group relative aspect-[4/3] rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] bg-white border-4 border-white"
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-primary ml-1 fill-primary" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <h3 className="text-white font-heading text-xl drop-shadow-md">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Parent Gate Modal */}
      <Dialog open={gateOpen} onOpenChange={setGateOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl border-0">
          <DialogHeader>
            <DialogTitle className="text-center font-heading text-2xl text-secondary-foreground">
              Área dos Pais
            </DialogTitle>
            <DialogDescription className="text-center">
              Resolva para entrar: Quanto é {mathProblem}?
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleGateSubmit} className="space-y-4 mt-4">
            <div className="flex justify-center">
              <Input
                type="number"
                value={gateAnswer}
                onChange={(e) => setGateAnswer(e.target.value)}
                className="text-center text-3xl font-bold w-32 h-16 rounded-2xl bg-muted"
                placeholder="?"
                autoFocus
              />
            </div>
            <div className="flex justify-center gap-4">
               <Button type="button" variant="ghost" onClick={() => setGateOpen(false)}>Cancelar</Button>
               <Button type="submit" className="rounded-xl px-8 font-heading bg-secondary text-secondary-foreground hover:bg-secondary/90">
                 Entrar <Lock className="ml-2 w-4 h-4" />
               </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Video Player Modal (Mock) */}
      <Dialog open={videoModalOpen} onOpenChange={setVideoModalOpen}>
        <DialogContent className="max-w-4xl w-full h-[80vh] bg-black p-0 border-0 rounded-3xl overflow-hidden flex flex-col">
          <div className="absolute top-4 right-4 z-50">
             <Button 
               size="icon" 
               variant="secondary" 
               className="rounded-full h-12 w-12 bg-white/20 hover:bg-white/40 text-white border-0"
               onClick={() => setVideoModalOpen(false)}
             >
               <X className="w-8 h-8" />
             </Button>
          </div>
          <div className="flex-1 flex items-center justify-center bg-zinc-900 relative">
             {currentVideo && (
               <>
                <img src={currentVideo.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm" />
                <div className="z-10 text-center">
                   <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-sm">
                      <Play className="w-12 h-12 text-white ml-2 fill-white" />
                   </div>
                   <h2 className="text-white text-3xl font-heading mb-2">{currentVideo.title}</h2>
                   <p className="text-zinc-400">Simulação de Player de Vídeo</p>
                </div>
               </>
             )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ArrowLeft(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}
