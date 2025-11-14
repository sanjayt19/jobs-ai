import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { openai } from '../lib/openai';
import { Upload, Loader } from 'lucide-react';

export default function ResumeAnalyzer() {
  const openaiAvailable = Boolean(openai);
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const analyzeResume = async () => {
    if (!openaiAvailable) {
      setAnalysis('OpenAI API key not configured — AI features are disabled in this environment.');
      return;
    }
    if (!file) return;

    setLoading(true);
    try {
      const text = await file.text();

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume reviewer. Analyze the resume and provide constructive feedback on formatting, content, keywords, and improvements.',
          },
          {
            role: 'user',
            content: 'Please analyze this resume and provide detailed feedback: ' + text,
          },
        ],
        max_tokens: 1000,
      });

      const result = completion.choices[0].message.content || 'No analysis available';
      setAnalysis(result);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('resumes').insert([
          {
            user_id: user.id,
            file_name: file.name,
            content: text,
            analysis: result,
          },
        ]);
      }
    } catch (error) {
      console.error('Error analyzing resume:', error);
      setAnalysis('Error analyzing resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Resume Analyzer</h1>

      <div className="bg-slate-800 p-8 rounded-xl mb-6">
        <div className="border-2 border-dashed border-slate-600 rounded-lg p-12 text-center">
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-300 mb-4">Upload your resume (TXT, PDF, or DOCX)</p>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".txt,.pdf,.docx"
            className="hidden"
            id="resume-upload"
          />
          <label
            htmlFor="resume-upload"
            className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-semibold cursor-pointer hover:bg-primary-600"
          >
            Choose File
          </label>
          {file && <p className="text-slate-400 mt-4">Selected: {file.name}</p>}
        </div>

        {file && (
          <button
              onClick={analyzeResume}
              disabled={loading || !openaiAvailable}
            className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-600 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Resume'
            )}
          </button>
        )}
      </div>

      {analysis && (
        <div className="bg-slate-800 p-8 rounded-xl">
          <h2 className="text-xl font-bold text-white mb-4">Analysis Results</h2>
          <div className="text-slate-300 whitespace-pre-wrap">{analysis}</div>
        </div>
      )}
    </div>
  );
}
