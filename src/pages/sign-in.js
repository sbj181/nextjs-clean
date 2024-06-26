import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import Logo from '../components/CoreLogo';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else {
      alert('Signed in successfully!');
      router.push('/profile');
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

  return (
    <div className="flex h-screen">
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-slate-800 to-slate-950">
      </div>
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        <div className="w-1/3 mb-10"><Logo /></div>
        <h1 className="text-2xl mb-6 transition-all duration-300 ease-in-out">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </h1>
        <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="w-full">
          <input
            type="email"
            placeholder="Email"
            className="mb-4 p-2 border border-gray-300 rounded w-full"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="mb-4 p-2 border border-gray-300 rounded w-full"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
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
            </>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition w-full"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="mt-4 text-blue-500 underline transition-all duration-300 ease-in-out"
        >
          {isSignUp ? 'Already have an account? Sign In' : 'Don\'t have an account? Sign Up'}
        </button>
      </div>
    </div>
  );
};

export default SignIn;
