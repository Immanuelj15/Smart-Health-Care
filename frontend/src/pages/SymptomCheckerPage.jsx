import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const SymptomCheckerPage = () => {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult('');
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        'http://localhost:5000/api/ai/symptom-checker',
        { symptoms },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(data.result);
    } catch (error) {
      toast.error("Failed to get a response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">AI Symptom Checker</h1>
        <p className="text-gray-600 mb-8">Describe your symptoms to get informational insights. This is not a medical diagnosis.</p>
        
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="For example: 'I have a headache, a sore throat, and a slight fever...'"
            className="w-full p-3 border rounded-lg h-32"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-3 bg-blue-600 text-white font-semibold rounded-lg disabled:bg-gray-400"
          >
            {isLoading ? 'Analyzing...' : 'Check Symptoms'}
          </button>
        </form>

        {result && (
          <div className="mt-8 bg-white p-8 rounded-lg shadow-md text-left whitespace-pre-wrap">
            <h2 className="text-2xl font-semibold mb-4">Analysis Result</h2>
            <p>{result}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomCheckerPage;