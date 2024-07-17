import React, { createContext, ReactNode,useContext, useEffect, useState } from 'react';

import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../lib/useAuth';

interface FavoritesContextProps {
  favorites: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextProps | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const session = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (session) {
        const { data, error } = await supabase
          .from('favorites')
          .select('resource_id')
          .eq('user_id', session.user.id);

        if (error) {
          console.error('Error fetching favorites:', error);
        } else {
          setFavorites(data.map(item => item.resource_id));
        }
      }
    };
    fetchFavorites();
  }, [session]);

  const addFavorite = async (id: string) => {
    const { error } = await supabase.from('favorites').insert([
      {
        user_id: session.user.id,
        resource_id: id,
      },
    ]);

    if (error) {
      console.error('Error adding favorite:', error);
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const removeFavorite = async (id: string) => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', session.user.id)
      .eq('resource_id', id);

    if (error) {
      console.error('Error removing favorite:', error);
    } else {
      setFavorites(favorites.filter(favoriteId => favoriteId !== id));
    }
  };

  const clearFavorites = async () => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error clearing favorites:', error);
    } else {
      setFavorites([]);
    }
  };

  const isFavorite = (id: string) => {
    return favorites.includes(id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, clearFavorites, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextProps => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
