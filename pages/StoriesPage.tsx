
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import FilterBar from '../components/FilterBar';
import SkeletonCard from '../components/SkeletonCard';
import LightbulbIcon from '../components/icons/LightbulbIcon';
import Breadcrumbs from '../components/Breadcrumbs';
import { useTranslation } from '../i18n';
import type { Prikazna, MultiLangString, Banner as BannerType } from '../types';
import UserIcon from '../components/icons/UserIcon';
import Banner from '../components/Banner';
import SEO from '../components/SEO';

const StoriesPage: React.FC = () => {
    const { t, language, getLocalizedPath } = useTranslation();
    const lang = language as keyof MultiLangString;

    const [posts, setPosts] = useState<Prikazna[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Prikazna[]>([]);
    const [activeFilter, setActiveFilter] = useState(t('filters.all'));
    const [loading, setLoading] = useState(true);
    const [banners, setBanners] = useState<BannerType[]>([]);

    const filters = [t('filters.all'), t('filters.localStories'), t('filters.travelTips'), t('filters.history'), t('filters.gastronomyExp')];

    const filterCategoryMap: { [key: string]: string } = {
        [t('filters.localStories')]: "lokalni-prikazni",
        [t('filters.travelTips')]: "soveti-za-patuvanje",
        [t('filters.history')]: "istorija",
        [t('filters.gastronomyExp')]: "gastronomsko-iskustvo"
    };

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await fetch('/data/prikazni.json');
                const data: Prikazna[] = await response.json();
                const sortedData = [...data].sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
                setPosts(sortedData);
                setFilteredPosts(sortedData);
            } catch (error) {
                console.error("Failed to fetch blog posts data:", error);
            } finally {
                setLoading(false);
            }
        };
        const fetchBanners = async () => {
            try {
                const res = await fetch('/data/banners.json');
                const data: BannerType[] = await res.json();
                setBanners(data);
            } catch (error) {
                console.error("Failed to fetch banners:", error);
            }
        };

        Promise.all([fetchPosts(), fetchBanners()]);
    }, []);

    useEffect(() => {
        setActiveFilter(t('filters.all'));
    }, [t]);
    
    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
        if (filter === t('filters.all')) {
            setFilteredPosts(posts);
        } else {
            const categoryToFilter = filterCategoryMap[filter];
            const filtered = posts.filter(item => item.category === categoryToFilter);
            setFilteredPosts(filtered);
        }
    };

    const interstitialBanner = useMemo(() => banners.find(banner => {
        if (!banner.placement.includes('stories-list-interstitial') || !banner.config.isActive) {
            return false;
        }
        if (!banner.config.targetCategory || activeFilter === t('filters.all')) {
            return true;
        }
        const categoryToFilter = filterCategoryMap[activeFilter];
        return banner.config.targetCategory === categoryToFilter;
    }), [banners, activeFilter, t, filterCategoryMap]);

    const firstPost = !loading && filteredPosts.length > 0 ? filteredPosts[0] : null;
    const restPosts = !loading && filteredPosts.length > 1 ? filteredPosts.slice(1) : [];
    
    const itemsToRender: (Prikazna | BannerType)[] = [...restPosts];
    if (interstitialBanner && restPosts.length > 2) {
        itemsToRender.splice(3, 0, interstitialBanner); // Insert banner after the 3rd item in the grid
    }


    return (
        <>
            <SEO title={t('seo.stories')} />
            <Breadcrumbs />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black text-brand-text dark:text-gray-100">{t('storiesPage.title')}</h1>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm rounded-lg mb-8 dark:border dark:border-gray-700">
                    <FilterBar filters={filters} activeFilter={activeFilter} onFilterChange={handleFilterChange} />
                </div>
                
                <div className="mt-12">
                {loading ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden animate-pulse mb-12">
                            <div className="w-full h-64 md:h-full bg-gray-300 dark:bg-gray-700"></div>
                            <div className="p-8">
                                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6 mb-6"></div>
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                                    <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    </>
                ) : (
                    <>
                        {firstPost && (
                            <Link to={getLocalizedPath(`/stories/${firstPost.id}`)} className="block group mb-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 items-center bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                                    <div className="overflow-hidden h-64 md:h-full">
                                        <img src={firstPost.images[0]} alt={firstPost.title[lang]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="p-8">
                                        <span className="text-sm font-bold text-brand-accent mb-2 block">{t(`categories.${firstPost.category}`)}</span>
                                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-brand-text dark:text-gray-100 mb-4 group-hover:text-brand-accent transition-colors">{firstPost.title[lang]}</h2>
                                        <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">{(firstPost.shortDescription || firstPost.description)[lang]}</p>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                            {firstPost.authorAvatar ? (
                                                <img src={firstPost.authorAvatar} alt={firstPost.author} className="w-10 h-10 rounded-full object-cover"/>
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                  <UserIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                                </div>
                                            )}
                                             <div className="leading-tight">
                                                <p className="font-semibold text-brand-text dark:text-gray-200">{firstPost.author}</p>
                                                <p>{new Date(firstPost.publicationDate).toLocaleDateString(language)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {itemsToRender.map((item) => {
                                // Type guard to check if it's a banner
                                if ('placement' in item) {
                                    const banner = item as BannerType;
                                    return (
                                        <div key={banner.id} className="col-span-1 md:col-span-2 lg:col-span-3 -mx-4 sm:-mx-6 lg:-mx-8">
                                            <Banner banner={banner} />
                                        </div>
                                    );
                                }
                                // It's a story post
                                const story = item as Prikazna;
                                return (
                                    <Link key={story.id} to={getLocalizedPath(`/stories/${story.id}`)} className="block">
                                        <Card item={story} onClick={() => {}} />
                                    </Link>
                                );
                            })}
                        </div>

                        {!loading && filteredPosts.length === 0 && (
                            <div className="text-center col-span-full py-16">
                                <p className="text-gray-500 dark:text-gray-400">{t('storiesPage.noResults')}</p>
                            </div>
                        )}
                    </>
                )}
                </div>
            </div>
        </>
    );
};

export default StoriesPage;
