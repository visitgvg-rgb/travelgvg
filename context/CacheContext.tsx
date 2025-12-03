import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { Accommodation, Restaurant, Pomos, Ponuda, Prikazna, Banner as BannerType } from '../types';

// Define the shape of the data we want to cache for the homepage
interface HomepageCacheData {
    accommodations: Accommodation[];
    restaurants: Restaurant[];
    shopping: Restaurant[]; // Using Restaurant type for shopping as per existing logic
    entertainment: Restaurant[]; // Using Restaurant type for entertainment
    attractions: Restaurant[]; // Using Restaurant type for attractions
    wineries: Restaurant[]; // Using Restaurant type for wineries
    pomos: Pomos[];
    ponudi: Ponuda[];
    prikazni: Prikazna[];
    banners: BannerType[];
    timestamp: number;
}

interface CacheContextType {
    homepageCache: HomepageCacheData | null;
    setHomepageCache: (data: HomepageCacheData) => void;
}

const CacheContext = createContext<CacheContextType | undefined>(undefined);

export const CacheProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [homepageCache, setHomepageCacheState] = useState<HomepageCacheData | null>(null);

    const setHomepageCache = (data: HomepageCacheData) => {
        setHomepageCacheState(data);
    };

    const value = {
        homepageCache,
        setHomepageCache
    };

    return (
        <CacheContext.Provider value={value}>
            {children}
        </CacheContext.Provider>
    );
};

export const useCache = (): CacheContextType => {
    const context = useContext(CacheContext);
    if (context === undefined) {
        throw new Error('useCache must be used within a CacheProvider');
    }
    return context;
};
