// src/contexts/index.tsx
import React, { useState, useEffect } from 'react';
import { client } from '../repository/api/backend';

export const waifuContext = React.createContext<{ images: string[] }>({
  images: [],
});

export const WaifuProvider: React.FC = ({ children }) => {
  const [images, setImages] = useState<string[]>([]);
  useEffect(() => {
    client
      .post<{ newGirls: { image: string; seeds: number[] }[] }>(
        'https://cors-anywhere.herokuapp.com/https://api.waifulabs.com/generate',
        { step: 0 }
      )
      .then(res => {
        setImages(
          res.data.newGirls.map(
            e => 'data:image/png;charset=utf-8;base64,' + e.image
          )
        );
      });
  }, []);
  return (
    <waifuContext.Provider value={{ images }}>{children}</waifuContext.Provider>
  );
};
