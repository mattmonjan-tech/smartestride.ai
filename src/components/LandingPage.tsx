import React, { useState } from 'react';
import { Bus, CheckCircle2, ArrowRight, Upload, X, FileText, Tablet, Scan, Cable, Check, Zap, Navigation, Printer, Mail, Map, Brain, DollarSign, Wrench, Lock, LayoutDashboard, User, AlertCircle, Shield } from 'lucide-react';
import { RECOMMENDED_HARDWARE } from '../constants';
import { SubscriptionTier, QuoteRequest } from '../types';
import { InteractiveHeroDemo, FeaturesSection, PricingSection, FooterSection } from './MarketingComponents';

interface LandingPageProps {
    onLogin: (role: 'CLIENT' | 'ADMIN' | 'DRIVER' | 'MAINTENANCE', tier?: SubscriptionTier) => void;
    onQuoteRequest?: (quote: QuoteRequest) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onQuoteRequest }) => {
    const [showQuoteModal, setShowQuoteModal] = useState(false);
    const [showPOModal, setShowPOModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showHardwareModal, setShowHardwareModal] = useState(false);
    const [simulatedTier, setSimulatedTier] = useState<SubscriptionTier>('ENTERPRISE');
    const [showToast, setShowToast] = useState(false);
    const [showEmailPreview, setShowEmailPreview] = useState(false);

    const [loginTab, setLoginTab] = useState<'OFFICE' | 'DRIVER' | 'SHOP' | 'ADMIN'>('OFFICE');
    const [districtId, setDistrictId] = useState('');

    const [quoteForm, setQuoteForm] = useState({
        district: '',
        contact: '',
        role: '',
        email: '',
        students: '',

        newBuses: '',
        oldBuses: '',
        tier: 'PROFESSIONAL' as SubscriptionTier
    });
    const [generatedQuote, setGeneratedQuote] = useState<QuoteRequest | null>(null);
    const [discountDetails, setDiscountDetails] = useState({ perBus: 0, totalDiscount: 0 });
    const [hardwareCost, setHardwareCost] = useState(0);

    const [poForm, setPoForm] = useState({
        district: '',
        contact: '',
        email: '',
        file: null as File | null
    });
    const [poSubmitted, setPoSubmitted] = useState(false);

    const handleQuoteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newBusCount = parseInt(quoteForm.newBuses) || 0;
        const oldBusCount = parseInt(quoteForm.oldBuses) || 0;
        const busCount = newBusCount + oldBusCount;
        const legacyCount = oldBusCount;

        let basePrice = 0;
        let perBusPrice = 0;

        switch (quoteForm.tier) {
            case 'BASIC': basePrice = 3000; perBusPrice = 200; break;
            case 'PROFESSIONAL': basePrice = 5000; perBusPrice = 400; break;
            case 'ENTERPRISE': basePrice = 10000; perBusPrice = 600; break;
        }

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

        setDiscountDetails({ perBus: discountPerBus, totalDiscount: busCount * discountPerBus });
        setHardwareCost(hardwareTotal);

        const newQuote: QuoteRequest = {
            id: `Q-${Date.now()}`,
            districtName: quoteForm.district,
            contactName: quoteForm.contact,
            contactRole: quoteForm.role,
            email: quoteForm.email,
            studentCount: parseInt(quoteForm.students) || 0,
            busCount: busCount,

            newBusCount: newBusCount,
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
            printWindow.document.write(`<html><head><title>RideSmart Quote</title></head><body>${printContent.innerHTML}</body></html>`);
            printWindow.document.close();
        }
    };

    const handleMailto = () => {
        if (!generatedQuote) return;
        const subject = `RideSmart Quote #${generatedQuote.id} for ${generatedQuote.districtName}`;
        const body = `Hello ${generatedQuote.contactName},\n\nQuote attached.\n\nBest regards,\nRideSmart AI Team`;
        const mailtoUrl = `mailto:${quoteForm.email}?bcc=matt.monjan@infusedu.com&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoUrl, '_blank');
    };

    const handlePOSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTimeout(() => {
            setPoSubmitted(true);
        }, 1500);
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPoForm({ ...poForm, file: e.target.files[0] });
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 relative">
            {/* Notification Toast */}
            {showToast && (
                <div className="fixed top-24 right-6 z-[60] bg-slate-900 text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 duration-300 border border-slate-800 max-w-md">
                    <div className="bg-green-500 rounded-full p-1.5 shadow-lg shadow-green-500/20"><Check size={18} className="text-white" strokeWidth={3} /></div>
                    <div className="flex-1">
                        <p className="font-bold text-sm text-white">Quote Generated Successfully</p>
                        <button onClick={() => setShowEmailPreview(true)} className="text-[10px] font-bold text-blue-300 hover:text-blue-200 underline mt-2">View Internal Notification</button>
                    </div>
                    <button onClick={() => setShowToast(false)} className="ml-2 text-slate-500 hover:text-white self-start"><X size={16} /></button>
                </div>
            )}

            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
                        <div className="bg-blue-600 p-2 rounded-lg text-white"><Bus size={24} /></div>
                        <span className="text-xl font-bold tracking-tight">RideSmart<span className="text-blue-600">.ai</span></span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                        <a href="#features" className="hover:text-blue-600 transition-colors" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}>Features</a>
                        <button onClick={() => setShowHardwareModal(true)} className="hover:text-blue-600 transition-colors">Hardware Guide</button>
                        <a href="#pricing" className="hover:text-blue-600 transition-colors" onClick={(e) => { e.preventDefault(); document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); }}>Pricing</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setShowPOModal(true)} className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Upload size={16} /> Upload PO</button>
                        <button onClick={() => setShowLoginModal(true)} className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">Login</button>
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
                    <div className="w-full"><InteractiveHeroDemo /></div>
                </div>
            </header>

            {/* Features Section */}
            <FeaturesSection />

            {/* Pricing Section */}
            <PricingSection onQuoteRequest={() => setShowQuoteModal(true)} />

            {/* Footer */}
            <FooterSection onLogin={() => setShowLoginModal(true)} />

            {/* Email Simulation Modal */}
            {showEmailPreview && generatedQuote && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-300">
                        <div className="bg-slate-100 border-b border-slate-300 p-3 flex items-center justify-between">
                            <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-red-400"></div><div className="w-3 h-3 rounded-full bg-yellow-400"></div><div className="w-3 h-3 rounded-full bg-green-400"></div></div>
                            <span className="text-xs text-slate-500 font-medium">Inbox — matt.monjan@infusedu.com</span>
                            <button onClick={() => setShowEmailPreview(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
                        </div>
                        <div className="p-8 bg-white">
                            <div className="border-b border-slate-100 pb-6 mb-6">
                                <h2 className="text-xl font-bold text-slate-900 mb-2">New Quote Request: {generatedQuote.districtName}</h2>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">RS</div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">RideSmart Auto-Mailer</p>
                                        <p className="text-xs text-slate-400">To: {quoteForm.email}</p>
                                        <p className="text-xs text-slate-400">BCC: matt.monjan@infusedu.com</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
                                <p>Hello Matt & {quoteForm.contact},</p>
                                <p>A new pricing estimate has been generated for <strong>{quoteForm.district}</strong>.</p>
                                <p>The official quote PDF is attached to this email.</p>
                                <p>Best regards,<br />The RideSmart Team</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Quote Modal */}
            {showQuoteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="bg-blue-600 p-4 flex justify-between items-center text-white shrink-0"><h3 className="font-bold text-lg">Request Pricing Quote</h3><button onClick={() => setShowQuoteModal(false)}><X size={20} /></button></div>
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            {!generatedQuote ? (
                                <form onSubmit={handleQuoteSubmit} className="space-y-4">
                                    <div><label className="block text-sm font-bold text-slate-700 mb-1">District Name</label><input required type="text" className="w-full border border-slate-300 rounded-lg p-2 text-sm" value={quoteForm.district} onChange={e => setQuoteForm({ ...quoteForm, district: e.target.value })} /></div>
                                    <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-bold text-slate-700 mb-1">Contact Name</label><input required type="text" className="w-full border border-slate-300 rounded-lg p-2 text-sm" value={quoteForm.contact} onChange={e => setQuoteForm({ ...quoteForm, contact: e.target.value })} /></div><div><label className="block text-sm font-bold text-slate-700 mb-1">Role</label><select required className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-white" value={quoteForm.role} onChange={e => setQuoteForm({ ...quoteForm, role: e.target.value })}><option value="">Select...</option><option value="Superintendent">Superintendent</option><option value="Transportation Director">Transportation Director</option><option value="Other">Other</option></select></div></div>
                                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Email</label><input required type="email" className="w-full border border-slate-300 rounded-lg p-2 text-sm" value={quoteForm.email} onChange={e => setQuoteForm({ ...quoteForm, email: e.target.value })} /></div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1">Buses (2016+)</label>
                                            <div className="flex items-center gap-2">
                                                <Bus size={16} className="text-blue-600" />
                                                <input required type="number" placeholder="0" className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={quoteForm.newBuses} onChange={e => setQuoteForm({ ...quoteForm, newBuses: e.target.value })} />
                                            </div>
                                            <p className="text-[10px] text-slate-400 mt-1">No hardware fee</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1">Buses (2015 & Older)</label>
                                            <div className="flex items-center gap-2">
                                                <Cable size={16} className="text-orange-600" />
                                                <input required type="number" placeholder="0" className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none" value={quoteForm.oldBuses} onChange={e => setQuoteForm({ ...quoteForm, oldBuses: e.target.value })} />
                                            </div>
                                            <p className="text-[10px] text-orange-500 mt-1">+$172.50/bus setup</p>
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg mt-2">Generate Instant Quote</button>
                                </form>
                            ) : (
                                <div className="animate-in fade-in slide-in-from-bottom-4">
                                    <div id="quote-document" className="bg-white p-10 border border-slate-200 shadow-xl mb-6 font-sans text-slate-800 printable-content">
                                        {/* Header */}
                                        <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-8">
                                            <div>
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="bg-blue-600 p-2 rounded-lg text-white"><Bus size={24} /></div>
                                                    <span className="text-xl font-bold tracking-tight text-slate-900">RideSmart<span className="text-blue-600">.ai</span></span>
                                                </div>
                                                <p className="text-sm text-slate-500">123 Innovation Drive<br />Tech Valley, CA 94025<br />billing@ridesmart.ai</p>
                                            </div>
                                            <div className="text-right">
                                                <h2 className="text-3xl font-bold text-slate-900 mb-2">QUOTE</h2>
                                                <p className="text-sm text-slate-500"><strong>Quote #:</strong> {generatedQuote.id}</p>
                                                <p className="text-sm text-slate-500"><strong>Date:</strong> {generatedQuote.submittedDate}</p>
                                                <p className="text-sm text-slate-500"><strong>Expires:</strong> {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        {/* Client Info */}
                                        <div className="mb-8 p-6 bg-slate-50 rounded-lg">
                                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Bill To</h3>
                                            <p className="font-bold text-lg text-slate-900">{generatedQuote.districtName}</p>
                                            <p className="text-sm text-slate-600">{generatedQuote.contactName} ({generatedQuote.contactRole})</p>
                                            <p className="text-sm text-slate-600">{generatedQuote.email}</p>
                                        </div>

                                        {/* Line Items */}
                                        <table className="w-full mb-8">
                                            <thead>
                                                <tr className="border-b-2 border-slate-100 text-left">
                                                    <th className="py-3 text-sm font-bold text-slate-600">Description</th>
                                                    <th className="py-3 text-sm font-bold text-slate-600 text-center">Qty</th>
                                                    <th className="py-3 text-sm font-bold text-slate-600 text-right">Unit Price</th>
                                                    <th className="py-3 text-sm font-bold text-slate-600 text-right">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {/* Software Subscription */}
                                                <tr>
                                                    <td className="py-4">
                                                        <p className="font-bold text-slate-800">RideSmart {generatedQuote.tier} Subscription</p>
                                                        <p className="text-xs text-slate-500">Annual recurring fee for AI routing and fleet logistics platform.</p>
                                                    </td>
                                                    <td className="py-4 text-center font-mono">{generatedQuote.busCount}</td>
                                                    <td className="py-4 text-right font-mono text-slate-400">-</td>
                                                    <td className="py-4 text-right font-bold text-slate-800">
                                                        ${(generatedQuote.amount - (generatedQuote.hardwareCost || 0)).toLocaleString()}
                                                    </td>
                                                </tr>

                                                {/* Hardware */}
                                                {(generatedQuote.hardwareCost || 0) > 0 && (
                                                    <tr>
                                                        <td className="py-4">
                                                            <p className="font-bold text-slate-800">Legacy Hardware Retrofit Kit</p>
                                                            <p className="text-xs text-slate-500">GPS & Telematics unit for pre-2016 vehicles.</p>
                                                        </td>
                                                        <td className="py-4 text-center font-mono">{generatedQuote.legacyBusCount}</td>
                                                        <td className="py-4 text-right font-mono">$172.50</td>
                                                        <td className="py-4 text-right font-bold text-slate-800">
                                                            ${(generatedQuote.hardwareCost || 0).toLocaleString()}
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>

                                        {/* Totals */}
                                        <div className="flex justify-end border-t-2 border-slate-900 pt-6">
                                            <div className="w-1/2">
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-slate-500 font-medium">Subtotal</span>
                                                    <span className="font-bold text-slate-800">${generatedQuote.amount.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between mb-4">
                                                    <span className="text-slate-500 font-medium">Tax (0%)</span>
                                                    <span className="font-bold text-slate-800">$0.00</span>
                                                </div>
                                                <div className="flex justify-between text-xl border-t border-slate-200 pt-4">
                                                    <span className="font-extrabold text-slate-900">Total</span>
                                                    <span className="font-extrabold text-blue-600">${generatedQuote.amount.toLocaleString()}</span>
                                                </div>
                                                <p className="text-xs text-slate-400 mt-2 text-right">Annual billing cycle.</p>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="mt-12 pt-8 border-t border-slate-100 text-center">
                                            <p className="text-sm font-bold text-slate-900 mb-2">Thank you for choosing RideSmart!</p>
                                            <p className="text-xs text-slate-500">This quote is valid for 30 days. To accept this quote, please sign and return to sales@ridesmart.ai or upload the PO via the dashboard.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={handlePrint} className="flex-1 py-3 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 transition-colors flex items-center justify-center gap-2">
                                            <Printer size={16} /> Print / Save PDF
                                        </button>
                                        <button onClick={() => { setGeneratedQuote(null); setShowQuoteModal(false); }} className="px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50">
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ... Other Modals (Hardware, PO, Login) code is similar to previous and can be included here or managed as separate files ... */}
            {/* Login Modal - Multi Tab */}
            {showLoginModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="bg-slate-900 p-6 text-center relative"><div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/50"><Bus size={32} className="text-white" /></div><h2 className="text-2xl font-bold text-white">Welcome Back</h2><p className="text-slate-400 text-sm">Sign in to your RideSmart account</p><button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={20} /></button></div>
                        <div className="flex border-b border-slate-200">{['OFFICE', 'DRIVER', 'SHOP', 'ADMIN'].map(tab => (<button key={tab} onClick={() => setLoginTab(tab as any)} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${loginTab === tab ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{tab}</button>))}</div>
                        <div className="p-8">
                            <div className="space-y-4">
                                {loginTab === 'OFFICE' && (<div><label className="block text-sm font-bold text-slate-700 mb-1">District ID</label><input type="text" placeholder="e.g. TUSD-882" className="w-full pl-4 pr-4 py-3 border border-slate-300 rounded-lg outline-none" value={districtId} onChange={(e) => setDistrictId(e.target.value)} /></div>)}
                                {loginTab === 'ADMIN' && (<div className="text-center py-4"><div className="bg-red-50 p-4 rounded-lg border border-red-100 inline-block mb-4"><Shield size={48} className="mx-auto text-red-500 mb-2" /><p className="text-xs font-bold text-red-600 uppercase">Super Admin Console</p></div><input type="password" placeholder="Master Key" className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 text-center mb-4" /></div>)}
                                <button onClick={handleLoginSubmit} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg">{loginTab === 'DRIVER' ? 'Launch Driver App' : loginTab === 'SHOP' ? 'Enter Shop Portal' : loginTab === 'ADMIN' ? 'Enter Controller Mode' : 'Sign In to Dashboard'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LandingPage;
