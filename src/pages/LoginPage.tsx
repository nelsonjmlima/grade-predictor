
import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/50">
      <div className="w-full max-w-md px-8 py-12">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-semibold tracking-tight">Welcome</h1>
          <p className="text-muted-foreground mt-2">Sign in to access Students Data</p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
