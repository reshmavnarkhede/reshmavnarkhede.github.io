import React, { useState, useEffect } from 'react';

// Custom Styles injected directly into the component
const styles = `
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;600;800&display=swap');
    
    .font-mono-custom {
        font-family: 'JetBrains Mono', monospace;
    }
    .scan-line {
        width: 100%;
        height: 2px;
        background: rgba(34, 197, 94, 0.5);
        position: absolute;
        z-index: 10;
        animation: scan 3s linear infinite;
        display: none;
        pointer-events: none;
    }
    .scanning .scan-line {
        display: block;
    }
    @keyframes scan {
        0% { top: 0%; }
        100% { top: 100%; }
    }
    .glass-panel {
        background: rgba(30, 41, 59, 0.7);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .modal-overlay {
        background: rgba(15, 23, 42, 0.85);
        backdrop-filter: blur(8px);
    }
    .ticket-input {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(148, 163, 184, 0.2);
        color: #e2e8f0;
        transition: all 0.3s ease;
    }
    .ticket-input:focus {
        outline: none;
        border-color: #22c55e;
        background: rgba(15, 23, 42, 0.9);
    }
    /* Mobile Optimization: Better touch scrolling */
    .smooth-scroll {
        -webkit-overflow-scrolling: touch;
    }
    /* Custom Scrollbar */
    ::-webkit-scrollbar {
        width: 8px;
    }
    ::-webkit-scrollbar-track {
        background: #0f172a; 
    }
    ::-webkit-scrollbar-thumb {
        background: #334155; 
        border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: #475569; 
    }
`;

