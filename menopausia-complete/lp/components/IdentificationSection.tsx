import React from 'react';

interface IdentificationContent {
    title: string;
    items: string[];
    cta: string;
}

interface IdentificationSectionProps {
    content: IdentificationContent;
}

const IdentificationSection: React.FC<IdentificationSectionProps> = ({ content }) => {
    return (
        <section className="py-20 bg-navy-900 text-white relative overflow-hidden border-y border-gold-metallic/20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">

                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-serif text-slate-200 tracking-wide uppercase">
                        {content.title}
                    </h2>
                    <div className="h-px w-24 bg-gold-500 mx-auto mt-6"></div>
                </div>

                <div className="space-y-4">
                    {content.items.map((item, index) => (
                        <div key={index} className="flex items-start space-x-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-gold-500/30 transition-colors">
                            <div className="flex-shrink-0 mt-1">
                                <div className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center text-xs font-bold ring-1 ring-gold-500/50">
                                    ✓
                                </div>
                            </div>
                            <p className="text-lg text-slate-200 font-light leading-snug">
                                {item}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center bg-navy-800/50 p-8 rounded-2xl border border-gold-500/30">
                    <p className="text-xl md:text-2xl font-serif text-gold-400 italic font-medium leading-relaxed whitespace-pre-line">
                        {content.cta}
                    </p>
                </div>

            </div>
        </section>
    );
};

export default IdentificationSection;
