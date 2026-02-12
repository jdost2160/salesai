import React, { useState } from 'react';
import { Mail, Sparkles, Copy, RefreshCw, TrendingUp, Users, Building2, Zap, BarChart3, Folder, Send, CheckCircle, Clock, Download, Plus, Trash2, Edit, Target, Activity, Award, Calendar } from 'lucide-react';

export default function SalesEmailWriter() {
  const [activeTab, setActiveTab] = useState('generate');
  const [prospectInfo, setProspectInfo] = useState('');
  const [companyInfo, setCompanyInfo] = useState('');
  const [yourProduct, setYourProduct] = useState('');
  const [emailGoal, setEmailGoal] = useState('Book a meeting');
  const [tone, setTone] = useState('Professional');
  const [generatedEmails, setGeneratedEmails] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isPro, setIsPro] = useState(true);
  
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: 'Q1 Enterprise Outreach',
      created: '2025-02-01',
      emails: 45,
      status: 'active',
      stats: { sent: 45, opened: 32, replied: 8, meetings: 3 }
    },
    {
      id: 2,
      name: 'Series A SaaS Founders',
      created: '2025-02-08',
      emails: 23,
      status: 'active',
      stats: { sent: 23, opened: 18, replied: 5, meetings: 2 }
    }
  ]);
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  
  const [replyTracking, setReplyTracking] = useState([
    {
      id: 1,
      prospect: 'Sarah Chen',
      company: 'TechCorp',
      subject: 'Quick thought on your Q1 expansion',
      sent: '2025-02-10 09:15 AM',
      opened: true,
      openedAt: '2025-02-10 10:23 AM',
      replied: true,
      repliedAt: '2025-02-10 02:45 PM',
      status: 'positive',
      variation: 1
    },
    {
      id: 2,
      prospect: 'Mike Johnson',
      company: 'DataFlow Inc',
      subject: 'Helping teams like DataFlow book 40% more meetings',
      sent: '2025-02-10 09:20 AM',
      opened: true,
      openedAt: '2025-02-10 11:05 AM',
      replied: false,
      status: 'opened',
      variation: 2
    },
    {
      id: 3,
      prospect: 'Jessica Liu',
      company: 'CloudBase',
      subject: 'How Stripe increased reply rates 3x',
      sent: '2025-02-10 09:25 AM',
      opened: false,
      replied: false,
      status: 'sent',
      variation: 3
    },
    {
      id: 4,
      prospect: 'David Park',
      company: 'SalesHub',
      subject: 'Quick thought on your Q1 expansion',
      sent: '2025-02-09 02:30 PM',
      opened: true,
      openedAt: '2025-02-09 03:15 PM',
      replied: true,
      repliedAt: '2025-02-09 04:20 PM',
      status: 'meeting_booked',
      variation: 1
    }
  ]);

  const generateEmails = async () => {
    if (!prospectInfo.trim() || !yourProduct.trim()) return;
    
    setIsGenerating(true);

    const systemPrompt = `You are an elite B2B sales email copywriter. You write cold outreach emails that:
- Get opened (strong subject lines)
- Get read (personalized, relevant)
- Get replies (clear CTA, value-first)
- Don't sound like spam or AI

Key principles:
- Research-driven personalization (reference specific details about prospect/company)
- Lead with value, not features
- Keep it conversational and human
- No hype words, no desperation
- One clear ask

Avoid:
- "I hope this email finds you well"
- "I wanted to reach out"
- "Just following up"
- "Quick question"
- Obvious AI patterns`;

    const userPrompt = `Write 3 B2B cold email variations for this prospect:

PROSPECT INFO:
${prospectInfo}

${companyInfo ? `COMPANY INFO:\n${companyInfo}\n` : ''}

YOUR PRODUCT/SERVICE:
${yourProduct}

EMAIL GOAL: ${emailGoal}
TONE: ${tone}

For each email variation, provide:
1. Subject Line - 4-8 words, curiosity or value-driven
2. Email Body - 75-150 words, personalized opening, clear value prop, single CTA
3. Strategy Note - Why this approach works

Make each variation meaningfully different:
- Variation 1: Problem-focused (highlight their pain point)
- Variation 2: Opportunity-focused (show upside/potential)
- Variation 3: Social proof-focused (mention results for similar companies)

Output in JSON format as an array of objects with keys: subjectLine, emailBody, strategyNote`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemPrompt,
          messages: [
            { role: 'user', content: userPrompt }
          ]
        })
      });

      const data = await response.json();
      const content = data.content[0].text;
      
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const emails = JSON.parse(jsonMatch[0]);
        setGeneratedEmails(emails);
      } else {
        setGeneratedEmails(getFallbackEmails());
      }
    } catch (error) {
      console.error('Generation error:', error);
      setGeneratedEmails(getFallbackEmails());
    }
    
    setIsGenerating(false);
  };

  const getFallbackEmails = () => [
    {
      subjectLine: "Quick thought on your Q1 expansion",
      emailBody: `Hi {{firstName}},

Saw you're hiring 3 SDRs this quarter at ${companyInfo || '{{company}}'}.

We help sales teams like yours cut ramp time from 90 days to 30 by automating the research/personalization that usually takes hours per prospect.

${companyInfo ? 'Given your focus on enterprise accounts' : 'For teams scaling outbound'}, this typically means 40% more meetings booked per rep.

Worth a 15-min call next Tuesday or Wednesday?

Best,
{{yourName}}`,
      strategyNote: "Problem-focused. Opens with relevant context (hiring = scaling pain), quantifies value, low-friction ask."
    },
    {
      subjectLine: "Helping teams like {{company}} book 40% more meetings",
      emailBody: `{{firstName}},

Most B2B teams waste 60% of their SDR capacity on manual research and email personalization.

What if your team could:
- Research prospects in 30 seconds (not 30 minutes)
- Send personalized emails at scale
- Book 40% more qualified meetings

We built this for Series A-B SaaS companies. ${companyInfo ? 'Seems relevant given your growth stage' : 'Happy to share how it works'}.

15 minutes to see if it fits?

{{yourName}}`,
      strategyNote: "Opportunity-focused. Leads with inefficiency stat, shows concrete outcomes, positions as growth enabler."
    },
    {
      subjectLine: "How {{similarCompany}} increased reply rates 3x",
      emailBody: `Hi {{firstName}},

{{SimilarCompany}} was struggling with cold email reply rates under 2%.

They started using our platform to automate prospect research and personalization. Within 30 days:
- Reply rate jumped to 8%
- Meetings booked increased 40%
- SDR productivity doubled

${companyInfo ? 'Given your similar ICP and stage' : 'For companies in your space'}, curious if you're seeing the same challenges.

Open to a quick call Thursday afternoon?

Best,
{{yourName}}`,
      strategyNote: "Social proof-focused. Uses specific results from comparable company, creates FOMO, relates directly to their context."
    }
  ];

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const addToCampaign = (campaignId) => {
    alert(`Added to campaign! (This would save to campaign ${campaignId})`);
  };

  const createCampaign = () => {
    if (!newCampaignName.trim()) return;
    
    const newCampaign = {
      id: campaigns.length + 1,
      name: newCampaignName,
      created: new Date().toISOString().split('T')[0],
      emails: 0,
      status: 'active',
      stats: { sent: 0, opened: 0, replied: 0, meetings: 0 }
    };
    
    setCampaigns([...campaigns, newCampaign]);
    setNewCampaignName('');
    setShowNewCampaign(false);
  };

  const exportCampaignData = (campaign) => {
    const csvContent = `Campaign: ${campaign.name}\nSent: ${campaign.stats.sent}\nOpened: ${campaign.stats.opened}\nReplied: ${campaign.stats.replied}\nMeetings: ${campaign.stats.meetings}\n`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${campaign.name.replace(/\s/g, '_')}_stats.csv`;
    a.click();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'positive':
      case 'meeting_booked':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'opened':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'sent':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'positive':
      case 'meeting_booked':
        return <CheckCircle className="w-4 h-4" />;
      case 'opened':
        return <Clock className="w-4 h-4" />;
      case 'sent':
        return <Send className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Professional Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">SalesAI</h1>
                <p className="text-xs text-slate-500">Enterprise Email Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-emerald-700">Pro Account</span>
              </div>
              <button className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition text-sm">
                Settings
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">+12%</span>
            </div>
            <div className="mb-1">
              <p className="text-3xl font-bold text-slate-900">8.2%</p>
            </div>
            <p className="text-sm text-slate-600 font-medium">Reply Rate</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">+8%</span>
            </div>
            <div className="mb-1">
              <p className="text-3xl font-bold text-slate-900">71.4%</p>
            </div>
            <p className="text-sm text-slate-600 font-medium">Open Rate</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">+3</span>
            </div>
            <div className="mb-1">
              <p className="text-3xl font-bold text-slate-900">5</p>
            </div>
            <p className="text-sm text-slate-600 font-medium">Meetings Booked</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-violet-50 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-violet-600" />
              </div>
              <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded">Avg</span>
            </div>
            <div className="mb-1">
              <p className="text-3xl font-bold text-slate-900">28s</p>
            </div>
            <p className="text-sm text-slate-600 font-medium">Time per Email</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-xl border border-slate-200 p-2 mb-8 shadow-sm">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('generate')}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition whitespace-nowrap ${
                activeTab === 'generate'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Email Generator
            </button>
            <button
              onClick={() => setActiveTab('tracking')}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition whitespace-nowrap ${
                activeTab === 'tracking'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Activity className="w-4 h-4" />
              Activity Monitor
            </button>
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition whitespace-nowrap ${
                activeTab === 'campaigns'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Folder className="w-4 h-4" />
              Campaigns
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>
          </div>
        </div>

        {/* Generate Tab */}
        {activeTab === 'generate' && (
          <>
            <div className="bg-white rounded-xl border border-slate-200 p-8 mb-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Generate Personalized Emails</h2>
                <p className="text-slate-600">AI-powered cold outreach that converts prospects to meetings</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Prospect Information <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={prospectInfo}
                    onChange={(e) => setProspectInfo(e.target.value)}
                    placeholder="Sarah Chen, VP of Sales at TechCorp (500-person SaaS company). Recently posted on LinkedIn about scaling their SDR team from 5 to 15 reps."
                    className="w-full h-36 p-4 border border-slate-300 rounded-lg focus:border-slate-900 focus:ring-2 focus:ring-slate-200 outline-none transition resize-none text-sm bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Company Context
                  </label>
                  <textarea
                    value={companyInfo}
                    onChange={(e) => setCompanyInfo(e.target.value)}
                    placeholder="Series B funded, expanding into enterprise market, hiring aggressively, recent product launch..."
                    className="w-full h-36 p-4 border border-slate-300 rounded-lg focus:border-slate-900 focus:ring-2 focus:ring-slate-200 outline-none transition resize-none text-sm bg-slate-50"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Your Product/Service <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={yourProduct}
                  onChange={(e) => setYourProduct(e.target.value)}
                  placeholder="AI-powered sales research tool that cuts prospect research time from 30 minutes to 30 seconds. Helps SDRs send personalized emails at scale."
                  className="w-full h-28 p-4 border border-slate-300 rounded-lg focus:border-slate-900 focus:ring-2 focus:ring-slate-200 outline-none transition resize-none text-sm bg-slate-50"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Email Objective
                  </label>
                  <select
                    value={emailGoal}
                    onChange={(e) => setEmailGoal(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:border-slate-900 focus:ring-2 focus:ring-slate-200 outline-none transition bg-slate-50 text-slate-900 font-medium"
                  >
                    <option>Book a meeting</option>
                    <option>Start a conversation</option>
                    <option>Get a referral</option>
                    <option>Schedule a demo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Communication Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:border-slate-900 focus:ring-2 focus:ring-slate-200 outline-none transition bg-slate-50 text-slate-900 font-medium"
                  >
                    <option>Professional</option>
                    <option>Casual</option>
                    <option>Direct</option>
                    <option>Consultative</option>
                  </select>
                </div>
              </div>

              <button
                onClick={generateEmails}
                disabled={!prospectInfo.trim() || !yourProduct.trim() || isGenerating}
                className="w-full bg-slate-900 text-white py-4 rounded-lg font-semibold hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Generating Variations...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Email Variations
                  </>
                )}
              </button>
            </div>

            {/* Generated Emails */}
            {generatedEmails && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">Email Variations</h2>
                    <p className="text-slate-600">A/B test these variations to maximize engagement</p>
                  </div>
                </div>

                {generatedEmails.map((email, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-lg">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-lg">Variation {index + 1}</p>
                            <p className="text-sm text-slate-600">{email.strategyNote?.split('.')[0]}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => copyToClipboard(`Subject: ${email.subjectLine}\n\n${email.emailBody}`, index)}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition text-sm font-medium shadow-sm"
                          >
                            <Copy className="w-4 h-4" />
                            {copiedIndex === index ? 'Copied' : 'Copy'}
                          </button>
                          <select
                            onChange={(e) => addToCampaign(e.target.value)}
                            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition bg-white"
                          >
                            <option value="">Add to Campaign</option>
                            {campaigns.map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="mb-6">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                          Subject Line
                        </label>
                        <p className="text-xl font-semibold text-slate-900">
                          {email.subjectLine}
                        </p>
                      </div>

                      <div className="mb-6">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                          Email Body
                        </label>
                        <div className="p-5 bg-slate-50 rounded-lg border border-slate-200">
                          <p className="text-slate-800 whitespace-pre-line leading-relaxed font-mono text-sm">
                            {email.emailBody}
                          </p>
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                        <div className="flex items-start gap-3">
                          <Target className="w-5 h-5 text-blue-700 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
                              Strategy Analysis
                            </p>
                            <p className="text-sm text-blue-900 leading-relaxed">{email.strategyNote}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="grid sm:grid-cols-3 gap-4">
                  <button
                    onClick={generateEmails}
                    className="bg-white border-2 border-slate-900 text-slate-900 py-3 rounded-lg font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Regenerate
                  </button>
                  <button className="bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-md">
                    <Send className="w-5 h-5" />
                    Send Test
                  </button>
                  <button className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-md">
                    <Download className="w-5 h-5" />
                    Export All
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Activity Monitor Tab */}
        {activeTab === 'tracking' && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">Activity Monitor</h2>
                <p className="text-slate-600">Real-time email engagement tracking</p>
              </div>
              <button className="bg-slate-900 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition flex items-center gap-2 shadow-sm">
                <Download className="w-4 h-4" />
                Export Data
              </button>
            </div>

            {/* Performance Summary */}
            <div className="grid sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-5 border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                    <Send className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Sent</span>
                </div>
                <p className="text-4xl font-bold text-slate-900">68</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-blue-700">Opened</span>
                </div>
                <p className="text-4xl font-bold text-blue-900">50</p>
                <p className="text-xs text-blue-700 font-medium mt-1">73.5% rate</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-5 border border-indigo-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-indigo-700">Replied</span>
                </div>
                <p className="text-4xl font-bold text-indigo-900">13</p>
                <p className="text-xs text-indigo-700 font-medium mt-1">19.1% rate</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-5 border border-emerald-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-emerald-700">Meetings</span>
                </div>
                <p className="text-4xl font-bold text-emerald-900">5</p>
                <p className="text-xs text-emerald-700 font-medium mt-1">7.4% rate</p>
              </div>
            </div>

            {/* Email Activity List */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
              {replyTracking.map((email) => (
                <div key={email.id} className="border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition bg-white">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-slate-900">{email.prospect}</h3>
                        <span className="text-sm text-slate-500 font-medium">· {email.company}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${getStatusColor(email.status)}`}>
                          {getStatusIcon(email.status)}
                          {email.status === 'meeting_booked' ? 'Meeting Booked' : 
                           email.status === 'positive' ? 'Positive Reply' :
                           email.status === 'opened' ? 'Opened' : 'Sent'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 mb-3 font-medium">
                        {email.subject}
                      </p>
                      <div className="flex items-center gap-5 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Sent: {email.sent}
                        </span>
                        {email.opened && (
                          <span className="flex items-center gap-1 text-blue-600">
                            <Clock className="w-3.5 h-3.5" />
                            Opened: {email.openedAt}
                          </span>
                        )}
                        {email.replied && (
                          <span className="flex items-center gap-1 text-emerald-600 font-medium">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Replied: {email.repliedAt}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <span className="inline-block px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">
                        VAR {email.variation}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">Campaign Management</h2>
                <p className="text-slate-600">Organize and track your outreach initiatives</p>
              </div>
              <button
                onClick={() => setShowNewCampaign(!showNewCampaign)}
                className="bg-slate-900 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                New Campaign
              </button>
            </div>

            {showNewCampaign && (
              <div className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block text-sm font-bold text-slate-900 mb-3">
                  Campaign Name
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newCampaignName}
                    onChange={(e) => setNewCampaignName(e.target.value)}
                    placeholder="Q2 Enterprise Outreach"
                    className="flex-1 p-3 border border-slate-300 rounded-lg focus:border-slate-900 focus:ring-2 focus:ring-slate-200 outline-none font-medium"
                  />
                  <button
                    onClick={createCampaign}
                    className="bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 shadow-sm"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowNewCampaign(false)}
                    className="bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid gap-5">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="border border-slate-200 rounded-xl p-6 hover:border-slate-300 hover:shadow-md transition bg-white">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{campaign.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {campaign.created}
                        </span>
                        <span>·</span>
                        <span className="font-medium">{campaign.emails} emails</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => exportCampaignData(campaign)}
                        className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                        title="Export data"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-lg transition" title="Edit">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-3xl font-bold text-slate-900 mb-1">{campaign.stats.sent}</p>
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Sent</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-3xl font-bold text-blue-900 mb-1">{campaign.stats.opened}</p>
                      <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                        Opened ({campaign.stats.sent > 0 ? Math.round((campaign.stats.opened / campaign.stats.sent) * 100) : 0}%)
                      </p>
                    </div>
                    <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                      <p className="text-3xl font-bold text-indigo-900 mb-1">{campaign.stats.replied}</p>
                      <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">
                        Replied ({campaign.stats.sent > 0 ? Math.round((campaign.stats.replied / campaign.stats.sent) * 100) : 0}%)
                      </p>
                    </div>
                    <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                      <p className="text-3xl font-bold text-emerald-900 mb-1">{campaign.stats.meetings}</p>
                      <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Meetings</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-1">Performance Analytics</h2>
                <p className="text-slate-600">Data-driven insights for optimization</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Best Performing Variation */}
                <div className="border border-slate-200 rounded-xl p-6 bg-gradient-to-br from-emerald-50 to-white">
                  <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                    <Award className="w-6 h-6 text-emerald-600" />
                    Top Performing Strategy
                  </h3>
                  <div className="bg-white rounded-lg p-5 border border-emerald-200 mb-5 shadow-sm">
                    <p className="text-sm font-bold text-emerald-900 mb-4 uppercase tracking-wide">Variation 1: Problem-Focused</p>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-3xl font-bold text-emerald-900 mb-1">78%</p>
                        <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Open</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-emerald-900 mb-1">24%</p>
                        <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Reply</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-emerald-900 mb-1">11%</p>
                        <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Meeting</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Problem-focused emails outperform by <span className="font-bold text-emerald-700">35%</span> in reply rate. Prioritize pain point messaging.
                  </p>
                </div>

                {/* Optimal Send Times */}
                <div className="border border-slate-200 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-white">
                  <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                    <Clock className="w-6 h-6 text-blue-600" />
                    Optimal Send Windows
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
                      <span className="font-bold text-slate-900">Tuesday 9-11 AM</span>
                      <span className="text-blue-600 font-bold text-lg">82%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-indigo-200 shadow-sm">
                      <span className="font-bold text-slate-900">Wednesday 2-4 PM</span>
                      <span className="text-indigo-600 font-bold text-lg">76%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-violet-200 shadow-sm">
                      <span className="font-bold text-slate-900">Thursday 8-10 AM</span>
                      <span className="text-violet-600 font-bold text-lg">71%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subject Line Performance */}
              <div className="border border-slate-200 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-5">Subject Line Performance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-5 bg-gradient-to-r from-emerald-50 to-white rounded-xl border border-emerald-200">
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 mb-2">"Quick thought on your Q1 expansion"</p>
                      <p className="text-sm text-slate-600 font-medium">28 sent · 24 opened · 8 replied</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-3xl font-bold text-emerald-900">28.6%</p>
                      <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Reply Rate</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-200">
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 mb-2">"How Stripe increased reply rates 3x"</p>
                      <p className="text-sm text-slate-600 font-medium">22 sent · 18 opened · 5 replied</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-3xl font-bold text-blue-900">22.7%</p>
                      <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Reply Rate</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 border border-slate-700 text-white">
                <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  AI-Powered Recommendations
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">Problem-focused emails generate 35% higher reply rates. Emphasize pain points for enterprise prospects.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">Tuesday 9-11 AM sends achieve 2.3x higher open rates. Optimize campaign scheduling accordingly.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">Subject lines with quantified metrics (e.g., "40%", "3x") perform 18% better than generic alternatives.</p>
                  </li>
                </ul>
              </div>
            </div>

            {/* Integration Section */}
            <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Platform Integrations</h3>
                  <p className="text-slate-600">Connect your sales stack</p>
                </div>
                <button className="bg-slate-900 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition shadow-sm flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Integration
                </button>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition">
                  <p className="font-bold text-slate-900 text-lg mb-1">HubSpot</p>
                  <p className="text-xs text-emerald-600 font-semibold">● Connected</p>
                </div>
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition">
                  <p className="font-bold text-slate-900 text-lg mb-1">Outreach</p>
                  <p className="text-xs text-emerald-600 font-semibold">● Connected</p>
                </div>
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition">
                  <p className="font-bold text-slate-900 text-lg mb-1">Salesforce</p>
                  <p className="text-xs text-slate-400 font-semibold">○ Available</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
