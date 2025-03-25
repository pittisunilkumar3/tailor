
import React from 'react';
import Header from '../components/Header';
import MeasurementForm from '../components/MeasurementForm';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-primary/10">
      <div className="container px-4 py-8 mx-auto max-w-4xl">
        <Header />
        <MeasurementForm />
      </div>
    </div>
  );
};

export default Index;
