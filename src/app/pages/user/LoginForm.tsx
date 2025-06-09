"use client";

import { useState, useTransition } from "react";
import { setupAuthClient } from "@/lib/auth-client";
import { link } from "@/app/shared/links";
import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from 'react-icons/fa';

interface LoginFormProps {
  authUrl: string;
  mode?: 'login' | 'signup';
}

interface SocialProvider {
  id: 'google' | 'github';
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  bgColor: string;
  hoverColor: string;
  textColor: string;
  borderColor: string;
}

const socialProviders: SocialProvider[] = [
  {
    id: 'google',
    name: 'Google',
    icon: FaGoogle,
    bgColor: 'bg-white',
    hoverColor: 'hover:bg-gray-50',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-300'
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: FaGithub,
    bgColor: 'bg-white',
    hoverColor: 'hover:bg-gray-50',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-300'
  }
];

export function LoginForm({ authUrl, mode = 'signup' }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  const [isPending, startTransition] = useTransition();
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const authClient = setupAuthClient(authUrl);

  const isLogin = mode === 'login';
  const content = {
    title: isLogin ? 'Sign in to your account' : 'Create your free account',
    socialAction: isLogin ? 'Sign in with' : 'Sign up with',
    submitButton: isLogin ? 'Sign In' : 'Sign Up',
    switchText: isLogin ? "Don't have an account?" : 'Already have an account?',
    switchAction: isLogin ? 'Sign Up' : 'Sign In',
    switchUrl: isLogin ? '/signup' : '/login'
  };

  const handleSignUp = () => {
    if (!name || !email || !password) {
      setError("All fields are required for sign up");
      return;
    }

    startTransition(() => {
      authClient.signUp.email(
        {
          email,
          password,
          name,
        },
        {
          onRequest: () => {
            setResult("Signing up...");
            setError('');
          },
          onSuccess: () => {
            setResult("Signup successful!");
            window.location.href = link("/");
          },
          onError: (ctx) => {
            console.log("signup error", ctx.error);
            setError(ctx.error.message || 'Signup failed');
            setResult('');
          },
        },
      );
    });
  };

  const handleLogin = () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    startTransition(() => {
      authClient.signIn.email(
        {
          email,
          password,
        },
        {
          onRequest: () => {
            setResult("Logging in...");
            setError('');
          },
          onSuccess: () => {
            setResult("Login successful!");
            console.log("Login successful!");
            window.location.href = link("/");
          },
          onError: (ctx) => {
            console.log("login error", ctx.error);
            setError(ctx.error.message || 'Login failed');
            setResult('');
          },
        },
      );
    });
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    isLogin ? handleLogin() : handleSignUp();
  };

  const handleSocialLogin = async (providerId: 'google' | 'github') => {
    setSocialLoading(providerId);
    setError('');
    setResult('');

    try {
      await authClient.signIn.social({
        provider: providerId,
        callbackURL: "/api/auth/callback/google",
        errorCallbackURL: "/login?error=social_auth_failed",
      });
    } catch (err) {
      setError('Failed to initialize social login');
      setSocialLoading(null);
      console.error('Social login error:', err);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      {/* Header with Logo */}
      <div className="text-center mb-4 flex items-center justify-center">
        <img src="/logo.png" alt="Hallway Logo" className="w-16 h-16 mr-3" />
      </div>
      
      <div className="bg-white py-8 px-4 sm:px-10">
        {/* Title */}
        <h2 className="text-2xl font-medium text-center text-gray-700 mb-6">{content.title}</h2>
        
        {/* Social Login Options */}
        <div className="space-y-3">
          {socialProviders.map((provider) => {
            const Icon = provider.icon;
            const isLoading = socialLoading === provider.id;
            
            return (
              <button
                key={provider.id}
                onClick={() => handleSocialLogin(provider.id)}
                disabled={isLoading || socialLoading !== null}
                className={`
                  w-full flex justify-center items-center px-4 py-2 border ${provider.borderColor} rounded-md text-sm font-medium
                  ${provider.bgColor} ${provider.hoverColor} ${provider.textColor}
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors duration-200
                `}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                ) : (
                  <>
                    <Icon className="h-5 w-5 mr-2" />
                    {content.socialAction} {provider.name}
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">OR</span>
            </div>
          </div>
        </div>

        {/* Email/Password Form */}
        <form className="space-y-4" onSubmit={handleEmailAuth}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {result && !error && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700">{result}</div>
            </div>
          )}

          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your name"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
                placeholder="•••••••"
              />
              <button 
                type="button" 
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-4 w-4" />
                ) : (
                  <FaEye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending || socialLoading !== null}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                content.submitButton
              )}
            </button>
          </div>
        </form>

        {/* Terms of Service - only show for signup */}
        {!isLogin && (
          <div className="mt-4 text-xs text-center text-gray-500">
            By signing up, you agree to Pipedream's <a href="/terms" className="text-blue-500 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</a>.
          </div>
        )}

        {/* Switch between login/signup */}
        <div className="mt-6">
          <div className="text-center text-sm text-gray-600">
            {content.switchText}{' '}
            <a href={content.switchUrl} className="font-medium text-blue-500 hover:underline">
              {content.switchAction}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}