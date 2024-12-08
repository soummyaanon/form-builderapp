'use client';

import { useFormStore } from '@/store/formStore';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useParams } from 'next/navigation';

export default function SubmissionsPage() {
  const params = useParams();
  const { forms, responses } = useFormStore();
  const form = forms.find(f => f.id === params.formId);
  const formResponses = responses.filter(r => r.formId === params.formId);

  if (!form) return <div>Form not found</div>;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeftIcon className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{form.title} - Submissions</h1>
        </div>

        {formResponses.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No submissions yet</p>
        ) : (
          <div className="space-y-6">
            {formResponses.map((response) => (
              <div key={response.id} className="border rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-4">
                  Submitted: {new Date(response.submittedAt).toLocaleString()}
                </p>
                {response.responses.map((answer) => {
                  const question = form.questions.find(q => q.id === answer.questionId);
                  return (
                    <div key={answer.questionId} className="mb-4">
                      <p className="font-medium">{question?.title}</p>
                      <p className="text-gray-600">{answer.value}</p>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 