'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { AxiosError } from 'axios'
import { authService } from '@/services/authService'
import LocationPicker from '@/components/auth/LocationPicker'

export default function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [number1, setNumber1] = useState('');
  const [number2, setNumber2] = useState('');

  const [role, setRole] = useState('');

  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const [profileImage, setProfileImage] =
    useState<File | null>(null);

  const [agreed, setAgreed] = useState(false);

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  const [errors, setErrors] = useState<
    Record<string, string>
  >({});

  type NextStep =
    | "admin_review"
    | "email_verification";

  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError('');

    if (!validateForm()) {
      return;
    }

    if (!validateImage(profileImage)) {
      return;
    }

    try {
      setLoading(true);

      const formData = buildFormData();

      const response =
        await authService.signup(formData);

      const messages: Record<NextStep, string> = {
        admin_review:
          "Your organization registration has been submitted for review. You will receive an email once it has been reviewed.",

        email_verification:
          "Registration successful. Please check your email to verify your account.",
      };

      setSuccessMessage(
        messages[response.nextStep] ??
        response.msg
      );

      setTimeout(() => {
        router.push('/auth/signin');
      }, 6000);

    } catch (err) {
      const error =
        err as AxiosError<{
          message?: string;
          msg?: string;
        }>;

      const message =
        error.response?.data?.message ??
        error.response?.data?.msg ??
        'Signup failed.';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format.';
    }

    if (password.length < 6) {
      newErrors.password =
        'Password must contain at least 6 characters.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword =
        'Passwords do not match.';
    }

    if (!number1 || !/^\d{8}$/.test(number1)) {
      newErrors.number1 =
        'Phone number must contain 8 digits.';
    }

    if (
      number2 &&
      !/^\d{8}$/.test(number2)
    ) {
      newErrors.number2 =
        'Secondary phone must contain 8 digits.';
    }

    if (!location) {
      newErrors.location =
        'Location is required.';
    }

    if (!role) {
      newErrors.role =
        'Role is required.';
    }

    if (!agreed) {
      newErrors.agreed =
        'You must accept the terms.';
    }

    setErrors(newErrors);

    console.log(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const validateImage = (
    file: File | null
  ) => {
    if (!file) return true;

    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
    ];

    if (!validTypes.includes(file.type)) {
      setError(
        'Only jpeg, jpg, png and gif files are allowed.'
      );

      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        'Image size must be less than 5MB.'
      );

      return false;
    }

    return true;
  };

  const handleLocationSelect = (
    address: string,
    lat: string,
    lng: string
  ) => {
    setLocation(address);
    setLatitude(lat.toString());
    setLongitude(lng.toString());

    setErrors((prev) => ({
      ...prev,
      location: '',
    }));
  };

  const buildFormData = () => {
    const data = new FormData();

    data.append('name', name);
    data.append('email', email);
    data.append('password', password);

    data.append('number1', number1);

    if (number2) {
      data.append('number2', number2);
    }

    data.append('location', location);
    data.append('latitude', latitude);
    data.append('longitude', longitude);

    data.append('role', role);

    if (profileImage) {
      data.append(
        'profileImage',
        profileImage
      );
    }

    return data;
  };

  return (
    <div className="bg-surface text-neutral min-h-screen flex items-center justify-center p-4 md:p-8">
      <main className="w-full max-w-[1600px] min-h-[85vh] grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-3xl shadow-xl bg-white">        {/* Brand Side */}
        <section className="hidden lg:flex lg:col-span-5 relative overflow-hidden bg-primary items-center justify-center p-12">
          <div className="absolute inset-0 z-0 opacity-40">
            <img
              className="w-full h-full object-cover"
              alt="Water and sustainability"
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
              <h1 className="text-5xl font-bold leading-tight">Join Us</h1>
              <p className="text-lg font-medium opacity-90 leading-relaxed max-w-[280px] text-center">
                Become part of 5,000+ members transforming how we live sustainably.
              </p>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined flex-shrink-0">done</span>
                <span className="text-sm">Recycle waste collection scheduling</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined flex-shrink-0">done</span>
                <span className="text-sm">Access exclusive refill products</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined flex-shrink-0">done</span>
                <span className="text-sm">Track your environmental impact</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined flex-shrink-0">done</span>
                <span className="text-sm">Support global sustainability causes</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Form Side */}
        <section className="lg:col-span-7 p-10 md:p-14 flex flex-col justify-center">
          <div className="space-y-6 max-w-3xl">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-neutral">Create Account</h2>
              <p className="text-neutral/70">Join the circular movement today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

              <div className="space-y-4">
                {/*<h3 className="text-lg font-semibold">
                  Account Information
                </h3>*/}

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold uppercase tracking-widest text-neutral/60">
                      Full Name
                    </label>

                    <input
                      type="text"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      placeholder="Alex Johnson"
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-border"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold uppercase tracking-widest text-neutral/60">
                      Email
                    </label>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-border"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/*<h3 className="text-lg font-semibold">
                  Security
                </h3>*/}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold uppercase tracking-widest text-neutral/60">
                      Password
                    </label>

                    <input
                      id="password"
                      type="password"
                      value={password}
                      placeholder="••••••••"
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-border"
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold uppercase tracking-widest text-neutral/60">
                      Confirm Password
                    </label>

                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      placeholder="••••••••"
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-border"
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/*<h3 className="text-lg font-semibold">
                  Contact Information
                </h3>*/}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold uppercase tracking-widest text-neutral/60">
                      Primary Phone
                    </label>

                    <input
                      type="tel"
                      value={number1}
                      onChange={(e) =>
                        setNumber1(e.target.value)
                      }
                      placeholder="+216 88 888 888"
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-border"
                    />
                    {errors.number1 && (
                      <p className="text-red-500 text-sm">
                        {errors.number1}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold uppercase tracking-widest text-neutral/60">
                      Secondary Phone
                    </label>

                    <input
                      type="tel"
                      value={number2}
                      onChange={(e) =>
                        setNumber2(e.target.value)
                      }
                      placeholder="Optional"
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-border"
                    />
                    {errors.number2 && (
                      <p className="text-red-500 text-sm">
                        {errors.number2}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/*<h3 className="text-lg font-semibold">
                  Profile
                </h3>*/}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold uppercase tracking-widest text-neutral/60">
                      Role
                    </label>

                    <select
                      value={role}
                      onChange={(e) =>
                        setRole(e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-border"
                    >
                      <option value="">
                        Select Role
                      </option>

                      <option value="particulier">
                        Individual
                      </option>

                      <option value="entreprise">
                        Organization
                      </option>
                    </select>
                    {errors.role && (
                      <p className="text-red-500 text-sm">
                        {errors.role}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold uppercase tracking-widest text-neutral/60">
                      Profile Image
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setProfileImage(
                          e.target.files?.[0] ?? null
                        )
                      }
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-border"
                    />
                    {error && (
                      <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                        {error}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/*<h3 className="text-lg font-semibold">
                  Location
                </h3>*/}
                <div className="space-y-3">
                  {/*<input
                    type="text"
                    value={location}
                    readOnly
                    placeholder="Select your location"
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border"
                  />*/}
                  <label className="block text-sm font-bold uppercase tracking-widest text-neutral/60">
                    Location
                  </label>
                  <LocationPicker
                    onLocationSelect={
                      handleLocationSelect
                    }
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm">
                      {errors.location}
                    </p>
                  )}
                  {location && (
                    <div className="rounded-lg border p-3 text-sm">
                      <span className="font-medium">
                        Selected Location:
                      </span>
                      <br />
                      {location}
                    </div>
                  )}
                </div>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 mt-1"
                  required
                />
                {errors.agreed && (
                  <p className="text-red-500 text-sm">
                    {errors.agreed}
                  </p>
                )}
                <span className="text-sm text-neutral/70">
                  I agree to the{' '}
                  <Link href="/terms&conditions" className="text-primary hover:text-primary-700 font-semibold">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy-policy" className="text-primary hover:text-primary-700 font-semibold">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              {errors.name && (
                <p className="text-red-500 text-sm">
                  {errors.name}
                </p>
              )}
              {successMessage && (
                <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
                  {successMessage}
                </div>
              )}
              {/* Sign Up Button */}
              <Button type="submit" size="lg" variant="primary" className="w-full">
                Create Account
              </Button>
            </form>

            {/* Sign In Link */}
            <p className="text-center text-neutral/70">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-primary font-bold hover:text-primary-700">
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
