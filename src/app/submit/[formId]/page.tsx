'use client';

import { useEffect, useState } from 'react';
import { useFormStore } from '@/store/formStore';
import { Form, FormResponse, QuestionResponse, QuestionType, Question, SingleSelectQuestion } from '@/types/form';
import { Button } from '@/components/ui/Button';
import { useRouter, useParams } from 'next/navigation';
import { ProgressBar } from '@/components/form-preview/ProgressBar';
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function SubmitFormPage() {
  const params = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { forms, submitFormResponse } = useFormStore();
  const router = useRouter();

  useEffect(() => {
    const foundForm = forms.find(f => f.id === params.formId);
    setForm(foundForm || null);
  }, [forms, params.formId]);

  // Calculate completion percentage
  const completionPercentage = form
    ? (responses.length / form.questions.length) * 100
    : 0;

  if (!form) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Form not found</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <CheckCircleIcon className="w-16 h-16 text-green-500 animate-bounce" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Thank you!</h1>
          <p className="text-gray-600 mb-8">Your response has been submitted successfully.</p>
          <Button 
            onClick={() => router.push('/')}
            className="bg-green-500 hover:bg-green-600 text-white transition-all duration-300 transform hover:scale-105"
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formResponse: FormResponse = {
      id: crypto.randomUUID(),
      formId: form.id,
      responses: responses,
      submittedAt: new Date()
    };
    
    submitFormResponse(formResponse);
    setSubmitted(true);
  };

  const updateResponse = (questionId: string, value: string) => {
    setResponses(prev => {
      const existing = prev.findIndex(r => r.questionId === questionId);
      const newResponse = { questionId, value };
      
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = newResponse;
        return updated;
      }
      
      return [...prev, newResponse];
    });
  };

  const currentQuestion = form.questions[currentStep];
  const response = responses.find(r => r.questionId === currentQuestion?.id);

  const handleNext = () => {
    if (currentStep < form.questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderQuestionInput = (question: Question) => {
    const response = responses.find(r => r.questionId === question.id);

    switch (question.type) {
      case QuestionType.SINGLE_SELECT:
        const singleSelectQuestion = question as SingleSelectQuestion;
        return (
          <div className="space-y-3">
            {singleSelectQuestion.options.map((option, index) => (
              <label 
                key={index} 
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200
                  ${response?.value === option 
                    ? 'border-green-500 bg-green-50' 
                    : 'hover:border-gray-300'}`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={response?.value === option}
                  onChange={(e) => updateResponse(question.id, e.target.value)}
                  className="text-green-500 focus:ring-green-500"
                />
                <span className="ml-3">{option}</span>
              </label>
            ))}
          </div>
        );
      
      case QuestionType.NUMBER:
        return (
          <input
            type="number"
            value={response?.value || ''}
            onChange={(e) => updateResponse(question.id, e.target.value)}
            className="w-full border rounded-lg p-4 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            placeholder="Enter a number"
            required={question.required}
          />
        );
      
      case QuestionType.URL:
        return (
          <input
            type="url"
            value={response?.value || ''}
            onChange={(e) => updateResponse(question.id, e.target.value)}
            className="w-full border rounded-lg p-4 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            placeholder="Enter a URL"
            required={question.required}
          />
        );
      
      case QuestionType.LONG_ANSWER:
        return (
          <textarea
            value={response?.value || ''}
            onChange={(e) => updateResponse(question.id, e.target.value)}
            className="w-full border rounded-lg p-4 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            placeholder="Enter your answer"
            required={question.required}
            rows={4}
          />
        );
      
      default:
        return (
          <input
            type="text"
            value={response?.value || ''}
            onChange={(e) => updateResponse(question.id, e.target.value)}
            className="w-full border rounded-lg p-4 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            placeholder="Enter your answer"
            required={question.required}
          />
        );
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">{form.title}</h1>
          <p className="text-gray-600 mb-6">{form.description}</p>
          
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Form Completion</span>
              <span className="text-sm font-medium">{Math.round(completionPercentage)}%</span>
            </div>
            <ProgressBar progress={completionPercentage} />
          </div>

          <div className="flex justify-between text-sm text-gray-500">
            <span>Question {currentStep + 1} of {form.questions.length}</span>
            <span>{form.questions.length - responses.length} questions remaining</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 transition-all duration-300 transform">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">
                {currentQuestion.title}
                {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
              </h2>
            </div>
            {renderQuestionInput(currentQuestion)}
          </div>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              variant="outline"
              className="border-green-500 text-green-500 hover:bg-green-50 flex items-center gap-2"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Previous
            </Button>

            {currentStep === form.questions.length - 1 ? (
              <Button 
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                disabled={form.questions.some(q => q.required && !responses.find(r => r.questionId === q.id))}
              >
                Submit Form
                <CheckCircleIcon className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                disabled={currentQuestion.required && !response?.value}
              >
                Next
                <ArrowRightIcon className="w-4 h-4" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
