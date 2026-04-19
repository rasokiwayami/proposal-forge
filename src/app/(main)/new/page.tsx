'use client';
import { ProposalForm } from '@/components/proposals/proposal-form';

export default function NewProposalPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">新規提案</h1>
      <ProposalForm />
    </div>
  );
}