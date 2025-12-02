import React, { useState, useEffect } from 'react';
import { Bus, Shield, CheckCircle2, ArrowRight, Upload, X, FileText, Tablet, Scan, Cable, Check, Zap, Navigation, Printer, Mail, Map, Brain, DollarSign, Wrench, Lock, LayoutDashboard, User, AlertCircle } from 'lucide-react';
import { RECOMMENDED_HARDWARE } from '../constants';
import { SubscriptionTier, QuoteRequest } from '../types';

interface LandingPageProps {
  onLogin: (role: 'CLIENT' | 'ADMIN' | 'DRIVER' | 'MAINTENANCE', tier?: SubscriptionTier) => void;
  onQuoteRequest?: (quote: QuoteRequest) => void;
}

// Interactive Demo Component
const InteractiveHeroDemo = () => {
  const [progress, setProgress] = useState(65);
  const [eta, setEta] = useState(5);
  const [showAlert, setShowAlert] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => {
        setProgress(p => {
            if (p >= 100) return 0;
            return p + 0.2;
        });
    }, 50);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const alertTimer = setInterval(() => {
        setShowAlert(prev => !prev);
    }, 5000);
    return () => clearInterval(alertTimer);
  }, []);
  
  useEffect(() => {
      setEta(Math.max(1, Math.ceil(8 * (1 - progress/100))));
  }, [progress]);

  return (
    <div className="relative h-[450px] lg:h-[600px] w-full flex items-center justify-center">
       <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
               <path d="M10,10 Q40,40 60,10 T90,50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-blue-600" />
               <path d="M10,80 Q40,50 60,80 T90,40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-purple-600" />
               <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.2" strokeDasharray="2 2" className="text-slate-400" />
           </svg>
       </div>

       <div className="relative z-20 w-72 md:w-80 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 p-5 transform transition-all hover:scale-105 duration-500 animate-in fade-in slide-in-from-bottom-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                        <Bus size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 leading-tight">Bus #42</p>
                        <p className="text-xs text-slate-500 font-medium">Route 101 • AM Run</p>
                    </div>
                </div>
                <div className="animate-pulse">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-500 ring-4 ring-green-100"></span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold text-slate-600 uppercase tracking-wide">
                    <span>Route Progress</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Navigation size={16} className="text-blue-500" />
                        <span className="font-medium">Next: Oak St</span>
                    </div>
                    <div className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                        {eta} min away
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-100">
                <div className="text-center p-2 rounded-lg bg-slate-50 hover:bg-blue-50 transition-colors">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Speed</p>
                    <p className="text-lg font-bold text-slate-700">42 <span className="text-xs font-normal text-slate-400">mph</span></p>
                </div>
                <div className="text-center p-2 rounded-lg bg-slate-50 hover:bg-blue-50 transition-colors">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Occupancy</p>
                    <p className="text-lg font-bold text-slate-700">48<span className="text-slate-400 text-sm">/60</span></p>
                </div>
            </div>
       </div>

       <div className={`absolute top-10 -left-2 md:left-0 w-64 bg-slate-800 text-white rounded-xl shadow-2xl p-4 z-30 transition-all duration-700 transform border border-slate-700 ${showAlert ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'}`}>
            <div className="flex items-start gap-3">
                <div className="bg-amber-500/20 p-2 rounded-lg text-amber-500 shrink-0">
                    <Zap size={18} />
                </div>
                <div>
                    <p className="text-sm font-bold text-amber-400 mb-1 flex items-center gap-2">AI Optimization <span className="text-[9px] bg-amber-500 text-slate-900 px-1 rounded">NEW</span></p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                        Traffic detected on I-10. Rerouting via Skyline Dr saved 12 minutes.
                    </p>
                </div>
            </div>
       </div>

       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full blur-3xl -z-10 opacity-60"></div>
    </div>
  );
};

