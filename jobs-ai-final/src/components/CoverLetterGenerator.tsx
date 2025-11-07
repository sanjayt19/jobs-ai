import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { openai } from '../lib/openai';
import { Loader, Copy, Check } from 'lucide-react';

export default function CoverLetterGenerator() {
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateCoverLetter = async () => {
    if (!jobTitle || !company || !jobDescription) return;

    setLoading(true);
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert cover letter writer. Create professional, personalized cover letters that highlight relevant skills and experience.',
          },
          {
            role: 'user',
            content: 'Write a cover letter for: Job Title: ' + jobTitle + ', Company: ' + company + ', Job Description: ' + jobDescription,
          },
        ],
        max_tokens: 800,
      });

      const result = completion.choices[0].message.content || 'No cover letter generated';
      setCoverLetter(result);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('cover_letters').insert([
          {
            user_id: user.id,
            job_title: jobTitle,
            company: company,
            content: result,
          },
        ]);
      }
    } catch (error) {
      console.error('Error generating cover letter:', error);
      setCoverLetter('Error generating cover letter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Cover Letter Generator</h1>

      <div className="bg-slate-800 p-8 rounded-xl mb-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Job Title
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="e.g., Senior Software Engineer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="e.g., Google"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="Paste the job description here..."
            />
          </div>

          <button
            onClick={generateCoverLetter}
            disabled={loading || !jobTitle || !company || !jobDescription}
            className="w-full bg-primary text-slate-900 py-3 rounded-lg font-semibold hover:bg-yellow-500 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Cover Letter'
            )}
          </button>
        </div>
      </div>

      {coverLetter && (
        <div className="bg-slate-800 p-8 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Your Cover Letter</h2>
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-700 rounded-lg text-slate-300 hover:text-white"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="text-slate-300 whitespace-pre-wrap">{coverLetter}</div>
        </div>
      )}
    </div>
  );
}
