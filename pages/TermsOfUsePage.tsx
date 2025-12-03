import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n';
import type { MultiLangString, TermSection } from '../types';
import Breadcrumbs from '../components/Breadcrumbs';

const TermsOfUsePage: React.FC = () => {
    const { t, language } = useTranslation();
    const lang = language as keyof MultiLangString;

    const [termsData, setTermsData] = useState<TermSection[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTermsData = async () => {
            setLoading(true);
            try {
                const response = await fetch('/data/terms.json');
                const data: TermSection[] = await response.json();
                setTermsData(data);
            } catch (error) {
                console.error("Failed to fetch Terms of Use data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTermsData();
    }, []);

    const SkeletonLoader = () => (
        <div className="animate-pulse">
            <div className="h-8 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>
            <div className="space-y-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
             <div className="h-8 w-1/2 bg-gray-300 dark:bg-gray-700 rounded my-8"></div>
             <div className="space-y-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
        </div>
    );

    return (
        <>
            <Breadcrumbs />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="max-w-4xl mx-auto">
                    <header className="text-center mb-12">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black text-brand-text dark:text-gray-100">{t('termsOfUsePage.title')}</h1>
                    </header>
                    
                    <article className="prose dark:prose-invert lg:prose-lg max-w-none text-gray-700 dark:text-gray-300">
                        {loading ? <SkeletonLoader /> : (
                            termsData.map((section, index) => (
                                <section key={index} className="mb-8">
                                    <h2 className="text-2xl font-serif font-bold text-brand-text dark:text-gray-200">{section.title[lang]}</h2>
                                    <div dangerouslySetInnerHTML={{ __html: section.content[lang] }} />
                                </section>
                            ))
                        )}
                    </article>
                </div>
            </div>
        </>
    );
};

export default TermsOfUsePage;