// Icons Components (with aria-hidden for accessibility)
const Icons = {
    Terminal: ({ className, size = 24 }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>,
    CheckCircle: ({ className, size = 24 }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>,
    Bug: ({ className, size = 24 }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="8" height="14" x="8" y="6" rx="4"></rect><path d="m19 7-3 2"></path><path d="m5 7 3 2"></path><path d="m19 19-3-2"></path><path d="m5 19 3-2"></path><path d="M20 13h-4"></path><path d="M4 13h4"></path><path d="m10 4 1 2"></path><path d="m14 4-1 2"></path></svg>,
    Play: ({ className, size = 24 }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>,
    Award: ({ className, size = 24 }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>,
    Briefcase: ({ className, size = 24 }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>,
    Mail: ({ className, size = 24 }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>,
    Linkedin: ({ className, size = 24 }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>,
    Code: ({ className, size = 24 }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>,
    FileText: ({ className, size = 24 }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>,
    Server: ({ className, size = 24 }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect><rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>,
    X: ({ className, size = 24 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
};

const SkillBar = ({ label, percent, color }) => (
    <div className="space-y-1 group">
        <div className="flex justify-between text-xs font-mono-custom">
            <span className="text-slate-300 group-hover:text-white transition-colors">{label}</span>
            <span className="text-slate-500 group-hover:text-green-400 transition-colors">{percent}%</span>
        </div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full ${color} rounded-full transition-all duration-1000 ease-out group-hover:brightness-110`} style={{ width: `${percent}%` }}></div>
        </div>
    </div>
);

const Badge = ({ title, issuer, color, bg, border }) => (
    <div className={`flex flex-col items-center justify-center p-4 rounded-lg border ${bg} ${border} text-center transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-${color.replace('text-', '')}-500/20`}>
        <div className={`mb-2 ${color}`}>
            <Icons.Award size={32} />
        </div>
        <h4 className={`font-bold text-sm ${color}`}>{title}</h4>
        <p className="text-xs text-slate-400 mt-1">{issuer}</p>
    </div>
);

const StatsCard = ({ value, label, icon: Icon, color }) => (
    <div className="glass-panel p-4 rounded-xl text-center transform transition-all hover:scale-105">
        <div className={`flex justify-center mb-2 text-${color}-400`}>
            <Icon size={24} />
        </div>
        <div className={`text-2xl font-bold text-${color}-400 font-mono-custom`}>{value}</div>
        <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">{label}</div>
    </div>
);

const ContactModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] modal-overlay flex items-center justify-center p-4 animate-fade-in">
            <div className="glass-panel w-full max-w-lg p-6 rounded-xl border border-slate-600 shadow-2xl relative animate-slide-up">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                    aria-label="Close modal"
                >
                    <Icons.X size={24} />
                </button>

                <div className="mb-6 border-b border-slate-700 pb-4">
                    <div className="flex items-center space-x-2 text-green-400 mb-1">
                        <Icons.Bug size={20} />
                        <span className="font-mono-custom font-bold">CREATE DEFECT (CONTACT)</span>
                    </div>
                    <p className="text-sm text-slate-400">Log a new inquiry ticket directly to my inbox.</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-mono-custom text-slate-400 mb-1">PROJECT / COMPANY</label>
                        <input type="text" placeholder="e.g. Hiring Team @ TechCorp" className="w-full p-3 rounded-lg ticket-input font-mono-custom text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-mono-custom text-slate-400 mb-1">SEVERITY / PRIORITY</label>
                        <select className="w-full p-3 rounded-lg ticket-input font-mono-custom text-sm">
                            <option>High - Immediate Interview</option>
                            <option>Medium - Project Discussion</option>
                            <option>Low - General Inquiry</option>
                        </select>
                    </div>
                    
                    <div className="pt-4 flex space-x-3">
                        <a 
                            href="mailto:reshmavnarkhede@gmail.com" 
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold text-center transition-colors flex items-center justify-center space-x-2"
                        >
                            <Icons.Mail size={18} />
                            <span>Create Ticket (Email)</span>
                        </a>
                        <button 
                            onClick={onClose}
                            className="px-6 py-3 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function App() {
    const [testStatus, setTestStatus] = useState('IDLE'); // IDLE, RUNNING, PASSED
    const [activeSection, setActiveSection] = useState('overview');
    const [consoleLogs, setConsoleLogs] = useState([]);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);

    // SEO Optimization: Set Meta Tags and Title Dynamically
    useEffect(() => {
        document.title = "Reshma Narkhede | Senior Test Analyst (ISTQB Certified)";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "Portfolio of Reshma Narkhede, a Senior Test Analyst with 6+ years in Insurance & Retirement Services domains.");
        } else {
            const meta = document.createElement('meta');
            meta.name = "description";
            meta.content = "Portfolio of Reshma Narkhede, a Senior Test Analyst with 6+ years in Insurance & Retirement Services domains.";
            document.head.appendChild(meta);
        }
    }, []);

    const addLog = (msg) => {
        setConsoleLogs(prev => [...prev, `> ${msg}`]);
    };

    const runTests = () => {
        if (testStatus === 'RUNNING') return;
        setTestStatus('RUNNING');
        setConsoleLogs(['Initializing Test Suite...']);
        
        const steps = [
            { msg: 'Loading User Profile: Reshma Narkhede...', delay: 800 },
            { msg: 'Verifying ISTQB Certifications... [OK]', delay: 1600 },
            { msg: 'Checking Domain Knowledge (Insurance & Retirement)... [OK]', delay: 2400 },
            { msg: 'Validating Automation Scripts... [OK]', delay: 3000 },
            { msg: 'Test Suite Execution Complete. All Checks Passed.', delay: 3800 }
        ];

        steps.forEach(({ msg, delay }, index) => {
            setTimeout(() => {
                addLog(msg);
                if (index === steps.length - 1) {
                    setTestStatus('PASSED');
                }
            }, delay);
        });
    };

    const NavItem = ({ id, label, icon: Icon }) => (
        <button 
            onClick={() => {
                setActiveSection(id);
                setShowMobileMenu(false);
                // Mobile UX: Scroll to top when changing sections on mobile
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex items-center space-x-2 px-4 py-3 md:py-2 rounded-lg transition-all w-full md:w-auto touch-manipulation ${
                activeSection === id 
                ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                : 'text-slate-400 hover:bg-slate-800'
            }`}
            aria-current={activeSection === id ? 'page' : undefined}
        >
            <Icon size={18} />
            <span>{label}</span>
        </button>
    );

    return (
        <div className={`min-h-screen bg-slate-900 text-slate-200 font-sans relative overflow-hidden smooth-scroll ${testStatus === 'RUNNING' ? 'scanning' : ''}`}>
            <style>{styles}</style>
            <div className="scan-line" aria-hidden="true"></div>
            
            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
            
            {/* Floating Background Elements */}
            <div className="fixed top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
            <div className="fixed bottom-20 right-10 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse pointer-events-none"></div>

            {/* Navigation */}
            <header className="fixed top-0 w-full z-50 glass-panel border-b border-slate-700">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-2 font-mono-custom font-bold text-xl tracking-tighter text-white z-50">
                        <span className="text-green-500" aria-hidden="true">{`{`}</span>
                        <h1 className="text-lg md:text-xl">QA_Reshma</h1>
                        <span className="text-green-500" aria-hidden="true">{`}`}</span>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex space-x-2" aria-label="Main Navigation">
                        <NavItem id="overview" label="Overview" icon={Icons.Terminal} />
                        <NavItem id="experience" label="Pipeline" icon={Icons.Server} />
                        <NavItem id="skills" label="Coverage" icon={Icons.CheckCircle} />
                        <NavItem id="certifications" label="Badges" icon={Icons.Award} />
                    </nav>

                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden text-white p-2 rounded-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        aria-label="Toggle navigation menu"
                        aria-expanded={showMobileMenu}
                    >
                        {showMobileMenu ? <span className="font-bold text-xl">✕</span> : <Icons.Terminal />}
                    </button>
                </div>

                {/* Mobile Nav Overlay */}
                {showMobileMenu && (
                    <nav className="md:hidden p-4 glass-panel border-t border-slate-700 space-y-2 animate-fade-in" aria-label="Mobile Navigation">
                        <NavItem id="overview" label="Overview" icon={Icons.Terminal} />
                        <NavItem id="experience" label="Pipeline" icon={Icons.Server} />
                        <NavItem id="skills" label="Coverage" icon={Icons.CheckCircle} />
                        <NavItem id="certifications" label="Badges" icon={Icons.Award} />
                    </nav>
                )}
            </header>

            {/* Main Content */}
            <main className="pt-24 pb-12 px-4 max-w-5xl mx-auto space-y-12">
                
                {/* HERO SECTION */}
                <section aria-labelledby="hero-heading" className={`${activeSection === 'overview' ? 'block' : 'hidden md:block'}`}>
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="flex-1 space-y-6">
                                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-green-900/30 text-green-400 border border-green-500/30 font-mono-custom text-sm">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span>System Status: Online</span>
                                </div>
                                
                                <header>
                                    <h2 id="hero-heading" className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tight">
                                        Reshma Narkhede
                                    </h2>
                                    <p className="text-xl md:text-2xl text-slate-400 font-mono-custom">
                                        Senior Test Analyst <span className="text-green-500">|</span> ISTQB Certified
                                    </p>
                                </header>

                                <p className="text-slate-300 leading-relaxed text-lg max-w-2xl">
                                    Results-driven Quality Engineer with over <strong className="text-white">6 years of experience</strong> ensuring high-quality software delivery. Expert in Insurance & Retirement Services workflows, Agile methodologies, and robust defect management.
                                </p>

                                <div className="flex flex-wrap gap-4">
                                    <button 
                                        onClick={runTests}
                                        disabled={testStatus === 'RUNNING'}
                                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 active:scale-95 touch-manipulation ${
                                            testStatus === 'PASSED' 
                                            ? 'bg-green-600 hover:bg-green-700 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]' 
                                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                                        }`}
                                        aria-label="Run interactive portfolio diagnostics"
                                    >
                                        {testStatus === 'RUNNING' ? (
                                            <span className="flex items-center"><Icons.Terminal className="animate-spin mr-2"/> Running...</span>
                                        ) : testStatus === 'PASSED' ? (
                                            <span className="flex items-center"><Icons.CheckCircle className="mr-2"/> Tests Passed</span>
                                        ) : (
                                            <span className="flex items-center"><Icons.Play className="mr-2"/> Run Diagnostics</span>
                                        )}
                                    </button>
                                    
                                    <button 
                                        onClick={() => setIsContactOpen(true)}
                                        className="px-6 py-3 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors flex items-center space-x-2 touch-manipulation group"
                                    >
                                        <Icons.Bug size={18} className="group-hover:text-red-400 transition-colors" />
                                        <span>Report Defect (Contact)</span>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Console Output */}
                            <div className="w-full md:w-96 bg-slate-950 rounded-lg p-4 font-mono-custom text-sm border border-slate-800 shadow-2xl min-h-[200px]" aria-live="polite">
                                <div className="flex space-x-1.5 mb-3 border-b border-slate-800 pb-2" aria-hidden="true">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="ml-auto text-xs text-slate-600">bash — 80x24</span>
                                </div>
                                <div className="space-y-1 text-green-400/90 h-32 overflow-y-auto custom-scrollbar">
                                    <div className="text-slate-500">Last login: {new Date().toLocaleDateString()} on ttys001</div>
                                    <div className="text-slate-300">$ init_portfolio.sh --user=reshma</div>
                                    {consoleLogs.map((log, i) => (
                                        <div key={i} className="animate-fade-in">{log}</div>
                                    ))}
                                    {testStatus === 'RUNNING' && (
                                        <div className="animate-pulse">_</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Stats Dashboard */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <StatsCard value="6+" label="Years Experience" icon={Icons.Briefcase} color="blue" />
                            <StatsCard value="4" label="ISTQB Certs" icon={Icons.Award} color="green" />
                            <StatsCard value="100%" label="Insurance Domain" icon={Icons.FileText} color="purple" />
                            <StatsCard value="Senior" label="Analyst Role" icon={Icons.CheckCircle} color="orange" />
                        </div>
                    </div>
                </section>

                {/* EXPERIENCE PIPELINE */}
                <section id="experience" aria-labelledby="experience-heading" className={`${activeSection === 'experience' || activeSection === 'overview' ? 'block' : 'hidden'}`}>
                    <div className="flex items-center space-x-3 mb-8">
                        <Icons.Server className="text-blue-400" size={32} />
                        <h2 id="experience-heading" className="text-3xl font-bold text-white">Execution Pipeline</h2>
                    </div>

                    <div className="space-y-8 relative pl-8 border-l-2 border-slate-700 ml-4 md:ml-0">
                        {/* Job 1 - Accenture */}
                        <article className="relative group">
                            <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-blue-500 border-4 border-slate-900 group-hover:scale-125 transition-transform" aria-hidden="true"></div>
                            <div className="glass-panel p-6 rounded-xl hover:bg-slate-800/50 transition-colors border-l-4 border-l-blue-500">
                                <header className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Quality Engineering Senior Analyst</h3>
                                        <p className="text-blue-400 font-mono-custom">Accenture</p>
                                    </div>
                                    <time className="text-sm text-slate-500 font-mono-custom mt-1 md:mt-0" dateTime="2024-10">Oct 2024 - Present</time>
                                </header>
                                <p className="text-slate-400 text-sm mb-4">Mumbai, Maharashtra</p>
                                <ul className="list-disc list-inside text-slate-300 space-y-1 text-sm">
                                    <li>Leading quality assurance for <strong>Insurance & Retirement Services</strong> domain projects.</li>
                                    <li>Implementing rigorous test strategies for defect minimization.</li>
                                </ul>
                            </div>
                        </article>

                        {/* Job 2 - LTIMindtree */}
                        <article className="relative group">
                            <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-green-500 border-4 border-slate-900 group-hover:scale-125 transition-transform" aria-hidden="true"></div>
                            <div className="glass-panel p-6 rounded-xl hover:bg-slate-800/50 transition-colors border-l-4 border-l-green-500">
                                <header className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Quality Engineer</h3>
                                        <p className="text-green-400 font-mono-custom">LTIMindtree</p>
                                    </div>
                                    <time className="text-sm text-slate-500 font-mono-custom mt-1 md:mt-0" dateTime="2022-11">Nov 2022 - Oct 2024</time>
                                </header>
                                <p className="text-slate-400 text-sm mb-4">Navi Mumbai, Maharashtra</p>
                                <ul className="list-disc list-inside text-slate-300 space-y-1 text-sm">
                                    <li>Awarded "Super Crew Award" for exceptional performance.</li>
                                    <li>Specialized in <strong>Insurance domain workflows</strong>.</li>
                                    <li>Expertise in JIRA and TestRail for management.</li>
                                </ul>
                            </div>
                        </article>

                        {/* Job 3 - LTI */}
                        <article className="relative group">
                            <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-purple-500 border-4 border-slate-900 group-hover:scale-125 transition-transform" aria-hidden="true"></div>
                            <div className="glass-panel p-6 rounded-xl hover:bg-slate-800/50 transition-colors border-l-4 border-l-purple-500">
                                <header className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Quality Engineer</h3>
                                        <p className="text-purple-400 font-mono-custom">LTI - Larsen & Toubro Infotech</p>
                                    </div>
                                    <time className="text-sm text-slate-500 font-mono-custom mt-1 md:mt-0" dateTime="2021-07">July 2021 - Nov 2022</time>
                                </header>
                                <ul className="list-disc list-inside text-slate-300 space-y-1 text-sm mt-2">
                                    <li>Executed Agile testing methodologies.</li>
                                    <li>Cross-functional collaboration for defect resolution.</li>
                                </ul>
                            </div>
                        </article>
                        
                        {/* Job 4 - Reliance */}
                        <article className="relative group">
                            <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-slate-500 border-4 border-slate-900 group-hover:scale-125 transition-transform" aria-hidden="true"></div>
                            <div className="glass-panel p-6 rounded-xl hover:bg-slate-800/50 transition-colors border-l-4 border-l-slate-500">
                                <header className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Software Test Engineer</h3>
                                        <p className="text-slate-400 font-mono-custom">Reliance General Insurance</p>
                                    </div>
                                    <time className="text-sm text-slate-500 font-mono-custom mt-1 md:mt-0" dateTime="2020-02">Feb 2020 - July 2021</time>
                                </header>
                                <p className="text-slate-300 text-sm mt-2">
                                    Started career in core insurance domain testing, building foundational knowledge in underwriting and policy admin workflows.
                                </p>
                            </div>
                        </article>
                    </div>
                </section>

                {/* SKILLS COVERAGE */}
                <section id="skills" aria-labelledby="skills-heading" className={`${activeSection === 'skills' || activeSection === 'overview' ? 'block' : 'hidden'}`}>
                    <div className="flex items-center space-x-3 mb-8">
                        <Icons.CheckCircle className="text-green-400" size={32} />
                        <h2 id="skills-heading" className="text-3xl font-bold text-white">Test Coverage (Skills)</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Skill Group 1 */}
                        <div className="glass-panel p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                                <Icons.Bug className="mr-2 text-red-400" size={20}/> Core Competencies
                            </h3>
                            <div className="space-y-4">
                                <SkillBar label="Manual Testing" percent={95} color="bg-green-500" />
                                <SkillBar label="Test Design & Execution" percent={90} color="bg-green-500" />
                                <SkillBar label="Defect Management" percent={92} color="bg-green-500" />
                                <SkillBar label="Agile/Scrum" percent={88} color="bg-blue-500" />
                            </div>
                        </div>

                        {/* Skill Group 2 */}
                        <div className="glass-panel p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                                <Icons.Code className="mr-2 text-purple-400" size={20}/> Tools & Tech
                            </h3>
                            <div className="space-y-4">
                                <SkillBar label="JIRA / TestRail" percent={90} color="bg-purple-500" />
                                <SkillBar label="SQL (Database Testing)" percent={80} color="bg-purple-500" />
                                <SkillBar label="Postman (API Testing)" percent={85} color="bg-purple-500" />
                                <SkillBar label="DevOps Tools" percent={70} color="bg-slate-500" />
                            </div>
                        </div>

                        {/* Skill Group 3 */}
                        <div className="glass-panel p-6 rounded-xl md:col-span-2">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                                <Icons.FileText className="mr-2 text-yellow-400" size={20}/> Domain Knowledge
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {['Insurance', 'Underwriting', 'Policy Admin', 'Billing', 'Retirement Services'].map(tag => (
                                    <span key={tag} className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 text-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* CERTIFICATIONS */}
                <section id="certifications" aria-labelledby="certs-heading" className={`${activeSection === 'certifications' || activeSection === 'overview' ? 'block' : 'hidden'}`}>
                    <div className="flex items-center space-x-3 mb-8">
                        <Icons.Award className="text-yellow-400" size={32} />
                        <h2 id="certs-heading" className="text-3xl font-bold text-white">Verified Certifications</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <Badge title="ISTQB Agile Tester" issuer="ISTQB" color="text-orange-400" bg="bg-orange-900/20" border="border-orange-500/30" />
                        <Badge title="ISTQB Foundation" issuer="ISTQB" color="text-blue-400" bg="bg-blue-900/20" border="border-blue-500/30" />
                        <Badge title="Scrum Foundation (SFPCM)" issuer="CertiProf" color="text-green-400" bg="bg-green-900/20" border="border-green-500/30" />
                        <Badge title="Postman Admin" issuer="Postman" color="text-red-400" bg="bg-red-900/20" border="border-red-500/30" />
                    </div>

                    <div className="mt-8 glass-panel p-6 rounded-xl border border-slate-700">
                        <h3 className="text-xl font-bold text-white mb-2">Education</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                                <div>
                                    <p className="font-bold text-slate-200">Master's in Computer Science</p>
                                    <p className="text-sm text-slate-400">Vivekanand Arts, Sardar Dalip Singh Commerce & Science College</p>
                                </div>
                                <span className="text-xs text-slate-500 font-mono-custom">2015-2017</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-slate-200">Bachelor's in Computer Science</p>
                                    <p className="text-sm text-slate-400">Vivekanand Arts, Sardar Dalip Singh Commerce & Science College</p>
                                </div>
                                <span className="text-xs text-slate-500 font-mono-custom">2012-2015</span>
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="pt-12 pb-8 border-t border-slate-800 text-center text-slate-500 text-sm">
                    <p>© 2025 Reshma Narkhede. All tests passed.</p>
                    <div className="flex justify-center space-x-6 mt-4">
                        <a href="mailto:reshmavnarkhede@gmail.com" className="hover:text-green-400 transition-colors flex items-center space-x-1" aria-label="Send Email">
                            <Icons.Mail size={16}/> <span>Email</span>
                        </a>
                        <a href="https://linkedin.com/in/reshmapatilnarkhede" className="hover:text-blue-400 transition-colors flex items-center space-x-1" aria-label="Visit LinkedIn Profile">
                            <Icons.Linkedin size={16}/> <span>LinkedIn</span>
                        </a>
                    </div>
                </footer>

            </main>
        </div>
    );
}
