import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';

interface FavoritesContextType {
    favoriteIds: string[];
    addFavorite: (id: string) => void;
    removeFavorite: (id: string) => void;
    isFavorite: (id: string) => boolean;
    favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
        try {
            const item = window.localStorage.getItem('favoriteItems');
            return item ? JSON.parse(item) : [];
        } catch (error) {
            console.error(error);
            return [];
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem('favoriteItems', JSON.stringify(favoriteIds));
        } catch (error) {
            console.error(error);
        }
    }, [favoriteIds]);

    const addFavorite = useCallback((id: string) => {
        setFavoriteIds((prevIds) => {
            if (prevIds.includes(id)) return prevIds;
            return [...prevIds, id];
        });
    }, []);

    const removeFavorite = useCallback((id: string) => {
        setFavoriteIds((prevIds) => prevIds.filter((favId) => favId !== id));
    }, []);

    const isFavorite = useCallback((id: string) => {
        return favoriteIds.includes(id);
    }, [favoriteIds]);

    const value = {
        favoriteIds,
        addFavorite,
        removeFavorite,
        isFavorite,
        favoritesCount: favoriteIds.length,
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = (): FavoritesContextType => {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};