import { QuestionType } from '@/types/form';

interface QuestionTypeDropdownProps {
  onSelect: (type: QuestionType) => void;
  onClose: () => void;
}

export function QuestionTypeDropdown({ onSelect, onClose }: QuestionTypeDropdownProps) {
  const questionTypes = [
    { type: QuestionType.SHORT_ANSWER, icon: '✍', label: 'Short Answer' },
    { type: QuestionType.LONG_ANSWER, icon: '📝', label: 'Long Answer' },
    { type: QuestionType.SINGLE_SELECT, icon: '☑️', label: 'Single Select' },
    { type: QuestionType.NUMBER, icon: '🔢', label: 'Number' },
    { type: QuestionType.URL, icon: '🔗', label: 'URL' },
  ];

  return (
    <div 
      className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-lg border z-50"
      style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
    >
      {questionTypes.map(({ type, icon, label }) => (
        <button
          key={type}
          onClick={() => {
            onSelect(type);
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left transition-colors"
        >
          <span className="text-lg">{icon}</span>
          <span className="text-gray-700">{label}</span>
        </button>
      ))}
    </div>
  );
} 