const FEATURES = [
    {
        icon: Map,
        title: "Real-time GPS Fleet Tracking",
        desc: "Live location updates with 1-second latency. Visualize your entire district fleet on a single dashboard with traffic overlays."
    },
    {
        icon: Brain,
        title: "AI Route Optimization",
        desc: "Gemini-powered algorithms analyze traffic patterns and ridership data to suggest more efficient routes, saving fuel and time."
    },
    {
        icon: Shield,
        title: "RFID Student Ridership",
        desc: "Know exactly when and where students board and disembark. Automated notifications sent to parents for peace of mind."
    },
    {
        icon: Wrench,
        title: "Maintenance Console",
        desc: "Digital ticketing system for mechanics. Drivers can report issues from the app, and shop crews can track repair progress."
    },
    {
        icon: DollarSign,
        title: "Budget & Financial Intelligence",
        desc: "Track operational expenses and project ROI. Use our sandbox tools to simulate savings from electrification and efficiency."
    },
    {
        icon: Tablet,
        title: "Legacy Fleet Retrofit",
        desc: "Turn older buses into smart vehicles with our Driver Kiosk App and cost-effective hardware integration kits."
    }
];

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onQuoteRequest }) => {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showPOModal, setShowPOModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showHardwareModal, setShowHardwareModal] = useState(false);
  const [simulatedTier, setSimulatedTier] = useState<SubscriptionTier>('ENTERPRISE');
  const [showToast, setShowToast] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  // Login Modal State
  const [loginTab, setLoginTab] = useState<'OFFICE' | 'DRIVER' | 'SHOP' | 'ADMIN'>('OFFICE');
  const [districtId, setDistrictId] = useState('');

  // Quote Form State
  const [quoteForm, setQuoteForm] = useState({
      district: '',
      contact: '',
      role: '',
      email: '',
      students: '',
      buses: '',
      legacyBuses: '', // New field for Retrofit calculation
      tier: 'PROFESSIONAL' as SubscriptionTier
  });
  const [generatedQuote, setGeneratedQuote] = useState<QuoteRequest | null>(null);
  const [discountDetails, setDiscountDetails] = useState({ perBus: 0, totalDiscount: 0 });
  const [hardwareCost, setHardwareCost] = useState(0);

  // PO Form State
  const [poForm, setPoForm] = useState({
      district: '',
      contact: '',
      email: '',
      file: null as File | null
  });
  const [poSubmitted, setPoSubmitted] = useState(false);

  const handleQuoteSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Calculate Quote
      const busCount = parseInt(quoteForm.buses) || 0;
      const legacyCount = parseInt(quoteForm.legacyBuses) || 0;
      
      let basePrice = 0;
      let perBusPrice = 0;

      switch(quoteForm.tier) {
          case 'BASIC': basePrice = 3000; perBusPrice = 200; break;
          case 'PROFESSIONAL': basePrice = 5000; perBusPrice = 400; break;
          case 'ENTERPRISE': basePrice = 10000; perBusPrice = 600; break;
      }

      // Volume Discount Logic (Tiered Pricing)
      let discountPerBus = 0;
      if (busCount > 1000) discountPerBus = 5.00;
      else if (busCount > 750) discountPerBus = 4.00;
      else if (busCount > 500) discountPerBus = 3.50;
      else if (busCount > 250) discountPerBus = 3.00;
      else if (busCount > 100) discountPerBus = 2.50;

      const adjustedPerBusPrice = perBusPrice - discountPerBus;
      
      const hardwareTotal = legacyCount * 172.50;
      const totalAnnual = basePrice + (busCount * adjustedPerBusPrice);
      const grandTotal = totalAnnual + hardwareTotal;

      setDiscountDetails({
          perBus: discountPerBus,
          totalDiscount: busCount * discountPerBus
      });
      setHardwareCost(hardwareTotal);

      const newQuote: QuoteRequest = {
          id: `Q-${Date.now()}`,
          districtName: quoteForm.district,
          contactName: quoteForm.contact,
          contactRole: quoteForm.role,
          email: quoteForm.email,
          studentCount: parseInt(quoteForm.students) || 0,
          busCount: busCount,
          legacyBusCount: legacyCount,
          tier: quoteForm.tier,
          amount: grandTotal,
          hardwareCost: hardwareTotal,
          status: 'PENDING',
          submittedDate: new Date().toLocaleDateString()
      };
      
      setGeneratedQuote(newQuote);
      if (onQuoteRequest) {
          onQuoteRequest(newQuote);
      }

      // Show Notification Toast
      setShowToast(true);
      setTimeout(() => setShowToast(false), 8000);
  };

  const handleLoginSubmit = () => {
      if (loginTab === 'OFFICE') {
          // Simulate admin check (if district ID is 'admin' go to super admin)
          const cleanId = districtId.trim().toLowerCase();
          if (['admin', 'super', 'root', 'matt'].includes(cleanId)) {
              onLogin('ADMIN');
          } else {
              onLogin('CLIENT', simulatedTier);
          }
      } else if (loginTab === 'DRIVER') {
          onLogin('DRIVER');
      } else if (loginTab === 'SHOP') {
          onLogin('MAINTENANCE');
      } else if (loginTab === 'ADMIN') {
          onLogin('ADMIN');
      }
      setShowLoginModal(false);
  };

  // Robust Print Function
  const handlePrint = () => {
    const printContent = document.getElementById('quote-document');
    if (!printContent) return;

    // Open a new window to ensure clean print environment
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (printWindow) {
        printWindow.document.write(`
            <html>
                <head>
                    <title>RideSmart Quote #${generatedQuote?.id}</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
                    <style>
                        body { font-family: 'Poppins', sans-serif; padding: 40px; -webkit-print-color-adjust: exact; }
                    </style>
                </head>
                <body>
                    ${printContent.innerHTML}
                    <script>
                        setTimeout(() => {
                            window.print();
                            window.close();
                        }, 500);
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    }
  };

  // Send Real Email via Mailto
  const handleMailto = () => {
      if (!generatedQuote) return;
      const subject = `RideSmart Quote #${generatedQuote.id} for ${generatedQuote.districtName}`;
      const body = `Hello ${generatedQuote.contactName},\n\nHere is the generated pricing estimate for ${generatedQuote.districtName}.\n\nPlan: ${generatedQuote.tier}\nFleet Size: ${generatedQuote.busCount}\nTotal Proposal Value: $${generatedQuote.amount.toLocaleString()}\n\nPlease review the details attached or visiting our portal.\n\nBest regards,\nRideSmart AI Team`;
      
      const mailtoUrl = `mailto:${quoteForm.email}?bcc=matt.monjan@infusedu.com&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoUrl, '_blank');
  };

  const handlePOSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setTimeout(() => {
          setPoSubmitted(true);
          console.log(`[System Notification] New PO Uploaded by ${poForm.district}. Notification sent to matt.monjan@infusedu.com`);
      }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setPoForm({...poForm, file: e.target.files[0]});
      }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 relative">
      {/* Notification Toast */}
      {showToast && (
          <div className="fixed top-24 right-6 z-[60] bg-slate-900 text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 duration-300 border border-slate-800 max-w-md">
            <div className="bg-green-500 rounded-full p-1.5 shadow-lg shadow-green-500/20">
              <Check size={18} className="text-white" strokeWidth={3} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-white">Quote Generated Successfully</p>
              <p className="text-xs text-slate-400 mt-1">Ready to send to: {quoteForm.email}</p>
              <p className="text-xs text-slate-400 mt-0.5">BCC: matt.monjan@infusedu.com</p>
              <button 
                onClick={() => setShowEmailPreview(true)}
                className="text-[10px] font-bold text-blue-300 hover:text-blue-200 underline mt-2"
              >
                  View Internal Notification
              </button>
            </div>
            <button onClick={() => setShowToast(false)} className="ml-2 text-slate-500 hover:text-white self-start">
                <X size={16} />
            </button>
          </div>
      )}

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Bus size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">RideSmart<span className="text-blue-600">.ai</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors" onClick={(e) => {
                e.preventDefault();
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            }}>Features</a>
            <button onClick={() => setShowHardwareModal(true)} className="hover:text-blue-600 transition-colors">Hardware Guide</button>
            <a href="#pricing" className="hover:text-blue-600 transition-colors" onClick={(e) => {
                e.preventDefault();
                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
            }}>Pricing</a>
          </div>
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setShowPOModal(true)}
                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Upload size={16} /> Upload PO
              </button>
              <button 
                onClick={() => setShowLoginModal(true)}
                className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
              >
                Login
              </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-20 pb-20 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent opacity-70"></div>
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide animate-in fade-in slide-in-from-bottom-4">
              <Zap size={12} /> Now serving K-12 Districts Nationwide
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
              The Intelligent Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Student Safety.</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
              Replace paper manifests with AI-powered logistics. RideSmart provides real-time RFID tracking, automated parent notifications, and route optimization for modern school districts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* UPDATED: Open Login Modal instead of direct Admin Login */}
              <button onClick={() => setShowLoginModal(true)} className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                Launch Dashboard <ArrowRight size={18} />
              </button>
              <button onClick={() => setShowQuoteModal(true)} className="px-8 py-4 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                Request Pricing
              </button>
            </div>
            <div className="pt-8 flex items-center gap-6 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> FERPA Compliant</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> SOC2 Certified</span>
              <span className="flex items-center gap-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-bold">v3.0 Live</span>
            </div>
          </div>
          
          {/* Hero Graphic */}
          <div className="w-full">
             <InteractiveHeroDemo />
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white relative z-10">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to run a smarter fleet.</h2>
                  <p className="text-slate-500 max-w-2xl mx-auto">
                      From the depot to the drop-off zone, RideSmart integrates every aspect of student transportation into one cohesive platform.
                  </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {FEATURES.map((feature, idx) => (
                      <div key={idx} className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg hover:bg-white transition-all duration-300 group">
                          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              <feature.icon size={24} />
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                          <p className="text-slate-500 leading-relaxed">
                              {feature.desc}
                          </p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-50 border-t border-slate-200 relative z-10">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Competitive Education Pricing</h2>
                  <p className="text-slate-500 max-w-2xl mx-auto">
                      Transparent, flat-rate pricing designed for K-12 budgets. Compare against legacy providers like Samsara, Zonar, and Transfinder.
                  </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                  {/* The Basic Bus */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col">
                      <div className="mb-6">
                          <h3 className="text-xl font-bold text-slate-900">The Basic Bus</h3>
                          <p className="text-slate-500 text-sm mt-2">Essential GPS tracking & student safety.</p>
                      </div>
                      <div className="mb-6">
                          <p className="text-2xl font-bold text-slate-900">Contact for Pricing</p>
                          <p className="text-xs text-slate-400 mt-1">Tailored to your district size</p>
                      </div>
                      <ul className="space-y-4 mb-8 flex-1">
                          <li className="flex items-center gap-2 text-sm text-slate-700"><Check size={16} className="text-blue-500" /> Live GPS Tracking</li>
                          <li className="flex items-center gap-2 text-sm text-slate-700"><Check size={16} className="text-blue-500" /> Real-time Ridership (RFID)</li>
                          <li className="flex items-center gap-2 text-sm text-slate-700"><Check size={16} className="text-blue-500" /> Speeding & Safety Alerts</li>
                      </ul>
                      <button onClick={() => setShowQuoteModal(true)} className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-colors">Request Quote</button>
                  </div>

                   {/* The Better Bus */}
                   <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col">
                      <div className="mb-6">
                          <h3 className="text-xl font-bold text-slate-900">The Better Bus</h3>
                          <p className="text-slate-500 text-sm mt-2">Full parent communication suite.</p>
                      </div>
                      <div className="mb-6">
                          <p className="text-2xl font-bold text-slate-900">Contact for Pricing</p>
                          <p className="text-xs text-slate-400 mt-1">Tailored to your district size</p>
                      </div>
                      <ul className="space-y-4 mb-8 flex-1">
                          <li className="flex items-center gap-2 text-sm text-slate-700"><Check size={16} className="text-blue-600" /> <strong>Everything in Basic Bus</strong></li>
                          <li className="flex items-center gap-2 text-sm text-slate-700"><Check size={16} className="text-blue-600" /> Parent Mobile App</li>
                          <li className="flex items-center gap-2 text-sm text-slate-700"><Check size={16} className="text-blue-600" /> Automated Delay Notifications</li>
                          <li className="flex items-center gap-2 text-sm text-slate-700"><Check size={16} className="text-blue-600" /> Tablet Kiosk Mode</li>
                          <li className="flex items-center gap-2 text-sm text-slate-700"><Check size={16} className="text-blue-600" /> Hardware Configuration</li>
                      </ul>
                      <button onClick={() => setShowQuoteModal(true)} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">Request Quote</button>
                  </div>

                  {/* The Best Bus */}
                  <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-8 flex flex-col text-white relative transform scale-105 z-10">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-purple-500/30">
                          Best Value
                      </div>
                      <div className="mb-6">
                          <h3 className="text-xl font-bold text-white">The Best Bus</h3>
                          <p className="text-slate-400 text-sm mt-2">Total fleet automation & AI logistics.</p>
                      </div>
                      <div className="mb-6">
                          <p className="text-2xl font-bold text-white">Contact for Pricing</p>
                          <p className="text-xs text-slate-500 mt-1">Tailored to your district size</p>
                      </div>
                      <ul className="space-y-4 mb-8 flex-1">
                          <li className="flex items-center gap-2 text-sm text-slate-300"><Check size={16} className="text-purple-500" /> <strong>Everything in Better Bus</strong></li>
                          <li className="flex items-center gap-2 text-sm text-slate-300"><Check size={16} className="text-purple-500" /> AI Route Optimization</li>
                          <li className="flex items-center gap-2 text-sm text-slate-300"><Check size={16} className="text-purple-500" /> Special Events & Field Trips</li>
                          <li className="flex items-center gap-2 text-sm text-slate-300"><Check size={16} className="text-purple-500" /> Logistics Analysis</li>
                          <li className="flex items-center gap-2 text-sm text-slate-300"><Check size={16} className="text-purple-500" /> Dedicated Success Manager</li>
                      </ul>
                      <button onClick={() => setShowQuoteModal(true)} className="w-full py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors border border-white/20">Request Quote</button>
                  </div>
              </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                    <div className="bg-blue-600 p-1.5 rounded text-white">
                        <Bus size={20} />
                    </div>
                    <span className="text-lg font-bold">RideSmart.ai</span>
                </div>
                <p className="text-slate-400 max-w-xs text-sm leading-relaxed">
                    Empowering school districts with next-generation logistics and safety tools.
                </p>
            </div>
            <div>
                <h4 className="font-bold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                    <li><a href="#" className="hover:text-white">Ridership Tracking</a></li>
                    <li><a href="#" className="hover:text-white">Fleet Management</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                    <li><a href="#" className="hover:text-white">About Us</a></li>
                    <li><button onClick={() => setShowLoginModal(true)} className="hover:text-white">Admin Portal</button></li>
                </ul>
            </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 mt-8 border-t border-slate-800 text-center text-xs text-slate-500">
            © 2024 RideSmart AI Technologies. All rights reserved.
        </div>
      </footer>

      {/* Email Simulation Modal */}
      {showEmailPreview && generatedQuote && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-300">
                  {/* Mock Email Window Header */}
                  <div className="bg-slate-100 border-b border-slate-300 p-3 flex items-center justify-between">
                      <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">Inbox — matt.monjan@infusedu.com</span>
                      <button onClick={() => setShowEmailPreview(false)} className="text-slate-400 hover:text-slate-600">
                          <X size={16} />
                      </button>
                  </div>
                  
                  {/* Mock Email Body */}
                  <div className="p-8 bg-white">
                      <div className="border-b border-slate-100 pb-6 mb-6">
                          <h2 className="text-xl font-bold text-slate-900 mb-2">New Quote Request: {generatedQuote.districtName}</h2>
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">RS</div>
                              <div>
                                  <p className="text-sm font-bold text-slate-800">RideSmart Auto-Mailer (noreply@ridesmart.ai)</p>
                                  <p className="text-xs text-slate-400">To: {quoteForm.email}</p>
                                  <p className="text-xs text-slate-400">BCC: matt.monjan@infusedu.com</p>
                              </div>
                          </div>
                      </div>
                      
                      <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
                          <p>Hello Matt & {quoteForm.contact},</p>
                          <p>A new pricing estimate has been generated for <strong>{quoteForm.district}</strong>.</p>
                          
                          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 my-4">
                              <p className="font-bold mb-2">Quote Summary</p>
                              <ul className="list-disc list-inside space-y-1 text-slate-600">
                                  <li><strong>Plan:</strong> {quoteForm.tier}</li>
                                  <li><strong>Students:</strong> {quoteForm.students}</li>
                                  <li><strong>Fleet Size:</strong> {quoteForm.buses} vehicles</li>
                                  <li><strong>Legacy Retrofits:</strong> {quoteForm.legacyBuses || 0} units</li>
                                  <li><strong>Total Value:</strong> ${generatedQuote.amount.toLocaleString()}</li>
                              </ul>
                          </div>

                          <p>The official quote PDF is attached to this email.</p>
                          <p>Best regards,<br/>The RideSmart Team</p>
                      </div>

                      <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-3">
                           <div className="h-12 w-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                               <FileText size={24} />
                           </div>
                           <div>
                               <p className="text-sm font-bold text-slate-800">Quote-{generatedQuote.id}.pdf</p>
                               <p className="text-xs text-slate-400">145 KB</p>
                           </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Quote Modal */}
      {showQuoteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
                  <div className="bg-blue-600 p-4 flex justify-between items-center text-white shrink-0">
                      <h3 className="font-bold text-lg">Request Pricing Quote</h3>
                      <button onClick={() => setShowQuoteModal(false)}><X size={20} /></button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto custom-scrollbar">
                      {!generatedQuote ? (
                          <form onSubmit={handleQuoteSubmit} className="space-y-4">
                              {/* Contact Info */}
                              <div>
                                  <label className="block text-sm font-bold text-slate-700 mb-1">District Name</label>
                                  <input required type="text" className="w-full border border-slate-300 rounded-lg p-2 text-sm" 
                                    value={quoteForm.district} onChange={e => setQuoteForm({...quoteForm, district: e.target.value})} />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-sm font-bold text-slate-700 mb-1">Contact Name</label>
                                      <input required type="text" className="w-full border border-slate-300 rounded-lg p-2 text-sm" 
                                        value={quoteForm.contact} onChange={e => setQuoteForm({...quoteForm, contact: e.target.value})} />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-bold text-slate-700 mb-1">Role</label>
                                      <select required className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-white"
                                        value={quoteForm.role} onChange={e => setQuoteForm({...quoteForm, role: e.target.value})}>
                                            <option value="">Select...</option>
                                            <option value="Superintendent">Superintendent</option>
                                            <option value="Transportation Director">Transportation Director</option>
                                            <option value="IT Director">IT Director</option>
                                            <option value="Business Manager">Business Manager</option>
                                            <option value="Other">Other</option>
                                      </select>
                                  </div>
                              </div>
                              <div>
                                  <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                                  <input required type="email" className="w-full border border-slate-300 rounded-lg p-2 text-sm" 
                                    value={quoteForm.email} onChange={e => setQuoteForm({...quoteForm, email: e.target.value})} />
                              </div>

                              {/* Plan Selection */}
                              <div>
                                  <label className="block text-sm font-bold text-slate-700 mb-1">Select Plan</label>
                                  <select required className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-white"
                                    value={quoteForm.tier} onChange={e => setQuoteForm({...quoteForm, tier: e.target.value as SubscriptionTier})}>
                                      <option value="BASIC">The Basic Bus</option>
                                      <option value="PROFESSIONAL">The Better Bus</option>
                                      <option value="ENTERPRISE">The Best Bus</option>
                                  </select>
                              </div>

                              {/* Metrics */}
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-sm font-bold text-slate-700 mb-1">Total Students</label>
                                      <input required type="number" className="w-full border border-slate-300 rounded-lg p-2 text-sm" 
                                        value={quoteForm.students} onChange={e => setQuoteForm({...quoteForm, students: e.target.value})} />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-bold text-slate-700 mb-1">Total Buses</label>
                                      <input required type="number" className="w-full border border-slate-300 rounded-lg p-2 text-sm" 
                                        value={quoteForm.buses} onChange={e => setQuoteForm({...quoteForm, buses: e.target.value})} />
                                  </div>
                              </div>
                              
                              {/* Hardware Retrofit Question */}
                              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                                  <label className="block text-sm font-bold text-slate-800 mb-1">Pre-2015 Buses (Legacy)</label>
                                  <p className="text-xs text-slate-500 mb-2">These vehicles require a hardware retrofit kit (USB/Dongle) for connectivity.</p>
                                  <div className="flex items-center gap-2">
                                      <Cable size={16} className="text-orange-600"/>
                                      <input 
                                        type="number" 
                                        placeholder="0"
                                        className="w-full border border-orange-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none" 
                                        value={quoteForm.legacyBuses} 
                                        onChange={e => setQuoteForm({...quoteForm, legacyBuses: e.target.value})} 
                                      />
                                  </div>
                              </div>

                              <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg mt-2">
                                  Generate Instant Quote
                              </button>
                          </form>
                      ) : (
                          <div className="animate-in fade-in slide-in-from-bottom-4">
                              <div id="quote-document" className="bg-white p-8 border border-slate-200 shadow-sm mb-6 font-poppins text-slate-800">
                                  {/* Invoice Header */}
                                  <div className="flex justify-between items-start mb-8 border-b-2 border-slate-900 pb-6">
                                      <div>
                                          <div className="flex items-center gap-2 text-blue-600 mb-2">
                                              <Bus size={24} />
                                              <span className="text-xl font-bold text-slate-900">RideSmart.ai</span>
                                          </div>
                                          <p className="text-xs text-slate-500">123 Innovation Drive<br/>Tech Valley, CA 94043</p>
                                      </div>
                                      <div className="text-right">
                                          <h2 className="text-2xl font-bold text-slate-900">QUOTE</h2>
                                          <p className="text-sm text-slate-500">#{generatedQuote.id}</p>
                                          <p className="text-sm text-slate-500">Date: {generatedQuote.submittedDate}</p>
                                      </div>
                                  </div>

                                  {/* Client Info */}
                                  <div className="mb-8">
                                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Prepared For</p>
                                      <p className="font-bold text-lg">{generatedQuote.districtName}</p>
                                      <p className="text-sm">{generatedQuote.contactName}</p>
                                      <p className="text-sm text-slate-500">{generatedQuote.email}</p>
                                  </div>

                                  {/* Line Items */}
                                  <table className="w-full mb-8">
                                      <thead>
                                          <tr className="border-b border-slate-200 text-left text-xs font-bold text-slate-500 uppercase">
                                              <th className="py-2">Description</th>
                                              <th className="py-2 text-right">Qty</th>
                                              <th className="py-2 text-right">Total</th>
                                          </tr>
                                      </thead>
                                      <tbody className="text-sm">
                                          <tr className="border-b border-slate-100">
                                              <td className="py-4">
                                                  <p className="font-bold text-slate-900">{generatedQuote.tier === 'ENTERPRISE' ? 'The Best Bus' : generatedQuote.tier === 'PROFESSIONAL' ? 'The Better Bus' : 'The Basic Bus'} Subscription</p>
                                                  <p className="text-xs text-slate-500">Annual Platform License & Support</p>
                                              </td>
                                              <td className="py-4 text-right">1</td>
                                              <td className="py-4 text-right font-mono">
                                                  ${(generatedQuote.amount - hardwareCost).toLocaleString()}
                                              </td>
                                          </tr>
                                          
                                          {generatedQuote.legacyBusCount && generatedQuote.legacyBusCount > 0 && (
                                              <tr className="border-b border-slate-100">
                                                  <td className="py-4">
                                                      <p className="font-bold text-slate-900">RideSmart Retrofit Kit</p>
                                                      <p className="text-xs text-slate-500">Hardware for pre-2015 vehicles (USB/Dongle)</p>
                                                  </td>
                                                  <td className="py-4 text-right">{generatedQuote.legacyBusCount}</td>
                                                  <td className="py-4 text-right font-mono">
                                                      ${hardwareCost.toLocaleString()}
                                                  </td>
                                              </tr>
                                          )}

                                          {discountDetails.perBus > 0 && (
                                             <tr className="border-b border-slate-100 bg-green-50/50">
                                                <td className="py-4 pl-2">
                                                    <p className="font-bold text-green-700">Volume Discount Applied</p>
                                                    <p className="text-xs text-green-600">Tiered savings for fleet > 100 buses</p>
                                                </td>
                                                <td className="py-4 text-right"></td>
                                                <td className="py-4 text-right font-mono text-green-700">
                                                    -${discountDetails.totalDiscount.toLocaleString()}
                                                </td>
                                            </tr>
                                          )}
                                      </tbody>
                                  </table>

                                  {/* Total */}
                                  <div className="flex justify-end border-t-2 border-slate-900 pt-4">
                                      <div className="text-right">
                                          <p className="text-sm font-bold text-slate-500 uppercase">Total Estimate</p>
                                          <p className="text-3xl font-bold text-blue-600">${generatedQuote.amount.toLocaleString()}</p>
                                          <p className="text-xs text-slate-400 mt-1">Valid for 30 days</p>
                                      </div>
                                  </div>
                              </div>

                              <div className="flex gap-3 print:hidden">
                                  <button 
                                    onClick={handlePrint}
                                    className="flex-1 py-3 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                                  >
                                      <Printer size={18} /> Print / Save PDF
                                  </button>
                                  <button 
                                    onClick={handleMailto}
                                    className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                  >
                                      <Mail size={18} /> Draft Email
                                  </button>
                              </div>
                              <button onClick={() => { setGeneratedQuote(null); setShowQuoteModal(false); }} className="w-full mt-3 text-slate-500 text-sm hover:underline">Close</button>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* PO Upload Modal */}
      {showPOModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                  <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
                      <h3 className="font-bold text-lg flex items-center gap-2"><Upload size={18} /> Upload Purchase Order</h3>
                      <button onClick={() => setShowPOModal(false)}><X size={20} /></button>
                  </div>
                  <div className="p-6">
                      {!poSubmitted ? (
                          <form onSubmit={handlePOSubmit} className="space-y-4">
                              <div>
                                  <label className="block text-sm font-bold text-slate-700 mb-1">District</label>
                                  <input required type="text" className="w-full border border-slate-300 rounded-lg p-2 text-sm" value={poForm.district} onChange={e => setPoForm({...poForm, district: e.target.value})} />
                              </div>
                              <div>
                                  <label className="block text-sm font-bold text-slate-700 mb-1">Contact Person</label>
                                  <input required type="text" className="w-full border border-slate-300 rounded-lg p-2 text-sm" value={poForm.contact} onChange={e => setPoForm({...poForm, contact: e.target.value})} />
                              </div>
                              <div>
                                  <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                                  <input required type="email" className="w-full border border-slate-300 rounded-lg p-2 text-sm" value={poForm.email} onChange={e => setPoForm({...poForm, email: e.target.value})} />
                              </div>
                              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                                  <input type="file" required className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                                  <Upload className="mx-auto text-slate-400 mb-2" size={24} />
                                  <p className="text-sm font-bold text-slate-600">{poForm.file ? poForm.file.name : "Click to upload PDF"}</p>
                              </div>
                              <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg">Submit PO</button>
                          </form>
                      ) : (
                          <div className="text-center py-8">
                              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <Check size={32} />
                              </div>
                              <h3 className="text-xl font-bold text-slate-800">PO Uploaded!</h3>
                              <p className="text-slate-500 text-sm mt-2">Our team has been notified and will process your order shortly.</p>
                              <button onClick={() => { setPoSubmitted(false); setShowPOModal(false); }} className="mt-6 text-blue-600 font-bold text-sm hover:underline">Close</button>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* Login Modal - Multi Tab */}
      {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                  {/* Header */}
                  <div className="bg-slate-900 p-6 text-center relative">
                      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/50">
                          <Bus size={32} className="text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                      <p className="text-slate-400 text-sm">Sign in to your RideSmart account</p>
                      <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={20}/></button>
                  </div>
                  
                  {/* Tabs */}
                  <div className="flex border-b border-slate-200">
                      <button 
                        onClick={() => setLoginTab('OFFICE')}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${loginTab === 'OFFICE' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                      >
                          Office
                      </button>
                      <button 
                        onClick={() => setLoginTab('DRIVER')}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${loginTab === 'DRIVER' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                      >
                          Driver
                      </button>
                      <button 
                        onClick={() => setLoginTab('SHOP')}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${loginTab === 'SHOP' ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                      >
                          Shop
                      </button>
                      <button 
                        onClick={() => setLoginTab('ADMIN')}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${loginTab === 'ADMIN' ? 'border-red-600 text-red-600 bg-red-50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                      >
                          Admin
                      </button>
                  </div>

                  {/* Body */}
                  <div className="p-8">
                      <div className="space-y-4">
                          {loginTab === 'OFFICE' && (
                              <>
                                  <div>
                                      <label className="block text-sm font-bold text-slate-700 mb-1">District ID / Tenant Code</label>
                                      <div className="relative">
                                          <LayoutDashboard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                          <input 
                                            type="text" 
                                            placeholder="e.g. TUSD-882 or 'admin'" 
                                            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                            value={districtId}
                                            onChange={(e) => setDistrictId(e.target.value)}
                                          />
                                      </div>
                                  </div>
                                  <div>
                                      <label className="block text-sm font-bold text-slate-700 mb-1">Simulation Plan</label>
                                      <select 
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500 bg-white cursor-pointer"
                                        value={simulatedTier}
                                        onChange={(e) => setSimulatedTier(e.target.value as SubscriptionTier)}
                                      >
                                          <option value="BASIC">The Basic Bus (Core)</option>
                                          <option value="PROFESSIONAL">The Better Bus (Mid-Tier)</option>
                                          <option value="ENTERPRISE">The Best Bus (Full Suite)</option>
                                      </select>
                                      <p className="text-xs text-slate-500 mt-1">Selects which features are unlocked for the demo.</p>
                                  </div>
                              </>
                          )}

                          {loginTab === 'DRIVER' && (
                              <div className="text-center py-4">
                                  <p className="text-sm text-slate-600 mb-4">
                                      Launch the simplified Driver App interface designed for in-vehicle tablets.
                                  </p>
                                  <div className="bg-slate-100 p-4 rounded-lg border border-slate-200 inline-block">
                                      <Tablet size={48} className="mx-auto text-slate-400 mb-2" />
                                      <p className="text-xs font-bold text-slate-500 uppercase">Kiosk Mode Ready</p>
                                  </div>
                              </div>
                          )}

                          {loginTab === 'SHOP' && (
                              <div className="text-center py-4">
                                  <p className="text-sm text-slate-600 mb-4">
                                      Access the Maintenance Console to view work orders and update vehicle status.
                                  </p>
                                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 inline-block mb-4">
                                      <Wrench size={48} className="mx-auto text-orange-500 mb-2" />
                                      <p className="text-xs font-bold text-orange-600 uppercase">Mechanic Portal</p>
                                  </div>
                                  <input 
                                    type="text" 
                                    placeholder="Enter Mechanic ID" 
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-orange-500 text-center"
                                  />
                              </div>
                          )}

                          {loginTab === 'ADMIN' && (
                              <div className="text-center py-4">
                                  <div className="bg-red-50 p-4 rounded-lg border border-red-100 inline-block mb-4">
                                      <Shield size={48} className="mx-auto text-red-500 mb-2" />
                                      <p className="text-xs font-bold text-red-600 uppercase">Super Admin Console</p>
                                  </div>
                                  <input 
                                    type="password" 
                                    placeholder="Enter Master Key" 
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 text-center mb-4"
                                  />
                                  <p className="text-xs text-slate-500 mb-4">Restricted access for RideSmart Controller only.</p>
                              </div>
                          )}

                          <button 
                            onClick={handleLoginSubmit}
                            className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transform transition-transform active:scale-95 ${
                                loginTab === 'SHOP' ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-600/20' : 
                                loginTab === 'ADMIN' ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20' : 
                                'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                            }`}
                          >
                              {loginTab === 'DRIVER' ? 'Launch Driver App' : 
                               loginTab === 'SHOP' ? 'Enter Shop Portal' : 
                               loginTab === 'ADMIN' ? 'Enter Controller Mode' : 
                               'Sign In to Dashboard'}
                          </button>

                           {/* Global Bypass Link (Always visible in footer) */}
                           <div className="text-center pt-4 border-t border-slate-100 mt-4">
                                <button 
                                    onClick={() => {
                                        onLogin('ADMIN');
                                        setShowLoginModal(false);
                                    }}
                                    className="text-xs text-slate-400 hover:text-blue-600 font-bold tracking-wide flex items-center justify-center gap-1 mx-auto transition-colors"
                                >
                                    <Lock size={10} /> Demo: Bypass Login (Super Admin)
                                </button>
                           </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Hardware Guide Modal (Simple Viewer) */}
      {showHardwareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
                  <div className="bg-slate-900 p-6 text-white flex justify-between items-center shrink-0">
                      <h2 className="text-2xl font-bold flex items-center gap-3">
                          <Tablet /> Recommended Hardware
                      </h2>
                      <button onClick={() => setShowHardwareModal(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={24}/></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                      <div className="grid md:grid-cols-2 gap-8">
                          {RECOMMENDED_HARDWARE.map((item) => (
                              <div key={item.id} className="flex gap-4 p-6 border border-slate-200 rounded-xl hover:shadow-lg transition-shadow">
                                  <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 ${
                                      item.category === 'tablet' ? 'bg-purple-100 text-purple-600' : 
                                      item.category === 'scanner' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                                  }`}>
                                      {item.category === 'tablet' ? <Tablet size={32} /> : item.category === 'scanner' ? <Scan size={32} /> : <Cable size={32} />}
                                  </div>
                                  <div>
                                      <h3 className="font-bold text-lg text-slate-900">{item.name}</h3>
                                      <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded mb-2">{item.priceRange}</span>
                                      <p className="text-slate-600 text-sm mb-3">{item.description}</p>
                                      <div className="flex items-center gap-2 text-xs font-bold text-green-600">
                                          <CheckCircle2 size={14} /> Verified Compatible
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default LandingPage;
