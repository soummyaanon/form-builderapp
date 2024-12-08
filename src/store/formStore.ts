import { 
  Form, 
  Question, 
  QuestionType, 
  FormResponse,
  SingleSelectQuestion,
  NumberQuestion,
  URLQuestion,
  LongAnswerQuestion,
  ShortAnswerQuestion 
} from '@/types/form';
import { create } from 'zustand';


interface FormState {
  // State
  forms: Form[];
  currentForm: Form | null;
  responses: FormResponse[];
  
  // Form Actions
  createForm: (title: string, description: string) => void;
  updateForm: (formId: string, updates: Partial<Form>) => void;
  deleteForm: (formId: string) => void;
  setCurrentForm: (form: Form | null) => void;
  publishForm: (formId: string) => void;
  unpublishForm: (formId: string) => void;
  submitFormResponse: (response: FormResponse) => void;
  
  // Question Actions
  addQuestion: (formId: string) => void;
  updateQuestion: (formId: string, questionId: string, updates: Partial<Question>) => void;
  deleteQuestion: (formId: string, questionId: string) => void;
  updateQuestionType: (formId: string, questionId: string, type: QuestionType) => void;
  reorderQuestions: (formId: string, questionId: string, newOrder: number) => void;
}

export const useFormStore = create<FormState>((set, get) => ({
  // Initial State
  forms: [],
  currentForm: null,
  responses: [],

  // Form Actions
  createForm: (title, description) => {
    const newForm: Form = {
      id: crypto.randomUUID(),
      title,
      description,
      questions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublished: false,
      publishedAt: null
    };
    
    set((state) => ({
      forms: [...state.forms, newForm],
      currentForm: newForm,
    }));
  },

  publishForm: (formId) => {
    set((state) => {
      const updatedForms = state.forms.map((form) =>
        form.id === formId
          ? { ...form, isPublished: true, publishedAt: new Date(), updatedAt: new Date() }
          : form
      );

      return {
        forms: updatedForms,
        currentForm: state.currentForm?.id === formId 
          ? { ...state.currentForm, isPublished: true, publishedAt: new Date(), updatedAt: new Date() }
          : state.currentForm
      };
    });
  },

  unpublishForm: (formId) => {
    set((state) => {
      const updatedForms = state.forms.map((form) =>
        form.id === formId
          ? { ...form, isPublished: false, publishedAt: null, updatedAt: new Date() }
          : form
      );

      return {
        forms: updatedForms,
        currentForm: state.currentForm?.id === formId 
          ? { ...state.currentForm, isPublished: false, publishedAt: null, updatedAt: new Date() }
          : state.currentForm
      };
    });
  },

  updateForm: (formId, updates) => {
    set((state) => {
      const updatedForms = state.forms.map((form) =>
        form.id === formId
          ? { ...form, ...updates, updatedAt: new Date() }
          : form
      );

      return {
        forms: updatedForms,
        currentForm: state.currentForm?.id === formId 
          ? { ...state.currentForm, ...updates, updatedAt: new Date() }
          : state.currentForm
      };
    });
  },

  deleteForm: (formId) => {
    set((state) => ({
      forms: state.forms.filter((form) => form.id !== formId),
      currentForm: state.currentForm?.id === formId ? null : state.currentForm,
    }));
  },

  setCurrentForm: (form) => {
    set({ currentForm: form });
  },

  // Question Actions
  addQuestion: (formId) => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      title: '',
      type: QuestionType.SHORT_ANSWER,
      required: false,
      order: get().currentForm?.questions.length || 0,
    } as Question;

    set((state) => ({
      ...state,
      forms: state.forms.map(form => 
        form.id === formId 
          ? { ...form, questions: [...form.questions, newQuestion] }
          : form
      ),
      currentForm: state.currentForm?.id === formId
        ? { ...state.currentForm, questions: [...state.currentForm.questions, newQuestion] }
        : state.currentForm
    }));
  },

  updateQuestion: (formId, questionId, updates) => {
    set((state) => {
      const updatedForms = state.forms.map(form => {
        if (form.id === formId) {
          const updatedQuestions = form.questions.map(q => 
            q.id === questionId 
              ? { ...q, ...updates } as Question
              : q
          );
          return {
            ...form,
            questions: updatedQuestions,
            updatedAt: new Date()
          };
        }
        return form;
      });

      return {
        ...state,
        forms: updatedForms,
        currentForm: state.currentForm?.id === formId
          ? {
              ...state.currentForm,
              questions: state.currentForm.questions.map(q =>
                q.id === questionId ? { ...q, ...updates } as Question : q
              ),
              updatedAt: new Date()
            }
          : state.currentForm
      };
    });
  },

  updateQuestionType: (formId, questionId, type) => {
    set((state) => {
      const updateQuestionWithType = (q: Question) => {
        if (q.id !== questionId) return q;

        switch (type) {
          case QuestionType.SINGLE_SELECT:
            return { ...q, type, options: [] } as SingleSelectQuestion;
          case QuestionType.NUMBER:
            return { ...q, type, min: 0, max: 100 } as NumberQuestion;
          case QuestionType.URL:
            return { ...q, type, urlPattern: '' } as URLQuestion;
          case QuestionType.LONG_ANSWER:
            return { ...q, type } as LongAnswerQuestion;
          default:
            return { ...q, type } as ShortAnswerQuestion;
        }
      };

      const updatedForms = state.forms.map(form => {
        if (form.id === formId) {
          return {
            ...form,
            questions: form.questions.map(updateQuestionWithType),
            updatedAt: new Date()
          };
        }
        return form;
      });

      const updatedCurrentForm = state.currentForm?.id === formId
        ? {
            ...state.currentForm,
            questions: state.currentForm.questions.map(updateQuestionWithType),
            updatedAt: new Date()
          }
        : state.currentForm;

      return {
        forms: updatedForms,
        currentForm: updatedCurrentForm
      };
    });
  },

  deleteQuestion: (formId, questionId) => {
    set((state) => {
      const updatedForms = state.forms.map(form => {
        if (form.id === formId) {
          return {
            ...form,
            questions: form.questions.filter(q => q.id !== questionId),
            updatedAt: new Date()
          };
        }
        return form;
      });

      const updatedCurrentForm = state.currentForm?.id === formId
        ? {
            ...state.currentForm,
            questions: state.currentForm.questions.filter(q => q.id !== questionId),
            updatedAt: new Date()
          }
        : state.currentForm;

      return {
        forms: updatedForms,
        currentForm: updatedCurrentForm
      };
    });
  },

  reorderQuestions: (formId, questionId, newOrder) => {
    set((state) => {
      const updateQuestions = (questions: Question[]) => {
        const newQuestions = [...questions];
        const oldIndex = newQuestions.findIndex(q => q.id === questionId);
        const [movedQuestion] = newQuestions.splice(oldIndex, 1);
        newQuestions.splice(newOrder, 0, movedQuestion);
        return newQuestions.map((q, index) => ({ ...q, order: index }));
      };

      const updatedForms = state.forms.map(form => {
        if (form.id === formId) {
          return {
            ...form,
            questions: updateQuestions(form.questions),
            updatedAt: new Date()
          };
        }
        return form;
      });

      const updatedCurrentForm = state.currentForm?.id === formId
        ? {
            ...state.currentForm,
            questions: updateQuestions(state.currentForm.questions),
            updatedAt: new Date()
          }
        : state.currentForm;

      return {
        forms: updatedForms,
        currentForm: updatedCurrentForm
      };
    });
  },

  submitFormResponse: (response) => {
    set((state) => ({
      ...state,
      responses: [...state.responses, response]
    }));
  },
}));
