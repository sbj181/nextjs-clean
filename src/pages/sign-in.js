import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // State to toggle between sign-in and sign-up
  const router = useRouter();

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else {
      alert('Signed in successfully!');
      router.push('/profile');
    }
  };

  const handleSignUp = async () => {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      alert(signUpError.message);
    } else {
      const { error: userError } = await supabase.from('users').insert([
        {
          id: signUpData.user.id,
          email: signUpData.user.email,
          display_name: '',
          phone_number: '',
        },
      ]);
      if (userError) {
        alert(userError.message);
      } else {
        alert('Account created successfully!');
        setIsSignUp(false); // Switch back to sign-in mode after successful sign-up
      }
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex flex-col justify-center items-center w-1/2 bg-slate-500">
        {/* Left Column */}
      </div>
      <div className="flex flex-col justify-center items-center w-1/2 p-8">
        {/* Right Column */}
        <h1 className="text-2xl mb-6">{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
        <input
          type="email"
          placeholder="Email"
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={isSignUp ? handleSignUp : handleSignIn}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="mt-4 text-blue-500 underline"
        >
          {isSignUp ? 'Already have an account? Sign In' : 'Don\'t have an account? Sign Up'}
        </button>
      </div>
    </div>
  );
};

export default SignIn;