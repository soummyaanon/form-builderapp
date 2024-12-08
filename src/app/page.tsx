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
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Form Builder</h1>
          <Link href="/create">
            <Button className="bg-green-500 hover:bg-green-600 text-white transition-all duration-300 transform hover:scale-[1.02] flex items-center gap-2">
              <PlusIcon className="w-5 h-5" />
              Create New Form
            </Button>
          </Link>
        </div>
        
        <div className="space-y-8">
          {/* Published Forms */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <GlobeAltIcon className="w-5 h-5 text-green-500" />
              Published Forms
            </h2>
            {publishedForms.length === 0 ? (
              <div className="border rounded-lg p-8 text-center bg-white">
                <p className="text-gray-500 mb-4">No published forms yet</p>
                <p className="text-sm text-gray-400">Create and publish a form to see it here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {publishedForms.map((form) => (
                  <div 
                    key={form.id} 
                    className="border rounded-lg p-6 hover:border-green-500 transition-all duration-300 hover:shadow-md bg-white"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-semibold mb-2">{form.title}</h2>
                        <p className="text-gray-600">{form.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <DocumentTextIcon className="w-4 h-4" />
                            {form.questions.length} questions
                          </span>
                          <span className="flex items-center gap-1">
                            <ClockIcon className="w-4 h-4" />
                            Published {new Date(form.publishedAt!).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Link href={`/preview/${form.id}`}>
                        <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-50">
                          Preview
                        </Button>
                      </Link>
                      <Link href={`/submit/${form.id}`}>
                        <Button className="bg-green-500 hover:bg-green-600 text-white">
                          Fill Out
                        </Button>
                      </Link>
                      <Link href={`/submissions/${form.id}`}>
                        <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-50">
                          View Submissions
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
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5 text-gray-500" />
              Draft Forms
            </h2>
            {draftForms.length === 0 ? (
              <div className="border rounded-lg p-8 text-center bg-white">
                <p className="text-gray-500 mb-4">No draft forms</p>
                <p className="text-sm text-gray-400">Create a new form to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {draftForms.map((form) => (
                  <div 
                    key={form.id} 
                    className="border rounded-lg p-6 hover:border-green-500 transition-all duration-300 hover:shadow-md bg-white"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-semibold mb-2">{form.title}</h2>
                        <p className="text-gray-600">{form.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <DocumentTextIcon className="w-4 h-4" />
                            {form.questions.length} questions
                          </span>
                          <span className="flex items-center gap-1">
                            <ClockIcon className="w-4 h-4" />
                            Last edited {new Date(form.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Link href={`/preview/${form.id}`}>
                        <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-50">
                          Preview
                        </Button>
                      </Link>
                      <Link href={`/create`}>
                        <Button className="bg-green-500 hover:bg-green-600 text-white">
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
      </div>
    </main>
  );
}
