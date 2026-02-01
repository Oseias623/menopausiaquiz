import React from 'react';

interface GuaranteeContent {
    title: string;
    text: string;
    items: string[];
}

interface GuaranteeSectionProps {
    content: GuaranteeContent;
}

const GuaranteeSection: React.FC<GuaranteeSectionProps> = ({ content }) => {
    return (
        <section className="py-16 bg-white border-b border-slate-100">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <div className="bg-navy-50 rounded-3xl p-8 md:p-12 border border-navy-100 flex flex-col md:flex-row items-center md:items-start gap-8">

                    <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-gold-200 text-gold-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                <path d="M9 12l2 2 4-4" />
                            </svg>
                        </div>
                    </div>

                    <div className="text-center md:text-left space-y-4">
                        <h3 className="text-2xl font-serif font-bold text-navy-900">
                            {content.title}
                        </h3>
                        <div className="text-slate-600 leading-relaxed text-lg space-y-4">
                            <p className="whitespace-pre-line">{content.text}</p>
                            <ul className="space-y-2 mt-4 inline-block text-left">
                                {content.items.map((item, index) => (
                                    <li key={index} className="flex items-center gap-2 text-navy-800 font-medium text-sm md:text-base">
                                        <span className="text-gold-500">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default GuaranteeSection;
