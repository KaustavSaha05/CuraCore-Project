import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

// The FeatureCard now accepts an 'onClick' prop
const FeatureCard = ({ title, description, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl hover:bg-indigo-50 transition-all cursor-pointer"
    >
      <h3 className="text-xl font-bold text-indigo-600">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
};

// HomePage now accepts the 'onNavigate' function from App.js
const HomePage = ({ onNavigate }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Your Dashboard!</h2>
        <p className="text-gray-600 mb-8">Choose one of the options below to get started.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Each card now has an onClick handler that calls onNavigate with the correct page key */}
          <FeatureCard 
            title="Basic Healthcare"
            description="Enter your age, weight, and height to get generalized health advice and calculate your BMI."
            onClick={() => onNavigate('basicHealth')}
          />
          <FeatureCard 
            title="AI Report Analyzer"
            description="Paste your medical report text here to get a simplified, easy-to-understand summary."
            onClick={() => onNavigate('reportAnalyzer')}
          />
          <FeatureCard 
            title="AI Healthcare Chatbot"
            description="Have a health question? Chat with our AI to get information and guidance."
            onClick={() => onNavigate('chatbot')}
          />
          <FeatureCard 
            title="Find Facilities Near You"
            description="Locate nearby hospitals, clinics, and pharmacies based on your current location."
            onClick={() => onNavigate('findFacilities')}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;