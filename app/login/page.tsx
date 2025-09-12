"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const handleLogin = () => {
    setIsLoggingIn(true);
    // Simulate loading time before redirecting
    setTimeout(() => {
      router.push("/?fromLogin=true");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a284b] flex flex-col items-center justify-center py-6 sm:py-10 px-4">
      {/* Modal de redirección */}
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-11/12 sm:w-96 border-4 border-[#e7b10a]">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0a284b] mb-4 text-center">
          Disney Cruise Line
        </h2>

        {isLoggingIn ? (
          <>
            <div className="text-center mb-6">
              <p className="text-gray-700">Redirecting to the main page...</p>
            </div>

            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0a284b]"></div>
            </div>

            <div className="mt-6 flex justify-center">
              <div className="text-4xl">😃</div>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <p className="text-gray-700">Welcome to Disney Cruise Line</p>
            </div>

            <button 
              onClick={handleLogin}
              className="w-full bg-[#e7b10a] hover:bg-[#c99908] text-[#0a284b] font-bold py-3 px-4 rounded-lg shadow-md transition"
            >
              Login
            </button>

            <div className="mt-6 flex justify-center">
              <div className="text-4xl">😃</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}