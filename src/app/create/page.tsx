'use client';

import { FormBuilder } from '@/components/form-builder/FormBuilder';

export default function CreateFormPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Create New Form</h1>
        <FormBuilder />
      </div>
    </main>
  );
}
