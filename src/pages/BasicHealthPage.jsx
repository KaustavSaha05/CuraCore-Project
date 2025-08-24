// src/pages/BasicHealthPage.jsx

import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';

const BasicHealthPage = ({ onNavigate }) => { // Accept the onNavigate prop
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    if (!weight || !height || weight <= 0 || height <= 0) {
      setResult({ error: 'Please enter a valid weight and height.' });
      return;
    }
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
    
    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi >= 18.5 && bmi <= 24.9) category = 'Normal weight';
    else if (bmi >= 25 && bmi <= 29.9) category = 'Overweight';
    else category = 'Obesity';

    setResult({ bmi, category });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          {/* Back Button Added Here */}
          <button onClick={() => onNavigate('home')} className="mb-6 text-indigo-600 hover:text-indigo-800 font-medium">
            &larr; Back to Home
          </button>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Basic Health Calculator</h2>
          <div className="space-y-4">
            <Input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
            <Input type="number" placeholder="Weight (in kg)" value={weight} onChange={(e) => setWeight(e.target.value)} />
            <Input type="number" placeholder="Height (in cm)" value={height} onChange={(e) => setHeight(e.target.value)} />
            <Button onClick={handleCalculate}>Calculate BMI</Button>
          </div>
          {result && (
            <div className="mt-6 p-4 rounded-md bg-indigo-50 text-center">
              {result.error ? (
                <p className="text-red-600 font-medium">{result.error}</p>
              ) : (
                <>
                  <p className="text-lg font-bold text-gray-800">Your BMI is: {result.bmi}</p>
                  <p className="text-md text-indigo-700">You are in the '{result.category}' category.</p>
                </>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BasicHealthPage;