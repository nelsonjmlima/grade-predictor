
import { AuthForm } from "@/components/auth/AuthForm";
import { Logo } from "@/components/logo/Logo";

export default function LoginPage() {
  return (
    <div 
      className="min-h-screen w-full flex items-center justify-end bg-cover bg-center"
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 h-full py-8">
        <div className="w-full max-w-lg px-4">
          <div className="bg-black/50 p-6 rounded-lg shadow-lg mb-6">
            <div className="text-center animate-fade-in">
              <Logo size={72} className="mx-auto mb-4" />
              <p className="text-gray-200 mt-2">Analyze GitLab metrics to predict student success</p>
            </div>
          </div>
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
