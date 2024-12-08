import { useState } from 'react';
import { useFormStore } from '@/store/formStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { QuestionField } from './QuestionField';
import { EyeIcon, ShareIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

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

          <div className="space-y-4">
            {currentForm.questions.map((question) => (
              <QuestionField
                key={question.id}
                question={question}
                formId={currentForm.id}
              />
            ))}
          </div>

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
