import { useState } from 'react';
import { useFormStore } from '@/store/formStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { QuestionField } from './QuestionField';
import { EyeIcon, ShareIcon, GlobeAltIcon, TrashIcon, Bars3Icon } from '@heroicons/react/24/outline';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Question } from '@/types/form';

interface SortableQuestionProps {
  question: Question;
  formId: string;
  onDelete: (id: string) => void;
}

// Sortable Question Component
const SortableQuestion = ({ question, formId, onDelete }: SortableQuestionProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative"
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute left-3 top-3 p-1.5 cursor-grab 
                 text-gray-400 opacity-0 group-hover:opacity-100 
                 hover:text-gray-600 transition-all duration-200"
      >
        <Bars3Icon className="w-4 h-4" />
      </div>
      
      <QuestionField
        question={question}
        formId={formId}
      />
      
      <button
        onClick={() => onDelete(question.id)}
        className="absolute right-3 top-3 p-1.5 rounded-md 
                 text-gray-400 opacity-0 group-hover:opacity-100 
                 hover:bg-red-50 hover:text-red-500 
                 transition-all duration-200"
        title="Delete question"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export function FormBuilder() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { createForm, currentForm, addQuestion, publishForm, unpublishForm } = useFormStore();

  const handleCreateForm = () => {
    if (!title.trim()) return;
    createForm(title, description);
  };

  const handleAddQuestion = () => {
    if (!currentForm) return;
    addQuestion(currentForm.id);
  };

  const handleSaveForm = () => {
    if (!currentForm) return;
    
    useFormStore.getState().updateForm(currentForm.id, {
      title,
      description,
      updatedAt: new Date()
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handlePublishToggle = () => {
    if (!currentForm) return;
    if (currentForm.isPublished) {
      unpublishForm(currentForm.id);
    } else {
      publishForm(currentForm.id);
    }
  };

  const copyShareLink = () => {
    if (!currentForm) return;
    const shareUrl = `${window.location.origin}/submit/${currentForm.id}`;
    navigator.clipboard.writeText(shareUrl);
    // You could add a toast notification here
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (!currentForm) return;
    useFormStore.getState().deleteQuestion(currentForm.id, questionId);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!currentForm || !over || active.id === over.id) return;

    const oldIndex = currentForm.questions.findIndex(q => q.id === active.id);
    const newIndex = currentForm.questions.findIndex(q => q.id === over.id);

    const newQuestions = arrayMove(currentForm.questions, oldIndex, newIndex);
    
    useFormStore.getState().updateForm(currentForm.id, {
      questions: newQuestions,
      updatedAt: new Date()
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {!currentForm ? (
        <div className="space-y-4 transition-all duration-300 ease-in-out">
          <Input
            label="Form Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter form title"
            required
          />
          
          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter form description"
            multiline
          />
          
          <Button 
            onClick={handleCreateForm}
            disabled={!title.trim()}
            className="w-full bg-green-500 hover:bg-green-600 text-white transition-all duration-300"
          >
            Create Form
          </Button>
        </div>
      ) : (
        <div className="space-y-6 transition-all duration-300 ease-in-out">
          <div className="border-b pb-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl font-bold">{currentForm.title}</h1>
                <p className="text-gray-600">{currentForm.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {currentForm.isPublished && (
                  <span className="text-sm text-green-500 flex items-center gap-1">
                    <GlobeAltIcon className="w-4 h-4" />
                    Published
                  </span>
                )}
              </div>
            </div>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={currentForm.questions}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {currentForm.questions.map((question) => (
                  <SortableQuestion
                    key={question.id}
                    question={question}
                    formId={currentForm.id}
                    onDelete={handleDeleteQuestion}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <Button
            variant="outline"
            onClick={handleAddQuestion}
            className="w-full justify-start border-green-500 text-green-500 hover:bg-green-50"
          >
            <span className="mr-2">+</span>
            Add Question
          </Button>

          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
            <div className="max-w-3xl mx-auto flex justify-between items-center gap-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => useFormStore.getState().setCurrentForm(null)}
                  className="border-green-500 text-green-500 hover:bg-green-50"
                >
                  Exit
                </Button>
                <Button 
                  onClick={handleSaveForm}
                  className={`${saveSuccess ? 'bg-green-500' : 'bg-green-500 hover:bg-green-600'} text-white transition-all duration-300`}
                >
                  {saveSuccess ? 'Saved!' : 'Save'}
                </Button>
              </div>

              <div className="flex gap-2">
                <Link href={`/preview/${currentForm.id}`}>
                  <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-50 flex items-center gap-2">
                    <EyeIcon className="w-4 h-4" />
                    Preview
                  </Button>
                </Link>
                {currentForm.isPublished && (
                  <Button
                    variant="outline"
                    onClick={copyShareLink}
                    className="border-green-500 text-green-500 hover:bg-green-50 flex items-center gap-2"
                  >
                    <ShareIcon className="w-4 h-4" />
                    Share
                  </Button>
                )}
                <Button
                  onClick={handlePublishToggle}
                  className={`${
                    currentForm.isPublished 
                      ? 'bg-yellow-500 hover:bg-yellow-600' 
                      : 'bg-green-500 hover:bg-green-600'
                  } text-white flex items-center gap-2`}
                >
                  <GlobeAltIcon className="w-4 h-4" />
                  {currentForm.isPublished ? 'Unpublish' : 'Publish'}
                </Button>
              </div>
            </div>
          </div>

          <div className="h-20" />
        </div>
      )}
    </div>
  );
}
