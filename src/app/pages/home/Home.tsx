import { RequestInfo } from "rwsdk/worker";
import { setupAuthClient } from "@/lib/auth-client";

export function Home({ ctx }: RequestInfo) {
  const user = ctx.user;
  const authClient = setupAuthClient("http://localhost:5173");

  const handleSignOut = () => {
    authClient.signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome</h1>
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-2 shadow-sm border">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                  {user.image ? (
                    <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-medium text-gray-600">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">{user.name || user.username}</span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <a
                href="/user/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </a>
              <a
                href="/user/signup"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign Up
              </a>
            </div>
          )}
        </header>

        <main>
          {user ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Dashboard</h2>
              <p className="text-gray-600">Welcome back! You're successfully logged in.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Get Started</h2>
              <p className="text-gray-600 mb-4">Sign in to access your account or create a new one to get started.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
