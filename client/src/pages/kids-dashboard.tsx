import { useState } from "react";
import { useApp } from "../lib/store";
import { Link, useLocation } from "wouter";
import { Settings, Play, Lock, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export default function KidsDashboard() {
  const { childName, playlist, user } = useApp();
  const [, setLocation] = useLocation();
  const [gateOpen, setGateOpen] = useState(false);
  const [gateAnswer, setGateAnswer] = useState("");
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<any>(null);

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

  // Redirect if not logged in
  if (!user) {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10 border-b border-border/40">
        <div>
          <h1 className="text-3xl font-heading text-primary drop-shadow-sm">
            Olá, {childName || "Amiguinho"}!
          </h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-muted text-muted-foreground"
          onClick={() => setGateOpen(true)}
        >
          <Settings className="w-6 h-6" />
        </Button>
      </header>

      {/* Content Grid */}
      <main className="p-4 md:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {playlist.map((item) => (
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
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-10 h-10 text-primary ml-1 fill-primary" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <h3 className="text-white font-heading text-2xl drop-shadow-md">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
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
             {/* Mock Video Player */}
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
