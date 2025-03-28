
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate sending reset password email
    setTimeout(() => {
      setIsLoading(false);
      setEmailSent(true);
      toast.success("Link de redefinição de senha enviado para seu e-mail");
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/50">
      <div className="w-full max-w-md px-8 py-12">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-semibold tracking-tight">Redefinir Senha</h1>
          <p className="text-muted-foreground mt-2">Digite seu e-mail para receber um link de redefinição de senha</p>
        </div>
        
        <Card className="w-full max-w-md mx-auto overflow-hidden animate-scale-in glassmorphism">
          {!emailSent ? (
            <>
              <CardHeader>
                <CardTitle className="text-2xl font-medium">Redefina sua senha</CardTitle>
                <CardDescription>
                  Digite seu endereço de e-mail e enviaremos um link para redefinir sua senha
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" placeholder="m.scott@exemplo.com" required />
                  </div>
                  <Button type="submit" className="w-full group" disabled={isLoading}>
                    {isLoading ? "Enviando..." : (
                      <>
                        Enviar Link de Redefinição <Mail className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle className="text-2xl font-medium">Verifique seu e-mail</CardTitle>
                <CardDescription>
                  Enviamos um link de redefinição de senha para seu endereço de e-mail
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <div className="py-4">
                  <Mail className="mx-auto h-12 w-12 text-primary" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Verifique sua caixa de entrada para o link de redefinição de senha. Pode levar alguns minutos para chegar.
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/")}
                >
                  Voltar para Login
                </Button>
              </CardContent>
            </>
          )}
          <CardFooter className="flex justify-center py-4 text-xs text-muted-foreground">
            Lembrou sua senha? <Button variant="link" className="px-2 text-xs" onClick={() => navigate("/")}>Entrar</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
