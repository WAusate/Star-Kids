import { useState, useEffect } from "react";
import { useApp, BEHAVIORS } from "../lib/store";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Save, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export default function ParentSettings() {
  const { childName: storedName, selectedBehaviors: storedBehaviors, updateSettings, logout, user } = useApp();
  const [, setLocation] = useLocation();

  const [name, setName] = useState(storedName);
  const [selected, setSelected] = useState<string[]>(storedBehaviors);

  // Sync with store on mount (in case accessed directly)
  useEffect(() => {
     setName(storedName);
     setSelected(storedBehaviors);
  }, [storedName, storedBehaviors]);

  if (!user) {
    setLocation("/");
    return null;
  }

  const toggleBehavior = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((b) => b !== id);
      } else {
        if (prev.length >= 3) {
          toast({
             title: "Limite atingido",
             description: "Selecione no máximo 3 comportamentos para focar.",
             variant: "destructive"
          });
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const handleSave = () => {
    updateSettings(name, selected);
    toast({
      title: "Configurações salvas!",
      description: "A playlist foi atualizada com sucesso.",
    });
    setLocation("/kids");
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/kids">
             <Button variant="ghost" className="gap-2 rounded-xl text-muted-foreground">
               <ArrowLeft className="w-5 h-5" /> Voltar
             </Button>
          </Link>
          <Button variant="outline" className="text-destructive hover:bg-destructive/10 border-destructive/20 rounded-xl" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Sair
          </Button>
        </div>

        <h1 className="text-3xl font-heading text-foreground">Configurações dos Pais</h1>

        {/* Child Profile */}
        <Card className="rounded-3xl border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Perfil da Criança</CardTitle>
            <CardDescription>Personalize a experiência.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="childName">Nome da criança (opcional)</Label>
              <Input
                id="childName"
                placeholder="Ex: João"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 rounded-xl bg-muted/50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Behaviors */}
        <Card className="rounded-3xl border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Comportamentos para Trabalhar</CardTitle>
            <CardDescription>
              Selecione até 3. O app irá sugerir conteúdos educativos relacionados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BEHAVIORS.map((behavior) => {
                const isSelected = selected.includes(behavior.id);
                return (
                  <div
                    key={behavior.id}
                    onClick={() => toggleBehavior(behavior.id)}
                    className={`
                      flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${isSelected 
                        ? "border-primary bg-primary/5 shadow-md" 
                        : "border-transparent bg-muted/40 hover:bg-muted/60"}
                    `}
                  >
                    <Checkbox checked={isSelected} className="rounded-md border-2 border-muted-foreground/30 data-[state=checked]:border-primary data-[state=checked]:bg-primary" />
                    <div className="flex-1 font-medium text-sm flex items-center gap-2">
                      <span className="text-xl" role="img" aria-label={behavior.label}>{behavior.icon}</span>
                      {behavior.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="w-full h-14 text-lg font-heading rounded-2xl shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-[1.01]">
          <Save className="mr-2 w-5 h-5" /> Atualizar Playlist
        </Button>
      </div>
    </div>
  );
}
