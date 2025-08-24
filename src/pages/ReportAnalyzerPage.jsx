// src/pages/ReportAnalyzerPage.jsx

import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import Button from '../components/common/Button.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { analyzeReport } from '../api/geminiService.js'; // Import the real function

const ReportAnalyzerPage = ({ onNavigate }) => {
  const [reportText, setReportText] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!reportText.trim()) return;
    setIsLoading(true);
    setAnalysis('');
    setError('');

    try {
      // --- This is the updated part ---
      // We now call the real service function
      const response = await analyzeReport(reportText);
      setAnalysis(response);
      // ---------------------------------
    } catch (err) {
      setError('Failed to get analysis. Please try again later.');
      console.error(err);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <button onClick={() => onNavigate('home')} className="mb-6 text-indigo-600 hover:text-indigo-800 font-medium">
            &larr; Back to Home
          </button>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">AI Report Analyzer</h2>
          <textarea
            className="w-full h-40 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Paste your medical report text here..."
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
          />
          <div className="mt-4">
            <Button onClick={handleAnalyze} disabled={isLoading}>
              {isLoading ? 'Analyzing...' : 'Analyze Report'}
            </Button>
          </div>
          <div className="mt-6">
            {isLoading && <LoadingSpinner />}
            {error && <p className="text-red-500 text-center">{error}</p>}
            {analysis && (
              <div className="p-4 rounded-md bg-indigo-50">
                <h3 className="font-bold text-lg text-gray-800 mb-2">Analysis Result:</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{analysis}</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReportAnalyzerPage;