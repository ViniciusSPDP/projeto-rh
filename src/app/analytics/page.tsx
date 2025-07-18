// src/app/analytics/page.tsx

import { Suspense } from 'react';
import AnalyticsDashboard from '@/app/components/AnalyticsDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics dos Formulários | RH System',
  description: 'Acompanhe o desempenho dos formulários de candidatura',
};

function LoadingAnalytics() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando analytics...</p>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<LoadingAnalytics />}>
      <AnalyticsDashboard />
    </Suspense>
  );
}