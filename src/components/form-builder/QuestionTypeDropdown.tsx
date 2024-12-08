import { QuestionType } from '@/types/form';

interface QuestionTypeDropdownProps {
  onSelect: (type: QuestionType) => void;
  onClose: () => void;
}

export function QuestionTypeDropdown({ onSelect, onClose }: QuestionTypeDropdownProps) {
  const questionTypes = [
    { type: QuestionType.SHORT_ANSWER, icon: '✍', label: 'Short' },
    { type: QuestionType.LONG_ANSWER, icon: '📝', label: 'Long' },
    { type: QuestionType.SINGLE_SELECT, icon: '☑️', label: 'Choice' },
    { type: QuestionType.NUMBER, icon: '🔢', label: 'Number' },
    { type: QuestionType.URL, icon: '🔗', label: 'URL' },
  ];

  return (
    <div 
      className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-sm border border-gray-200 z-50 py-1"
      style={{ width: '160px' }}
    >
      {questionTypes.map(({ type, icon, label }) => (
        <button
          key={type}
          onClick={() => {
            onSelect(type);
            onClose();
          }}
          className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 text-left text-sm transition-colors"
        >
          <span className="text-base opacity-70">{icon}</span>
          <span className="text-gray-700 font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
} 