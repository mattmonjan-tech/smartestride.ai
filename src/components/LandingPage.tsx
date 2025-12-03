
import React, { useState, useEffect } from 'react';
import { Bus, CheckCircle2, ArrowRight, Upload, X, FileText, Tablet, Scan, Cable, Check, Zap, Navigation, Printer, Mail, Map, Brain, DollarSign, Wrench, Lock, LayoutDashboard, User, AlertCircle, Shield } from 'lucide-react';
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
      legacyBuses: '',
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

      // Volume Discount Logic
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
          amount: grandTotal, // Total value of the deal
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

  const handlePrint = () => {
    const printContent = document.getElementById('quote-document');
    if (!printContent) return;

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
              <p className="text-xs text
