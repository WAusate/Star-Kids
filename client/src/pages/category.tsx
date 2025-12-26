import { useLocation, useRoute } from "wouter";
import { ArrowLeft, Play, Home } from "lucide-react";
import { useApp } from "../lib/store";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import headerLogo from "@assets/Logo_PEEI_(1)_1766726369234.png";
import universeBg from "@assets/Fundo_imagem_1766726108333.png";

type CategoryType = "desenhos" | "jogos" | "musicas" | "historias";

interface CategoryInfo {
  title: string;
  description: string;
  color: string;
  colorClass: string;
  gradient: string;
}

const categoryInfo: Record<CategoryType, CategoryInfo> = {
  desenhos: {
    title: "DESENHOS",
    description: "Desenhos animados divertidos",
    color: "#FF8C42",
    colorClass: "from-orange-500 to-orange-600",
    gradient: "bg-gradient-to-b from-orange-500/10 to-transparent",
  },
  jogos: {
    title: "JOGOS",
    description: "Jogos educativos e divertidos",
    color: "#FF6B35",
    colorClass: "from-red-500 to-orange-500",
    gradient: "bg-gradient-to-b from-red-500/10 to-transparent",
  },
  musicas: {
    title: "MÚSICAS",
    description: "Músicas e clipes musicais infantis",
    color: "#FFB84D",
    colorClass: "from-yellow-400 to-orange-400",
    gradient: "bg-gradient-to-b from-yellow-400/10 to-transparent",
  },
  historias: {
    title: "HISTÓRIAS",
    description: "Histórias mágicas para dormir",
    color: "#FF8C42",
    colorClass: "from-purple-500 to-pink-500",
    gradient: "bg-gradient-to-b from-purple-500/10 to-transparent",
  },
};

export default function CategoryPage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/category/:id");
  const { playlist } = useApp();
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<any>(null);

  const categoryId = (params?.id || "desenhos") as CategoryType;
  const info = categoryInfo[categoryId];

  const handlePlay = (content: any) => {
    setCurrentVideo(content);
    setVideoModalOpen(true);
  };

  return (
    <div className="min-h-screen relative bg-background">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center opacity-100 pointer-events-none z-0"
        style={{ backgroundImage: `url(${universeBg})` }}
      />

      {/* Header */}
      <header className={`fixed top-0 left-0 w-full bg-gradient-to-r ${info.colorClass}/80 to-background/80 backdrop-blur-lg h-20 md:h-24 px-6 z-50 shadow-2xl border-b border-white/10 flex items-center gap-4`}>
        <button
          onClick={() => setLocation("/kids")}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all flex-none border border-white/20"
        >
          <Home className="w-6 h-6" />
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-3xl md:text-5xl font-heading leading-none text-white">
            {info.title}
          </h1>
        </div>
        <div className="w-12 h-12 md:w-16 md:h-16 flex-none">
          <img src={headerLogo} alt="StarKids" className="w-full h-full object-contain" />
        </div>
      </header>

      <main className="relative pt-26 md:pt-32 p-6 md:p-12 max-w-7xl mx-auto z-10">
        {/* Category Title Section */}
        <div className={`${info.gradient} rounded-3xl p-8 mb-12 border-2 border-white/10 backdrop-blur-sm`}>
          <h2 className="text-4xl md:text-6xl font-heading text-white mb-2">
            {info.title}
          </h2>
          <p className="text-xl md:text-2xl text-white/80">
            {info.description}
          </p>
        </div>

        {/* Content Grid - Netflix Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {playlist.slice(0, 12).map((item) => (
            <div
              key={item.id}
              className="netflix-card group relative aspect-[9/12] rounded-2xl overflow-hidden cursor-pointer bg-white shadow-lg hover:shadow-2xl border-2 border-white/20"
              onClick={() => handlePlay(item)}
              data-testid={`card-content-${item.id}`}
            >
              {/* Thumbnail */}
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-heading text-lg font-bold line-clamp-2 mb-3">
                  {item.title}
                </h3>
                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Play className="w-6 h-6 ml-0.5 fill-primary text-primary" />
                </div>
              </div>

              {/* Play Button - Always Visible on Mobile */}
              <div className="md:hidden absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                  <Play className="w-8 h-8 ml-1 fill-primary text-primary" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Video Modal */}
      <Dialog open={videoModalOpen} onOpenChange={setVideoModalOpen}>
        <DialogContent className="max-w-5xl w-full h-[85vh] bg-black p-0 border-0 rounded-[4rem] overflow-hidden">
          <div className="absolute top-6 right-6 z-50">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full h-16 w-16 bg-white/20 text-white hover:bg-white/30"
              onClick={() => setVideoModalOpen(false)}
              data-testid="button-close-video"
            >
              ✕
            </Button>
          </div>
          <div className="flex-1 flex items-center justify-center bg-zinc-900 relative">
            {currentVideo && (
              <>
                <img
                  src={currentVideo.thumbnail}
                  className="absolute inset-0 w-full h-full object-cover opacity-20 blur-xl"
                />
                <div className="z-10 text-center">
                  <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                    <Play className="w-16 h-16 text-white ml-2 fill-white" />
                  </div>
                  <h2 className="text-white text-5xl font-heading mb-4 tracking-wide">
                    {currentVideo.title}
                  </h2>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
