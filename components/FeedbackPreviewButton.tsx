'use client';

import { useState } from 'react';
import { Share2 } from 'lucide-react';
import FeedbackPreviewModal from './FeedbackPreviewModal';

interface FeedbackPreviewButtonProps {
  totalScore: number;
}

export default function FeedbackPreviewButton({ totalScore }: FeedbackPreviewButtonProps) {
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleShowPreview = () => {
    // For demo purposes, using a placeholder image
    // In production, this would call your API to generate the actual feedback image
    const url = `https://via.placeholder.com/800x600/1a1a2e/ffffff?text=Feedback+Score:+${totalScore}%`;
    setImageUrl(url);
    setShowPreviewModal(true);
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'proofprep-feedback.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <button
        onClick={handleShowPreview}
        className="w-full sm:w-auto px-6 py-3 flex items-center justify-center gap-2 bg-primary-200 hover:bg-primary-100 text-dark-100 rounded-lg transition-colors cursor-pointer"
      >
        <Share2 size={18} />
        Share Feedback
      </button>

      {showPreviewModal && imageUrl && (
        <FeedbackPreviewModal
          imageUrl={imageUrl}
          feedbackScore={totalScore}
          onClose={() => setShowPreviewModal(false)}
          onDownload={handleDownload}
        />
      )}
    </>
  );
}
