import React from 'react';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQSectionContent {
    items: FAQItem[];
    closing: string;
    cta: string;
    checkoutUrl?: string;
}

interface FAQSectionProps {
    content: FAQSectionContent;
}

const FAQSection: React.FC<FAQSectionProps> = ({ content }) => {
    return (
        <section className="py-24 bg-white text-navy-900">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">

                <div className="space-y-10 mb-16">
                    {content.items.map((item, index) => (
                        <div key={index} className="border-b border-slate-100 pb-8 last:border-0">
                            <h3 className="text-xl font-bold text-navy-900 mb-3">{item.question}</h3>
                            <p className="text-lg text-slate-600 leading-relaxed">{item.answer}</p>
                        </div>
                    ))}
                </div>

                <div className="text-center bg-navy-50 rounded-2xl p-10 border border-navy-100">
                    <p className="text-xl font-serif text-navy-900 italic mb-8">
                        {content.closing}
                    </p>

                    <a
                        href={content.checkoutUrl || "#pricing"}
                        target={content.checkoutUrl ? "_blank" : "_self"}
                        rel={content.checkoutUrl ? "noopener noreferrer" : ""}
                        className="inline-block bg-navy-900 text-white px-8 py-4 rounded-full font-bold hover:bg-navy-800 transition-colors"
                    >
                        {content.cta}
                    </a>
                </div>

            </div>
        </section>
    );
};

export default FAQSection;
