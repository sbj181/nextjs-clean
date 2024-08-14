import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import Logo from '../components/CoreLogo';
import ThemeToggle from '../components/ThemeToggler'; // Import the ThemeToggle component

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('user'); // default role
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    } else {
      alert('Signed in successfully!');
      router.push('/');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      alert(signUpError.message);
    } else {
      const { user } = signUpData;
      const { error: userError } = await supabase.from('users').insert([
        {
          id: user.id,
          email: user.email,
          display_name: displayName,
          phone_number: phoneNumber,
          role, // set role
        },
      ]);
      if (userError) {
        alert(userError.message);
      } else {
        alert('Account created successfully!');
        setIsSignUp(false);
        router.push('/profile');
      }
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      alert(error.message);
    } else {
      alert('Password reset email sent successfully!');
      setIsResetPassword(false);
    }
  };

  return (
    <div className="flex h-screen relative">
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-slate-800 to-slate-950 dark:from-slate-800 dark:to-slate-900"></div>
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8 dark:bg-slate-950">
        <div className="w-1/3 mb-10">
          <Logo />
        </div>
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <h1 className="text-2xl dark:text-slate-50 mb-6 transition-all duration-300 ease-in-out">
          {isSignUp ? 'Sign Up' : isResetPassword ? 'Reset Password' : 'Sign In'}
        </h1>
        <form onSubmit={isSignUp ? handleSignUp : isResetPassword ? handleResetPassword : handleSignIn} className="w-full">
          <input
            type="email"
            placeholder="Email"
            className="mb-4 p-2 border border-gray-300 rounded w-full"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {!isResetPassword && (
            <input
              type="password"
              placeholder="Password"
              className="mb-4 p-2 border border-gray-300 rounded w-full"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          )}
          {isSignUp && (
            <>
              <input
                type="text"
                placeholder="Display Name"
                className="mb-4 p-2 border border-gray-300 rounded w-full"
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Phone Number (Optional)"
                className="mb-4 p-2 border border-gray-300 rounded w-full"
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <div className="mb-4">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </>
          )}
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition w-full">
            {isSignUp ? 'Sign Up' : isResetPassword ? 'Reset Password' : 'Sign In'}
          </button>
        </form>
        {!isResetPassword && (
          <div className="mt-8 dark:text-slate-50">
            {!isSignUp ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => setIsSignUp(true)}
                  className="text-blue-500 underline transition-all duration-300 ease-in-out"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setIsSignUp(false)}
                  className="text-blue-500 underline transition-all duration-300 ease-in-out"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        )}
        {isResetPassword && (
          <button
            onClick={() => setIsResetPassword(false)}
            className="mt-4 text-blue-500 underline transition-all duration-300 ease-in-out"
          >
            Back to Sign In
          </button>
        )}
        {!isSignUp && !isResetPassword && (
          <button
            onClick={() => setIsResetPassword(true)}
            className="mt-4 text-blue-500 underline transition-all duration-300 ease-in-out"
          >
            Forgot your password?
          </button>
        )}
      </div>
    </div>
  );
};

export default SignIn;
