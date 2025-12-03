
import React, { useState, useEffect, useMemo, useRef } from 'react';
import FilterBar from '../components/FilterBar';
import EventCard from '../components/EventCard';
import Breadcrumbs from '../components/Breadcrumbs';
import type { Event, MultiLangString } from '../types';
import TicketIcon from '../components/icons/TicketIcon';
import { useTranslation } from '../i18n';
import SEO from '../components/SEO';
import ChevronDownIcon from '../components/icons/ChevronDownIcon';

// Skeleton Component
const SkeletonEventCard: React.FC = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row animate-pulse">
        <div className="md:w-1/3 h-48 md:h-auto bg-gray-300 dark:bg-gray-700"></div>
        <div className="md:w-2/3 p-5 flex flex-col">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-20 h-20 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                <div className="flex-grow mt-1">
                    <div className="h-4 w-1/4 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
                    <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full my-6"></div>
            <div className="mt-auto border-t dark:border-gray-700 pt-4 space-y-3">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
        </div>
    </div>
);

const EventsPage: React.FC = () => {
    const { t, language } = useTranslation();
    const lang = language as keyof MultiLangString;
    const [allEvents, setAllEvents] = useState<Event[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
    const [activeFilter, setActiveFilter] = useState(t('filters.all'));
    const [loading, setLoading] = useState(true);
    const isInitialMount = useRef(true);
    
    // UI State for Mobile Collapsible Header
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    const filters = [t('filters.all'), t('filters.music'), t('filters.culture'), t('filters.gastronomy'), t('filters.sport')];
    
    const filterCategoryMap: { [key: string]: string } = {
        [t('filters.music')]: "music",
        [t('filters.culture')]: "culture",
        [t('filters.gastronomy')]: "gastronomy",
        [t('filters.sport')]: "sport"
    };

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const response = await fetch('/data/events.json');
                const data: Event[] = await response.json();
                // Sort events by date, newest first
                data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setAllEvents(data);
                setFilteredEvents(data);
            } catch (error) {
                console.error("Failed to fetch events data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        setActiveFilter(t('filters.all'));
    }, [t]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const listingsGrid = document.getElementById('listings-grid');
        const header = document.querySelector('header');
        
        if (listingsGrid && header) {
            const headerHeight = header.offsetHeight;
            const gridTop = listingsGrid.getBoundingClientRect().top;
            
            if (gridTop < headerHeight) {
                const newScrollY = window.scrollY + gridTop - headerHeight - 16;
                 window.scrollTo({
                    top: newScrollY,
                    behavior: 'smooth'
                });
            }
        }
    }, [filteredEvents]);

    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
        if (filter === t('filters.all')) {
            setFilteredEvents(allEvents);
        } else {
            const categoryToFilter = filterCategoryMap[filter];
            const filtered = allEvents.filter(event => event.category === categoryToFilter);
            setFilteredEvents(filtered);
        }
    };

    return (
        <>
            <SEO title={t('seo.events')} />
            <Breadcrumbs />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-2 md:pt-4 pb-10">
                {/* Mobile Collapsible Title & Info */}
                <div className="text-left mb-4 md:mb-8">
                    <button 
                        onClick={() => setIsInfoOpen(!isInfoOpen)}
                        className="w-full flex items-center justify-start gap-2 group outline-none select-none md:cursor-default"
                        aria-expanded={isInfoOpen}
                    >
                        <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif font-black text-brand-text dark:text-gray-100 text-left">
                            {t('eventsPage.title')}
                        </h1>
                        <ChevronDownIcon 
                            className={`w-6 h-6 text-brand-text dark:text-white transition-transform duration-300 md:hidden ${isInfoOpen ? 'rotate-180' : ''}`} 
                        />
                    </button>
                </div>

                <div 
                    className={`overflow-hidden transition-all duration-500 ease-in-out md:max-h-none md:opacity-100
                    ${isInfoOpen ? 'max-h-[1000px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'} md:mb-10`}
                >
                    <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-indigo-200/50 dark:border-indigo-500/30 rounded-2xl shadow-xl overflow-hidden p-6 flex items-start sm:items-center space-x-4">
                        <div className="hidden md:block flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full">
                            <TicketIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">{t('eventsPage.infoBoxTitle')}</h3>
                            <p className="text-sm mt-1 text-gray-600 dark:text-gray-300 font-medium leading-relaxed">{t('eventsPage.infoBoxDesc')}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm rounded-lg mb-8 dark:border dark:border-gray-700">
                    <FilterBar filters={filters} activeFilter={activeFilter} onFilterChange={handleFilterChange} />
                </div>
                <div id="listings-grid" className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    {loading ? (
                        [...Array(4)].map((_, i) => <SkeletonEventCard key={i} />)
                    ) : (
                        filteredEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))
                    )}
                </div>
                {!loading && filteredEvents.length === 0 && (
                    <div className="text-center col-span-full py-16">
                        <p className="text-gray-500 dark:text-gray-400">{t('eventsPage.noResults')}</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default EventsPage;
