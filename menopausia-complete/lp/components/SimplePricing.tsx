import React from 'react';

interface SimplePricingContent {
    title: string;
    subtitle: string;
    price: string;
    cta: string;
    details: string;
    checkoutUrl: string;
}

interface SimplePricingProps {
    content: SimplePricingContent;
}

const SimplePricing: React.FC<SimplePricingProps> = ({ content }) => {
    return (
        <section id="pricing" className="py-24 bg-navy-900 text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-500/10 via-navy-900 to-navy-900 pointer-events-none"></div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10 text-center">

                <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 leading-tight">
                    {content.title}
                </h2>

                <p className="text-xl text-slate-300 mb-12 font-light leading-relaxed whitespace-pre-line">
                    {content.subtitle}
                </p>

                <div className="bg-white/5 backdrop-blur-sm border border-gold-500/30 rounded-3xl p-10 md:p-14 mb-10 transform hover:scale-[1.01] transition-transform duration-500 shadow-2xl">
                    <div className="flex flex-col items-center space-y-6">
                        <span className="text-gold-400 font-bold tracking-widest uppercase text-sm">
                            Oferta Especial
                        </span>
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <span className="text-xl md:text-2xl text-slate-400 line-through decoration-gold-600/50 decoration-2">
                                De US$ 19,90
                            </span>
                            <span className="text-5xl md:text-7xl font-serif font-bold text-white">
                                por {content.price}
                            </span>
                        </div>
                        <div className="w-full pt-4">
                            <a
                                href={content.checkoutUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 font-bold text-lg md:text-xl py-5 px-8 rounded-full hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all transform hover:-translate-y-1"
                            >
                                {content.cta}
                            </a>
                        </div>
                    </div>
                </div>

                <p className="text-slate-400 text-sm md:text-base font-medium tracking-wide uppercase">
                    {content.details}
                </p>

            </div>
        </section>
    );
};

export default SimplePricing;
