'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useFormStore } from '@/store/formStore';
import { Form } from '@/types/form';
import { Button } from '@/components/ui/Button';
import { useParams } from 'next/navigation';

export default function PreviewFormPage() {
  const params = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const { forms } = useFormStore();

  useEffect(() => {
    const foundForm = forms.find(f => f.id === params.formId);
    setForm(foundForm || null);
  }, [forms, params.formId]);

  if (!form) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Form not found</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">{form.title}</h1>
            <p className="text-gray-600">{form.description}</p>
          </div>
          <div className="space-x-4">
            <Link href={`/submit/${form.id}`}>
              <Button className="bg-green-500 hover:bg-green-600 text-white">Fill Out Form</Button>
            </Link>
            <Link href={`/submissions/${form.id}`}>
              <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-50">View Submissions</Button>
            </Link>
            <Link href="/create">
              <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-50">Back to Editor</Button>
            </Link>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-6">
            {form.questions.map((question) => (
              <div key={question.id} className="border rounded-lg p-4">
                <p className="font-medium mb-2">
                  {question.title}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </p>

                {question.type === 'single' && (
                  <div className="space-y-2">
                    {(question.options || []).map((option, index) => (
                      <label key={index} className="flex items-center space-x-2">
                        <input type="radio" name={question.id} disabled />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === 'number' && (
                  <input
                    type="number"
                    className="w-full border rounded-md p-2 bg-gray-50"
                    placeholder="Number input"
                    disabled
                  />
                )}

                {question.type === 'url' && (
                  <input
                    type="url"
                    className="w-full border rounded-md p-2 bg-gray-50"
                    placeholder="URL input"
                    disabled
                  />
                )}

                {(question.type === 'short' || question.type === 'long') && (
                  <input
                    type="text"
                    className="w-full border rounded-md p-2 bg-gray-50"
                    placeholder={question.type === 'short' ? 'Short answer' : 'Long answer'}
                    disabled
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
