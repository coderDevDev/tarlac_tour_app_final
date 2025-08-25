'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getSiteById } from '@/lib/data';
import ARWorldViewer from '@/components/ar-world-viewer';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function ARWorldContent() {
  const searchParams = useSearchParams();
  const siteId = searchParams.get('siteId');
  const site = siteId ? getSiteById(siteId) : null;

  if (!site) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6 text-center">
        <div className="mb-4 p-4 bg-red-100 rounded-full">
          <ArrowLeft className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Site Not Found</h3>
        <p className="text-muted-foreground mb-4">
          The requested site could not be found.
        </p>
        <Link href="/">
          <Button variant="outline">Go Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-background/90 to-transparent p-4">
        <div className="flex items-center gap-3">
          <Link href={`/ar-world?siteId=${siteId}`}>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold">{site.name}</h1>
            <p className="text-sm text-muted-foreground">AR World View</p>
          </div>
        </div>
      </div>

      {/* AR Viewer */}
      <ARWorldViewer
        modelUrl={site.modelUrl || '/models/placeholder.glb'}
        siteName={site.name}
      />
    </div>
  );
}

export default function ARWorldPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center h-screen p-6 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
          <p className="font-medium">Loading AR World...</p>
          <p className="text-sm text-muted-foreground mt-2">
            Please wait while we prepare your AR experience
          </p>
        </div>
      }>
      <ARWorldContent />
    </Suspense>
  );
}
