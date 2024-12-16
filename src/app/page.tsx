'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mosque } from '@/types';
import Navbar from '@/components/Navbar';
import MosqueCard from '@/components/MosqueCard';

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-4rem)] bg-neutral-900 animate-pulse" />
  ),
});

export default function Home() {
  const [showCard, setShowCard] = useState(false);
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);
  const [nearestMosques, setNearestMosques] = useState<Mosque[]>([]);

  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [lineCount, setLineCount] = useState(10);

  const handleGeolocation = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert(
            'Unable to get your location. Please check your browser settings.'
          );
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }, []);

  return (
    <main className="min-h-screen bg-black">
      <Navbar
        lineCount={lineCount}
        onLineCountChange={setLineCount}
        onGeolocation={handleGeolocation}
      />
      <div className="relative z-0 h-[calc(100dvh-4rem)]">
        <Map
          onMosqueSelect={setSelectedMosque}
          onNearestMosquesChange={setNearestMosques}
          userLocation={userLocation}
          lineCount={lineCount}
        />
        {selectedMosque && (
          <div className="absolute bottom-0 left-0 right-0">
            <MosqueCard
              mosque={selectedMosque}
              nearestMosques={nearestMosques}
              showCard={showCard}
              onToggleCard={() => setShowCard(!showCard)}
              lineCount={lineCount}
            />
          </div>
        )}
      </div>
    </main>
  );
}
