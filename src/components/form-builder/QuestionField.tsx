import { useState } from 'react';
import { useFormStore } from '@/store/formStore';
import { Question, QuestionType, SingleSelectQuestion, NumberQuestion, URLQuestion } from '@/types/form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { cn } from '@/lib/utils';
import { QuestionTypeDropdown } from './QuestionTypeDropdown';

interface QuestionFieldProps {
  question: Question;
  formId: string;
}

export function QuestionField({ question, formId }: QuestionFieldProps) {
  const { updateQuestion, deleteQuestion } = useFormStore();
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const handleTypeChange = (newType: QuestionType) => {
    let updates: Partial<Question>;
    
    switch (newType) {
      case QuestionType.SINGLE_SELECT:
        updates = { type: newType } as Partial<SingleSelectQuestion>;
        (updates as Partial<SingleSelectQuestion>).options = [];
        break;
      case QuestionType.NUMBER:
        updates = { type: newType } as Partial<NumberQuestion>;
        (updates as Partial<NumberQuestion>).min = 0;
        (updates as Partial<NumberQuestion>).max = 100;
        break;
      case QuestionType.URL:
        updates = { type: newType } as Partial<URLQuestion>;
        (updates as Partial<URLQuestion>).urlPattern = '';
        break;
      default:
        updates = { type: newType };
    }

    updateQuestion(formId, question.id, updates);
    setShowTypeDropdown(false);
  };

  return (
    <div className={cn(
     "bg-white rounded-lg p-4 space-y-4 transition-all duration-200",
      "hover:shadow-sm hover:border-gray-200"
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <Input
            value={question.title}
            onChange={(e) => updateQuestion(formId, question.id, { title: e.target.value })}
            placeholder="Write a question"
            className="text-lg font-medium"
          />

          <div className="relative mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
              className="text-gray-500"
            >
              {getQuestionIcon(question.type)} {getQuestionTypeName(question.type)}
            </Button>

            {showTypeDropdown && (
              <QuestionTypeDropdown
                onSelect={handleTypeChange}
                onClose={() => setShowTypeDropdown(false)}
              />
            )}
          </div>
          
          {/* Render type-specific fields */}
          {renderQuestionTypeFields(question, formId, updateQuestion)}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => deleteQuestion(formId, question.id)}
          className="text-gray-400"
        >
          <EllipsisVerticalIcon className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}

function getQuestionTypeName(type: QuestionType): string {
  switch (type) {
    case QuestionType.SHORT_ANSWER: return 'Short Answer';
    case QuestionType.LONG_ANSWER: return 'Long Answer';
    case QuestionType.SINGLE_SELECT: return 'Single Select';
    case QuestionType.NUMBER: return 'Number';
    case QuestionType.URL: return 'URL';
  }
}

function getQuestionIcon(type: QuestionType): string {
  switch (type) {
    case QuestionType.SHORT_ANSWER: return '✎';
    case QuestionType.LONG_ANSWER: return '📝';
    case QuestionType.SINGLE_SELECT: return '☑️';
    case QuestionType.NUMBER: return '🔢';
    case QuestionType.URL: return '��';
  }
}

function renderQuestionTypeFields(
  question: Question,
  formId: string,
  updateQuestion: (formId: string, questionId: string, updates: Partial<Question>) => void
) {
  switch (question.type) {
    case QuestionType.SINGLE_SELECT:
      return (
        <div className="mt-4 space-y-2">
          {(question as SingleSelectQuestion).options.map((option, index) => (
            <Input
              key={index}
              value={option}
              onChange={(e) => {
                const newOptions = [...(question as SingleSelectQuestion).options];
                newOptions[index] = e.target.value;
                updateQuestion(formId, question.id, { 
                  options: newOptions 
                } as Partial<SingleSelectQuestion>);
              }}
              placeholder={`Option ${index + 1}`}
            />
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newOptions = [...(question as SingleSelectQuestion).options, ''];
              updateQuestion(formId, question.id, { 
                options: newOptions 
              } as Partial<SingleSelectQuestion>);
            }}
          >
            Add Option
          </Button>
        </div>
      );
    case QuestionType.NUMBER:
      return (
        <div className="mt-4 flex gap-4">
          <Input
            type="number"
            value={(question as NumberQuestion).min}
            onChange={(e) => updateQuestion(formId, question.id, { 
              min: parseInt(e.target.value) 
            } as Partial<NumberQuestion>)}
            placeholder="Min"
            label="Min"
          />
          <Input
            type="number"
            value={(question as NumberQuestion).max}
            onChange={(e) => updateQuestion(formId, question.id, { 
              max: parseInt(e.target.value) 
            } as Partial<NumberQuestion>)}
            placeholder="Max"
            label="Max"
          />
        </div>
      );
    default:
      return null;
  }
}