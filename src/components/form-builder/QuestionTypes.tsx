import { QuestionType } from '@/types/form';
import { Button } from '@/components/ui/Button';

interface QuestionTypesProps {
  onSelect: (type: QuestionType) => void;
}

export function QuestionTypes({ onSelect }: QuestionTypesProps) {
  const questionTypes = [
    { type: QuestionType.SHORT_ANSWER, label: 'Short Answer', icon: '✍️' },
    { type: QuestionType.LONG_ANSWER, label: 'Long Answer', icon: '📝' },
    { type: QuestionType.SINGLE_SELECT, label: 'Single Select', icon: '☑️' },
    { type: QuestionType.NUMBER, label: 'Number', icon: '🔢' },
    { type: QuestionType.URL, label: 'URL', icon: '🔗' },
  ];

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-medium mb-4">Add Question</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {questionTypes.map(({ type, label, icon }) => (
          <Button
            key={type}
            variant="outline"
            onClick={() => onSelect(type)}
            className="flex flex-col items-center p-4 h-auto hover:bg-gray-50"
          >
            <span className="text-2xl mb-2">{icon}</span>
            <span className="text-sm text-gray-600">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
