'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useFormStore } from '@/store/formStore';
import { PlusIcon, GlobeAltIcon, DocumentTextIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const { forms } = useFormStore();

  const publishedForms = forms.filter(form => form.isPublished);
  const draftForms = forms.filter(form => !form.isPublished);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Form Builder for Peerlist</h1>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Create, share, and analyze forms with ease. Build beautiful forms for surveys, feedback, and more.
          </p>
          <Link href="/create">
            <Button className="bg-black hover:bg-gray-800 text-white transition-all duration-300 px-8 py-2.5 rounded-full flex items-center gap-2 mx-auto">
              <PlusIcon className="w-5 h-5" />
              Create New Form
            </Button>
          </Link>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Published Forms */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <GlobeAltIcon className="w-5 h-5 text-green-500" />
            Published Forms
          </h2>
          {publishedForms.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border">
              <p className="text-gray-500">No published forms yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {publishedForms.map((form) => (
                <div
                  key={form.id}
                  className="bg-white rounded-xl p-6 border hover:border-black transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold mb-2">{form.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{form.description}</p>
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <DocumentTextIcon className="w-4 h-4" />
                      {form.questions.length}
                    </span>
                    <span className="flex items-center gap-1">
                      <ClockIcon className="w-4 h-4" />
                      {new Date(form.publishedAt!).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/preview/${form.id}`} className="flex-1">
                      <Button variant="outline" className="w-full border-black text-black hover:bg-gray-50">
                        Preview
                      </Button>
                    </Link>
                    <Link href={`/submit/${form.id}`} className="flex-1">
                      <Button className="w-full bg-black hover:bg-gray-800 text-white">
                        Fill Out
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Draft Forms */}
        <div>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <DocumentTextIcon className="w-5 h-5 text-gray-500" />
            Draft Forms
          </h2>
          {draftForms.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border">
              <p className="text-gray-500">No draft forms</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {draftForms.map((form) => (
                <div
                  key={form.id}
                  className="bg-white rounded-xl p-6 border hover:border-black transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold mb-2">{form.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{form.description}</p>
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <DocumentTextIcon className="w-4 h-4" />
                      {form.questions.length}
                    </span>
                    <span className="flex items-center gap-1">
                      <ClockIcon className="w-4 h-4" />
                      {new Date(form.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/preview/${form.id}`} className="flex-1">
                      <Button variant="outline" className="w-full border-black text-black hover:bg-gray-50">
                        Preview
                      </Button>
                    </Link>
                    <Link href="/create" className="flex-1">
                      <Button className="w-full bg-black hover:bg-gray-800 text-white">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
