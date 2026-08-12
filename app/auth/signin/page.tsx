'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { authService } from '@/services/authService';
import { setCredentials } from '@/store/slices/authSlice';
import { DecodedToken } from '@/types/auth';
import { UserRole } from '@/types/api';
import { AxiosError } from 'axios';
//import { UserRole } from '@/types/auth';

export default function SignInPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { isAuthenticated, user } = useAppSelector(
    (state) => state.auth
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [resetStep, setResetStep] = useState<"email" | "code">("email");

  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

  // --------------------------------------------------
  // Redirect if already authenticated
  // --------------------------------------------------
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    if (user.role === 'admin') {
      router.replace('/admin');
    } else {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  const validateForm = () => {
    if (!email.trim()) {
      setError('Email is required.');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format.');
      return false;
    }

    if (password.length < 6) {
      setError(
        'Password must contain at least 6 characters.'
      );
      return false;
    }

    return true;
  };

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');

      const response = await authService.login({
        email,
        password,
      });

      // Store in redux (and persist via slice)
      dispatch(setCredentials({ token: response.token }));

      // Decode only for routing decision
      const decoded = jwtDecode<DecodedToken>(
        response.token
      );

      const role = decoded.user.role as UserRole;

      if (role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;

      setError(
        error.response?.data?.message ??
        'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetCode = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setResetLoading(true);
      setResetError("");
      setResetSuccess("");

      await authService.sendResetCode(resetEmail);

      setResetSuccess(
        "Reset code sent successfully. Check your email."
      );

      setResetStep("code");

    } catch (error) {
      console.error(error);

      setResetError(
        "Unable to send reset code. Please check your email."
      );
    } finally {
      setResetLoading(false);
    }
  };

  const handleVerifyResetCode = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setResetError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setResetLoading(true);
      setResetError("");
      setResetSuccess("");

      await authService.verifyResetCode({
        email: resetEmail,
        resetCode,
        newPassword,
      });

      setResetSuccess(
        "Password reset successfully. You can now login."
      );

      setTimeout(() => {
        setShowForgotPassword(false);

        setResetStep("email");
        setResetEmail("");
        setResetCode("");
        setNewPassword("");
        setConfirmPassword("");

      }, 2000);


    } catch (error) {
      console.error(error);

      setResetError(
        "Invalid reset code or email."
      );

    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="bg-surface text-neutral min-h-screen flex items-center justify-center p-4 md:p-8">
      <main className="w-full max-w-[1280px] grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-[2rem] shadow-lg bg-white">
        {/* Brand Side */}
        <section className="hidden lg:flex lg:col-span-5 relative overflow-hidden bg-primary items-center justify-center p-12">
          <div className="absolute inset-0 z-0 opacity-40">
            <img
              className="w-full h-full object-cover"
              alt="Green monstera leaves"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBW5h7Fh_e1emJ90HlJ9wPS_nzr9bfYnk5ii95nyEwblbTA6Z-H5Z4vJnX6kCP5NoF2POR7Jyy28OMojg9NPQA12lT3egEIGtuuRwtna1vsP8cHJxV1MKap7xLA7S9C5Y_TIcPGQivGfqBHjzoJPCwuOkWz5PGSkgNQhKNoXH3f9q44MLloPO7fqXKngIVkRLFpk3QxbKYDGqymhggnuIcpx_ORUkC4_yUmgCZrLHI3QCTLIzdT5lD0iSeeueVAxM8YTgQL6gslSyUE"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-primary via-primary/80 to-transparent z-10"></div>
          <div className="relative z-20 text-white space-y-8 max-w-sm">
            <div className="space-y-6 flex flex-col items-center z-20">
              <Link href="/">
                <img alt="Colibris Logo" className="w-64 h-64 object-contain filter brightness-0 invert mb-2"
                  src="/logo_vertical_+_tagline_blanc_rvb.png" />
              </Link>
              <p className="text-lg font-medium opacity-80 leading-relaxed max-w-[280px]">Pioneering the Biophilic
                approach to sustainable living.</p>
            </div>
            <div className="pt-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">eco</span>
                </div>
                <div>
                  <p className="font-bold text-lg">Sustainable by Design</p>
                  <p className="text-sm opacity-70">Every interaction contributes to our global recycling goal.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">auto_awesome</span>
                </div>
                <div>
                  <p className="font-bold text-lg">Privacy First</p>
                  <p className="text-sm opacity-70">Your data stays yours. No tracking, no selling.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">verified</span>
                </div>
                <div>
                  <p className="font-bold text-lg">Community Driven</p>
                  <p className="text-sm opacity-70">Join 5k+ members committed to circular living.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form Side */}
        <section className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center">
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-neutral">Welcome Back</h2>
              <p className="text-neutral/70">Sign in to your account to continue your circular journey.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-bold uppercase tracking-widest text-neutral/60">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-bold uppercase tracking-widest text-neutral/60">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
                  required
                />
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 rounded border-border text-primary" />
                  <span className="text-neutral/70">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(true);
                    setResetError("");
                    setResetSuccess("");
                  }}
                  className="text-primary hover:text-primary-700 font-semibold"
                >
                  Forgot password?
                </button>
              </div>
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}
              {/* Sign In Button */}
              <Button
                type="submit"
                size="lg"
                variant="primary"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[400px] border-t border-border"></div>
              </div>
              {/*
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-neutral/60">Or continue with</span>
              </div>*/}
            </div>

            {/* Social Buttons 
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" size="md">
                <span className="material-symbols-outlined mr-2">mail</span>
                Google
              </Button>
              <Button variant="outline" size="md">
                <span className="material-symbols-outlined mr-2">mail</span>
                Apple
              </Button>
            </div>*/}

            {/* Sign Up Link */}
            <p className="text-center text-neutral/70">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-primary font-bold hover:text-primary-700">
                Sign up
              </Link>
            </p>
          </div>
        </section>
        {showForgotPassword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6">

            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">

              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">
                  Forgot Password
                </h3>

                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="text-neutral/50 hover:text-neutral"
                >
                  ✕
                </button>
              </div>


              {resetStep === "email" ? (

                <form
                  onSubmit={handleSendResetCode}
                  className="space-y-5"
                >

                  <p className="text-neutral/70">
                    Enter your email address and we will send you a reset code.
                  </p>


                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) =>
                      setResetEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border"
                    required
                  />


                  <Button
                    type="submit"
                    className="w-full"
                    disabled={resetLoading}
                  >
                    {resetLoading
                      ? "Sending..."
                      : "Send Code"}
                  </Button>

                </form>


              ) : (

                <form
                  onSubmit={handleVerifyResetCode}
                  className="space-y-5"
                >

                  <p className="text-neutral/70">
                    Enter the reset code sent to:
                    <br />
                    <strong>{resetEmail}</strong>
                  </p>


                  <input
                    type="text"
                    value={resetCode}
                    onChange={(e) =>
                      setResetCode(e.target.value)
                    }
                    placeholder="Reset code"
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border"
                    required
                  />


                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(e.target.value)
                    }
                    placeholder="New password"
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border"
                    required
                  />


                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border"
                    required
                  />


                  <Button
                    type="submit"
                    className="w-full"
                    disabled={resetLoading}
                  >
                    {resetLoading
                      ? "Resetting..."
                      : "Reset Password"}
                  </Button>

                </form>

              )}


              {resetError && (
                <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                  {resetError}
                </div>
              )}


              {resetSuccess && (
                <div className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-600">
                  {resetSuccess}
                </div>
              )}

            </div>

          </div>
        )}
      </main>
    </div>
  )
}
