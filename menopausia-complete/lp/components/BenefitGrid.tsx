
import React from 'react';
import { Feature } from '../types';
import Icon from './Icon';

interface BenefitGridProps {
  features: Feature[];
}

const BenefitGrid: React.FC<BenefitGridProps> = ({ features }) => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 md:text-5xl mb-6">Como este guia vai te ajudar na vida real</h2>
          <p className="text-slate-600 text-xl max-w-2xl mx-auto">Um caminho simples, sem julgamentos e focado em resultados imediatos.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(features.length > 0 ? features : Array(6).fill(null)).map((f, i) => (
            <div key={i} className="p-8 bg-slate-50 border border-slate-100 rounded-2xl hover:shadow-xl transition-all flex flex-col">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                <Icon name="Check" size={28} className="stroke-[3px]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{f?.title || "Benefício"}</h3>
              <p className="text-slate-600 leading-relaxed">{f?.description || "Descrição detalhada de como este ponto específico resolve seu problema."}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitGrid;
