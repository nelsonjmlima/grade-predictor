
import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-cover bg-center"
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="w-full max-w-md px-8 py-12">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-semibold tracking-tight text-white">Grade Predictor</h1>
          <p className="text-gray-200 mt-2">Analyze GitLab metrics to predict student success</p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
