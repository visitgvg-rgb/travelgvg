

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import AccommodationCard from '../components/AccommodationCard';
import SkeletonCard from '../components/SkeletonCard';
import Breadcrumbs from '../components/Breadcrumbs';
import HeartIcon from '../components/icons/HeartIcon';
import Modal from '../components/Modal';
import { useFavorites } from '../context/FavoritesContext';
import { useTranslation } from '../i18n';
import type { Listing, Accommodation } from '../types';

const FavoritesPage: React.FC = () => {
    const { t } = useTranslation();
    const { favoriteIds } = useFavorites();
    const [loading, setLoading] = useState(true);
    const [allItems, setAllItems] = useState<Listing[]>([]);
    const [favoriteItems, setFavoriteItems] = useState<Listing[]>([]);
    const [selectedItem, setSelectedItem] = useState<Listing | null>(null);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const dataSources = [
                    '/data/accommodation.json',
                    '/data/restaurants.json',
                    '/data/shopping.json',
                    '/data/zabava.json',
                    '/data/atrakcii.json',
                    '/data/vinski-raj.json',
                    '/data/pomos.json',
                    '/data/ponudi.json',
                    '/data/prikazni.json',
                    '/data/gas-stations.json',
                ];
                const responses = await Promise.all(dataSources.map(url => fetch(url)));
                const jsonData = await Promise.all(responses.map(res => res.json()));
                const combinedData: Listing[] = jsonData.flat();
                setAllItems(combinedData);
            } catch (error) {
                console.error("Failed to fetch all data for favorites:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    useEffect(() => {
        if (!loading) {
            const favorited = allItems.filter(item => item && item.id && favoriteIds.includes(item.id));
            setFavoriteItems(favorited);
        }
    }, [favoriteIds, allItems, loading]);
    
    const handleCardClick = (item: Listing) => {
        setSelectedItem(item);
    };

    const handleCloseModal = () => {
        setSelectedItem(null);
    };

    const isAccommodation = (listing: Listing): listing is Accommodation => 'amenities' in listing;

    return (
        <>
            <Breadcrumbs />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black text-brand-text dark:text-gray-100">{t('favoritesPage.title')}</h1>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[...Array(favoriteIds.length || 4)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : favoriteItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {favoriteItems.map(item =>
                            isAccommodation(item) ? (
                                <AccommodationCard key={item.id} item={item} onClick={() => handleCardClick(item)} />
                            ) : (
                                <Card key={item.id} item={item} onClick={() => handleCardClick(item)} />
                            )
                        )}
                    </div>
                ) : (
                    <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                        <HeartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-brand-text dark:text-gray-100 mb-2">{t('favoritesPage.emptyTitle')}</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">{t('favoritesPage.emptyDesc')}</p>
                        <Link to="/accommodation" className="inline-block bg-brand-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors">
                            {t('favoritesPage.exploreBtn')}
                        </Link>
                    </div>
                )}
            </div>
            <Modal item={selectedItem} onClose={handleCloseModal} />
        </>
    );
};

export default FavoritesPage;