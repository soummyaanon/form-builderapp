import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ThankYouPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h1 className="text-3xl font-bold">Thank You!</h1>
        <p className="text-gray-600">Your response has been recorded.</p>
        <Link href="/">
          <Button className="flex items-center gap-2">
            <ArrowLeftIcon className="w-4 h-4" />
            Return to Home
          </Button>
        </Link>
      </div>
    </main>
  );
} 