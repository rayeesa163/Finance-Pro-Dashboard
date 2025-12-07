import React from 'react';
import { Header } from '@/components/Header';
import { Dashboard } from '@/components/Dashboard';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      <main className="container px-4 py-6">
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;
