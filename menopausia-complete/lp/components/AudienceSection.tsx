import React from 'react';

interface AudienceSectionContent {
    forYou: {
        title: string;
        items: string[];
    };
    notForYou: {
        title: string;
        items: string[];
    };
}

interface AudienceSectionProps {
    content: AudienceSectionContent;
}

const AudienceSection: React.FC<AudienceSectionProps> = ({ content }) => {
    return (
        <section className="py-24 bg-slate-50 text-navy-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="grid md:grid-cols-2 gap-12">

                    {/* For You */}
                    <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
                        <h3 className="text-2xl font-serif font-bold text-navy-900 mb-8 flex items-center">
                            <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mr-3 text-sm">✓</span>
                            {content.forYou.title}
                        </h3>
                        <ul className="space-y-4">
                            {content.forYou.items.map((item, index) => (
                                <li key={index} className="flex items-start text-lg text-slate-700">
                                    <span className="mr-3 text-emerald-500 font-bold">✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Not For You */}
                    <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 opacity-80">
                        <h3 className="text-2xl font-serif font-bold text-slate-500 mb-8 flex items-center">
                            <span className="w-8 h-8 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mr-3 text-sm">✕</span>
                            {content.notForYou.title}
                        </h3>
                        <ul className="space-y-4">
                            {content.notForYou.items.map((item, index) => (
                                <li key={index} className="flex items-start text-lg text-slate-500">
                                    <span className="mr-3 text-slate-300 font-bold">✕</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AudienceSection;
