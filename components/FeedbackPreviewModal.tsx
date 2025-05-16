"use client";

import { useState } from 'react';
import { X, Download, Share2 } from 'lucide-react';

interface FeedbackPreviewModalProps {
  imageUrl: string;
  onClose: () => void;
  onDownload: () => void;
}

export default function FeedbackPreviewModal({ 
  imageUrl, 
  onClose, 
  onDownload 
}: FeedbackPreviewModalProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Handle sharing the image
  const handleShare = async () => {
    try {
      // Try using the Web Share API if available
      if (navigator.share) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], 'proofprep-feedback.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'ProofPrep Interview Feedback',
          text: 'Check out my interview feedback from ProofPrep!',
          files: [file]
        });
      } else {
        // Fallback to copying the image URL
        await navigator.clipboard.writeText(imageUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-100 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-300">
          <h3 className="text-lg font-semibold text-white">Feedback Preview</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Image preview */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
          <img 
            src={imageUrl} 
            alt="Feedback Preview" 
            className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
          />
        </div>
        
        {/* Actions */}
        <div className="p-4 border-t border-dark-300 flex flex-wrap gap-3 justify-end">
          <button
            onClick={handleShare}
            className="px-4 py-2 flex items-center gap-2 bg-dark-200 hover:bg-dark-300 text-white rounded-lg transition-colors"
          >
            <Share2 size={18} />
            {copySuccess ? 'URL Copied!' : 'Share'}
          </button>
          
          <button
            onClick={onDownload}
            className="px-4 py-2 flex items-center gap-2 bg-primary-200 hover:bg-primary-100 text-dark-100 rounded-lg transition-colors"
          >
            <Download size={18} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
