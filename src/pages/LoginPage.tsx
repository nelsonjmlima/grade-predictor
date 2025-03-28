
import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div 
      className="min-h-screen w-full flex items-center justify-end p-4 bg-cover bg-center"
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="flex flex-col items-center justify-center w-full md:w-2/5 lg:w-1/3 h-full pr-6 pl-6">
        <div className="text-center w-full mb-8 animate-fade-in">
          <h1 className="text-3xl font-semibold tracking-tight text-white">Grade Predictor</h1>
          <p className="text-gray-200 mt-2">Analyze GitLab metrics to predict student success</p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
