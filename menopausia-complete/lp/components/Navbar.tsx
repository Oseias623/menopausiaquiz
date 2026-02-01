
import React from 'react';

interface NavbarProps {
  businessName: string;
}

const Navbar: React.FC<NavbarProps> = ({ businessName }) => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-navy-900/90 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <span className="text-2xl font-serif font-black bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent uppercase tracking-tight">
              {businessName || "Lumina"}
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-300 hover:text-gold-400 font-medium transition-colors text-xs uppercase tracking-[0.15em]">Benefícios</a>
            <a href="#pricing" className="text-slate-300 hover:text-gold-400 font-medium transition-colors text-xs uppercase tracking-[0.15em]">Investimento</a>
            <a href="#testimonials" className="text-slate-300 hover:text-gold-400 font-medium transition-colors text-xs uppercase tracking-[0.15em]">Depoimentos</a>
            <a
              href="https://pay.hotmart.com/A103597268E?checkoutMode=10"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border border-gold-500 text-gold-400 px-6 py-2 rounded-full font-bold hover:bg-gold-500 hover:text-navy-900 transition-all text-xs uppercase tracking-widest"
            >
              ¡DESCARGAR AHORA!
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
