import React from 'react';

interface GuideContentsContent {
    title: string;
    items: {
        bold: string;
        text: string;
    }[];
    closing: string;
}

interface GuideContentsProps {
    content: GuideContentsContent;
}

const GuideContents: React.FC<GuideContentsProps> = ({ content }) => {
    return (
        <section className="py-24 bg-white text-navy-900 border-t border-navy-100">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">

                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-navy-900 leading-tight">
                        {content.title}
                    </h2>
                    <div className="h-1 w-24 bg-gold-500 mx-auto mt-6 rounded-full"></div>
                </div>

                <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100 shadow-lg">
                    <ul className="space-y-6">
                        {content.items.map((item, index) => (
                            <li key={index} className="flex items-start space-x-4">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                                        ✓
                                    </div>
                                </div>
                                <p className="text-lg text-slate-700 leading-relaxed">
                                    <span className="font-bold text-navy-900">{item.bold}</span> {item.text}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-12 text-center max-w-2xl mx-auto">
                    <p className="text-xl font-serif text-slate-500 italic leading-relaxed whitespace-pre-line">
                        {content.closing}
                    </p>
                </div>

            </div>
        </section>
    );
};

export default GuideContents;
