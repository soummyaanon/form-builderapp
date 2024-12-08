import { useState } from 'react';
import { Form, QuestionResponse, QuestionType } from '@/types/form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from './ProgressBar';

interface FormPreviewProps {
  form: Form;
  onSubmit: (responses: QuestionResponse[]) => void;
}

export function FormPreview({ form, onSubmit }: FormPreviewProps) {
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = form.questions[currentIndex];
  const progress = (currentIndex / form.questions.length) * 100;

  const updateResponse = (value: string) => {
    setResponses(prev => {
      const existing = prev.findIndex(r => r.questionId === currentQuestion.id);
      const newResponse = { questionId: currentQuestion.id, value };
      
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = newResponse;
        return updated;
      }
      
      return [...prev, newResponse];
    });
  };

  const handleNext = () => {
    if (currentIndex < form.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onSubmit(responses);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const currentResponse = responses.find(r => r.questionId === currentQuestion.id);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <ProgressBar progress={progress} className="mb-8" />
      
      <div className="space-y-6">
        <div key={currentQuestion.id} className="space-y-4">
          <h2 className="text-xl font-medium">
            {currentQuestion.title}
            {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
          </h2>

          {currentQuestion.type === QuestionType.SINGLE_SELECT ? (
            <div className="space-y-2">
              {currentQuestion.options?.map((option, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option}
                    checked={currentResponse?.value === option}
                    onChange={(e) => updateResponse(e.target.value)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          ) : (
            <Input
              type={currentQuestion.type === QuestionType.NUMBER ? 'number' : 'text'}
              value={currentResponse?.value || ''}
              onChange={(e) => updateResponse(e.target.value)}
              required={currentQuestion.required}
              placeholder={`Enter your ${
                currentQuestion.type === QuestionType.URL ? 'URL' : 'answer'
              }`}
            />
          )}
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentQuestion.required && !currentResponse?.value}
          >
            {currentIndex === form.questions.length - 1 ? 'Submit' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}
