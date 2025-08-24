import React, { useState } from 'react';
import { auth, db } from '../../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import Input from '../common/Input';
import Button from '../common/Button';

export const Signup = ({ onTogglePage }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !phone || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      // 1. Create the user with email and password in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Save the user's additional details in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        username: username,
        email: email,
        phone: phone,
        createdAt: serverTimestamp(),
      });
      // The onAuthStateChanged listener in AuthContext will handle the login state
    } catch (err) {
      // Handle errors like "email already in use"
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create your CuraCore Account</h2>
          <p className="mt-2 text-sm text-gray-600">Get started with your personalized health journey</p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSignup}>
          <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <Input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <Input type="password" placeholder="Password (min. 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} required />

          {error && <p className="text-sm text-center text-red-600">{error}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
        <div className="text-sm text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button onClick={onTogglePage} className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};