
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n';
import SearchIcon from './icons/SearchIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';
import type { MultiLangString } from '../types';

interface SearchResultItem {
    id: string;
    title: MultiLangString;
    description: MultiLangString; // or shortDescription
    image: string;
    category: string;
    path: string; // The route path e.g., '/accommodation'
    isStory?: boolean;
}

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
    const { t, language, getLocalizedPath } = useTranslation();
    const lang = language as keyof MultiLangString;
    const navigate = useNavigate();
    
    const [query, setQuery] = useState('');
    const [data, setData] = useState<SearchResultItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => document.body.classList.remove('modal-open');
    }, [isOpen]);

    // Fetch and aggregate data only once when the component mounts or first opens
    useEffect(() => {
        const fetchData = async () => {
            if (data.length > 0) return; // Data already loaded
            setIsLoading(true);
            
            try {
                const sources = [
                    { file: '/data/accommodation.json', path: '/accommodation' },
                    { file: '/data/restaurants.json', path: '/restaurants' },
                    { file: '/data/shopping.json', path: '/shopping' },
                    { file: '/data/zabava.json', path: '/entertainment' },
                    { file: '/data/atrakcii.json', path: '/attractions' },
                    { file: '/data/vinski-raj.json', path: '/wine-paradise' },
                    { file: '/data/pomos.json', path: '/pomos-na-pat' },
                    { file: '/data/gas-stations.json', path: '/gas-stations' },
                    // Stories are handled slightly differently but we can map them
                    { file: '/data/prikazni.json', path: '/stories', isStory: true },
                ];

                const responses = await Promise.all(sources.map(src => fetch(src.file)));
                const jsonResults = await Promise.all(responses.map(res => res.json()));

                let aggregatedData: SearchResultItem[] = [];

                jsonResults.forEach((items, index) => {
                    const source = sources[index];
                    const normalizedItems = items.map((item: any) => {
                        // Normalize image (take first or default)
                        let image = '';
                        if (item.images && item.images.length > 0) image = item.images[0];
                        else if (item.image) image = item.image;
                        
                        // Handle Story path logic
                        let finalPath = source.path;
                        if (source.isStory) {
                            finalPath = `/stories/${item.id}`; // Direct link for stories
                        }

                        return {
                            id: item.id,
                            title: item.title,
                            description: item.shortDescription || item.description,
                            image: image,
                            category: item.category,
                            path: finalPath,
                            isStory: source.isStory
                        };
                    });
                    aggregatedData = [...aggregatedData, ...normalizedItems];
                });

                setData(aggregatedData);
            } catch (error) {
                console.error("Error loading search data", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen) {
            fetchData();
        }
    }, [isOpen, data.length]);

    const filteredResults = useMemo(() => {
        if (!query) return [];
        const lowerQuery = query.toLowerCase();
        return data.filter(item => {
            const title = item.title[lang]?.toLowerCase() || '';
            // For description, sometimes it might be missing or just one string if malformed, checking safety
            const desc = typeof item.description === 'object' && item.description[lang] 
                ? item.description[lang].toLowerCase() 
                : '';
            
            // Translate the category key (e.g., 'restorani') to the current language (e.g., 'Ресторан')
            // allowing users to search by category name.
            const categoryName = t(`categories.${item.category}`).toLowerCase();
            
            return title.includes(lowerQuery) || desc.includes(lowerQuery) || categoryName.includes(lowerQuery);
        }).slice(0, 10); // Limit to 10 results for performance
    }, [query, data, lang, t]);

    const handleNavigate = (item: SearchResultItem) => {
        onClose();
        let targetPath = item.path;
        if (!item.isStory) {
            targetPath = `${item.path}?open=${item.id}`;
        }
        
        // This generates the prefixed URL: /mk/accommodation...
        navigate(getLocalizedPath(targetPath));
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-start justify-center pt-4 sm:pt-24 px-4 animate-fade-in-fast"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            ></div>

            {/* Modal Panel */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-zoom-slide-up ring-1 ring-black/5">
                
                {/* Input Header */}
                <div className="flex items-center border-b border-gray-200 dark:border-gray-700 p-4 gap-3">
                    <SearchIcon className="w-6 h-6 text-gray-400" />
                    <input
                        ref={inputRef}
                        type="text"
                        className="flex-1 bg-transparent border-none outline-none text-lg text-gray-900 dark:text-gray-100 placeholder-gray-400"
                        placeholder={t('nav.explore') + "..."}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button 
                        onClick={onClose}
                        className="px-2 py-1 text-xs font-semibold text-gray-500 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        ESC
                    </button>
                </div>

                {/* Results Area */}
                <div className="overflow-y-auto custom-scrollbar flex-1">
                    {isLoading && data.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <div className="inline-block w-6 h-6 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mb-2"></div>
                            <p>Loading data...</p>
                        </div>
                    ) : query === '' ? (
                        <div className="p-12 text-center text-gray-400 dark:text-gray-500">
                            <SearchIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p className="text-sm">{t('nav.explore')}</p>
                        </div>
                    ) : filteredResults.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            <p>No results found for "{query}"</p>
                        </div>
                    ) : (
                        <div className="py-2">
                            {filteredResults.map((item) => (
                                <div 
                                    key={`${item.category}-${item.id}`}
                                    onClick={() => handleNavigate(item)}
                                    className="group flex items-center gap-4 px-4 py-3 mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                                >
                                    <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-600">
                                        {item.image ? (
                                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <SearchIcon className="w-6 h-6" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex-grow min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                                                {item.title[lang]}
                                            </h4>
                                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-accent/10 text-brand-accent font-semibold uppercase tracking-wide whitespace-nowrap">
                                                {t(`categories.${item.category}`)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {item.description[lang]}
                                        </p>
                                    </div>
                                    
                                    <ChevronRightIcon className="w-5 h-5 text-gray-300 group-hover:text-brand-accent transition-colors" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Footer */}
                <div className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 p-3 text-xs text-gray-500 flex justify-between items-center">
                    <span><strong>{filteredResults.length}</strong> results</span>
                    <span className="hidden sm:inline">Use arrow keys to navigate, Enter to select</span>
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
