
import React from 'react';
import { PricingPlan } from '../types';
import Icon from './Icon';

interface PricingProps {
  pricing: PricingPlan[];
}

const Pricing: React.FC<PricingProps> = ({ pricing }) => {
  const plan = pricing[0];
  return (
    <section id="pricing" className="py-24 bg-[#0f1115]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
          <div className="bg-amber-500 py-3 text-center text-slate-900 font-black uppercase tracking-widest text-sm">
            Oferta Especial por Tempo Limitado
          </div>
          <div className="p-8 md:p-12 text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Acesso Completo ao Guia</h3>
            <div className="flex items-center justify-center my-8">
              <span className="text-2xl font-bold text-slate-400 mr-2">R$</span>
              <span className="text-7xl font-black text-slate-900 tracking-tighter">{plan?.price || "67,90"}</span>
            </div>
            
            <ul className="space-y-4 mb-10 text-left max-w-xs mx-auto">
              {(plan?.features || ["Acesso Vitalício", "Suporte VIP", "Bônus Exclusivos"]).map((f, i) => (
                <li key={i} className="flex items-center text-slate-600 font-medium">
                  <Icon name="Check" size={20} className="text-emerald-500 mr-3" />
                  {f}
                </li>
              ))}
            </ul>

            <button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 py-6 rounded-xl font-black text-2xl shadow-xl shadow-amber-200 transition-all active:scale-95 mb-4">
              {plan?.cta || "QUERO COMEÇAR AGORA"}
            </button>
            <p className="text-slate-400 text-xs uppercase font-bold tracking-widest">
              <Icon name="ShieldCheck" size={12} className="inline mr-1 mb-0.5" /> Pagamento 100% Seguro
            </p>
          </div>
          <div className="bg-slate-50 p-6 border-t border-slate-100 flex items-center justify-center text-slate-500 text-sm italic">
            <Icon name="RefreshCcw" size={20} className="mr-3 text-amber-500" />
            7 dias de garantia incondicional. Risco zero.
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
