import { AppContext } from "@/worker";
import { LoginForm } from "./LoginForm";

export function Signup({ ctx }: { ctx: AppContext }) {
  const { authUrl } = ctx;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm authUrl={authUrl} mode="signup" />
    </div>
  );
}