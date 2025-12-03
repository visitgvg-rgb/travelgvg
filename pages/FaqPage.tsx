import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n';
import type { MultiLangString, FaqCategory } from '../types';
import Breadcrumbs from '../components/Breadcrumbs';
import ChevronDownIcon from '../components/icons/ChevronDownIcon';

interface FaqItemProps {
    id: string;
    question: string;
    answer: string;
    isOpen: boolean;
    onToggle: (id: string) => void;
}

const FaqAccordionItem: React.FC<FaqItemProps> = ({ id, question, answer, isOpen, onToggle }) => {
    return (
        <div className="border-b border-gray-200 dark:border-gray-700">
            <h2>
                <button
                    type="button"
                    className="flex justify-between items-center w-full p-5 font-semibold text-left text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => onToggle(id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-content-${id}`}
                >
                    <span>{question}</span>
                    <ChevronDownIcon className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            </h2>
            <div
                id={`faq-content-${id}`}
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                    <div
                        className="p-5 text-gray-600 dark:text-gray-400 prose dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: answer }}
                    ></div>
                </div>
            </div>
        </div>
    );
};


const FaqPage: React.FC = () => {
    const { t, language } = useTranslation();
    const lang = language as keyof MultiLangString;

    const [faqData, setFaqData] = useState<FaqCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [openItems, setOpenItems] = useState<string[]>([]);

    useEffect(() => {
        const fetchFaqData = async () => {
            setLoading(true);
            try {
                const response = await fetch('/data/faq.json');
                const data: FaqCategory[] = await response.json();
                setFaqData(data);
            } catch (error) {
                console.error("Failed to fetch FAQ data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFaqData();
    }, []);

    const toggleItem = (id: string) => {
        setOpenItems(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };
    
    const SkeletonLoader = () => (
        <div className="animate-pulse">
            {[...Array(2)].map((_, catIndex) => (
                <div key={catIndex} className="mb-12">
                    <div className="h-8 w-1/3 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                        {[...Array(2)].map((_, itemIndex) => (
                            <div key={itemIndex} className="p-5 border-b border-gray-200 dark:border-gray-700">
                                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <>
            <Breadcrumbs />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black text-brand-text dark:text-gray-100">{t('faqPage.title')}</h1>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{t('faqPage.subtitle')}</p>
                </div>
                
                <div className="max-w-4xl mx-auto">
                    {loading ? <SkeletonLoader /> : (
                        faqData.map((category, catIndex) => (
                            <div key={category.category} className="mb-12">
                                <h2 className="text-2xl md:text-3xl font-serif font-bold text-brand-accent mb-6">{category.title[lang]}</h2>
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                                    {category.items.map((item, itemIndex) => {
                                        const id = `${category.category}-${itemIndex}`;
                                        return (
                                            <FaqAccordionItem
                                                key={id}
                                                id={id}
                                                question={item.question[lang]}
                                                answer={item.answer[lang]}
                                                isOpen={openItems.includes(id)}
                                                onToggle={toggleItem}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default FaqPage;
