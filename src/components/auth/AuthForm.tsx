
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function AuthForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState("student");
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Login realizado com sucesso");
      navigate("/dashboard");
    }, 1000);
  };
  
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate signup process
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Conta criada com sucesso");
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <Card className="w-full max-w-lg mx-auto overflow-hidden animate-scale-in glassmorphism">
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Entrar
          </TabsTrigger>
          <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Cadastrar
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <CardHeader>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="m.scott@exemplo.com" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Button 
                    type="button" 
                    variant="link" 
                    className="px-0 text-xs" 
                    onClick={() => navigate("/reset-password")}
                  >
                    Esqueceu a senha?
                  </Button>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full group" disabled={isLoading}>
                {isLoading ? "Entrando..." : (
                  <>
                    Entrar <LogIn className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="signup">
          <CardHeader>
            <CardTitle className="text-2xl font-medium">Criar uma conta</CardTitle>
            <CardDescription>
              Insira seus dados para começar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nome</Label>
                  <Input id="firstName" placeholder="Michael" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Sobrenome</Label>
                  <Input id="lastName" placeholder="Scott" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Eu sou</Label>
                <RadioGroup 
                  defaultValue="student" 
                  className="flex space-x-4"
                  onValueChange={setUserType}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student">Estudante</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="professor" id="professor" />
                    <Label htmlFor="professor">Professor</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="idNumber">Número</Label>
                <Input id="idNumber" placeholder={userType === "student" ? "S12345" : "P12345"} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="institution">Instituição</Label>
                <Input id="institution" placeholder="Nome da universidade" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="m.scott@exemplo.com" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input id="confirmPassword" type="password" required />
              </div>
              
              <Button type="submit" className="w-full group" disabled={isLoading}>
                {isLoading ? "Criando conta..." : (
                  <>
                    Criar Conta <UserPlus className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </TabsContent>
      </Tabs>
      <CardFooter className="flex justify-center py-4 text-xs text-muted-foreground">
        Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade
      </CardFooter>
    </Card>
  );
}
