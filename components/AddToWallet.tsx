"use client";

import { useState } from 'react';
import { FeedbackData } from '@/types/feedback';
import FeedbackPreviewModal from './FeedbackPreviewModal';

interface AddToWalletProps {
  feedback: FeedbackData;
}

export default function AddToWallet({ feedback }: AddToWalletProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const generateFeedbackImage = async () => {
    // Create canvas with higher resolution for better quality
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 900;
    const ctx = canvas.getContext('2d')!;

    // Create dark gradient background (matches dark-gradient utility)
    const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGradient.addColorStop(0, '#1A1C20'); // from-[#1A1C20]
    bgGradient.addColorStop(1, '#08090D'); // to-[#08090D]
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add subtle pattern overlay (similar to the app's pattern background)
    ctx.fillStyle = '#243339'; // dark-300 from theme
    for (let i = 0; i < canvas.width; i += 30) {
      for (let j = 0; j < canvas.height; j += 30) {
        if (Math.random() > 0.85) { // 15% of grid cells get a dot
          ctx.fillRect(i, j, 4, 4);
        }
      }
    }

    // Add border gradient (matches border-gradient utility)
    const borderGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    borderGradient.addColorStop(0, '#4B4D4F'); // from-[#4B4D4F]
    borderGradient.addColorStop(1, '#4B4D4F33'); // to-[#4B4D4F33]
    ctx.strokeStyle = borderGradient;
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Add ProofPrep logo with teal gradient (matches the app's branding)
    const logoGradient = ctx.createLinearGradient(500, 0, 700, 0);
    logoGradient.addColorStop(0, '#FFFFFF'); // from-[#FFFFFF]
    logoGradient.addColorStop(1, '#65bdcc'); // to-[#65bdcc] (primary-200 from theme)
    ctx.fillStyle = logoGradient;
    ctx.font = 'bold 36px "Mona Sans", sans-serif'; // Using the app's font from theme
    ctx.textAlign = 'center';
    ctx.fillText('ProofPrep', 600, 80);

    // Add divider
    ctx.strokeStyle = '#4B4D4F33'; // border color from theme
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(300, 120);
    ctx.lineTo(900, 120);
    ctx.stroke();

    // Add heading
    ctx.fillStyle = '#d9f2f6'; // light-100 from theme
    ctx.font = 'bold 48px "Mona Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Interview Feedback', 600, 180);

    // Add score with appropriate color based on score value
    const scoreColor = getScoreColor(feedback.score);
    ctx.fillStyle = scoreColor;
    ctx.font = 'bold 72px "Mona Sans", sans-serif';
    ctx.fillText(`${feedback.score}%`, 600, 280);

    // Add role and date
    ctx.fillStyle = '#65bdcc'; // primary-200/light-400 from theme
    ctx.font = '32px "Mona Sans", sans-serif';
    ctx.fillText(`${feedback.role}`, 600, 340);
    ctx.font = '24px "Mona Sans", sans-serif';
    ctx.fillText(`${feedback.date}`, 600, 380);

    // Add divider
    ctx.strokeStyle = '#4B4D4F33'; // border color from theme
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(150, 420);
    ctx.lineTo(1050, 420);
    ctx.stroke();

    // Add strengths section
    ctx.fillStyle = '#49de50'; // success-100 from theme
    ctx.font = 'bold 36px "Mona Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Strengths', 150, 480);

    // Add strengths list
    ctx.fillStyle = '#d9f2f6'; // light-100 from theme
    ctx.font = '24px "Mona Sans", sans-serif';
    feedback.strengths.slice(0, 3).forEach((strength, index) => {
      ctx.fillText(`• ${strength}`, 170, 530 + index * 40);
    });

    // Add areas for improvement
    ctx.fillStyle = '#f75353'; // destructive-100 from theme
    ctx.font = 'bold 36px "Mona Sans", sans-serif';
    ctx.fillText('Areas for Improvement', 150, 680);

    // Add areas list
    ctx.fillStyle = '#d9f2f6'; // light-100 from theme
    ctx.font = '24px "Mona Sans", sans-serif';
    feedback.areasForImprovement.slice(0, 3).forEach((area, index) => {
      ctx.fillText(`• ${area}`, 170, 730 + index * 40);
    });

    // Add footer with teal gradient (matches the app's branding)
    const footerGradient = ctx.createLinearGradient(400, 0, 800, 0);
    footerGradient.addColorStop(0, '#65bdcc'); // primary-200 from theme
    footerGradient.addColorStop(1, '#4a9caa'); // light-600 from theme
    ctx.fillStyle = footerGradient;
    ctx.font = '18px "Mona Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ProofPrep Interview Feedback', 600, 860);

    // Helper function to get score color based on project theme
    function getScoreColor(score: number): string {
      if (score >= 80) return '#49de50'; // success-100 from theme
      if (score >= 60) return '#65bdcc'; // primary-200 from theme
      return '#f75353'; // destructive-100 from theme
    }

    return new Promise<File>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(new File([blob!], 'proofprep-feedback.png', { type: 'image/png' }));
      }, 'image/png', 0.95); // Higher quality PNG
    });
  };

  async function generatePreview() {
    try {
      setIsLoading(true);
      setError(null);
      
      // Generate the feedback image
      const imageFile = await generateFeedbackImage();
      
      // Create a URL for the image
      const imageObjectUrl = URL.createObjectURL(imageFile);
      setImageUrl(imageObjectUrl);
      setSuccess(true);
      
      // Show the preview modal
      setShowPreviewModal(true);
    } catch (err) {
      console.error('Error generating feedback image:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate feedback image');
    } finally {
      setIsLoading(false);
    }
  }
  
  function downloadImage() {
    if (!imageUrl) return;
    
    // Create a temporary link element and trigger download
    const downloadLink = document.createElement('a');
    downloadLink.href = imageUrl;
    downloadLink.download = 'proofprep-feedback.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  return (
    <div className="w-full">
      <button
        onClick={generatePreview}
        disabled={isLoading}
        className="w-full p-2 flex items-center justify-center gap-2 bg-primary-200 hover:bg-primary-100 text-dark-100 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isLoading ? (
          <>
            <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            Generating Image...
          </>
        ) : (
          'Preview and Share Feedback'
        )}
      </button>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-red-500 text-sm text-center">{error}</p>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && imageUrl && (
        <FeedbackPreviewModal
          imageUrl={imageUrl}
          feedbackScore={feedback.score}
          onClose={() => setShowPreviewModal(false)}
          onDownload={() => {
            downloadImage();
            // Keep the modal open so they can also share if desired
          }}
        />
      )}
      
      {/* {success && !error && !isLoading && !showPreviewModal && (
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <p className="text-green-500 text-sm text-center">
            Successfully generated feedback image!
            <button
              onClick={() => setShowPreviewModal(true)}
              className="block underline hover:text-green-400 mt-1 mx-auto"
            >
              View Feedback Image
            </button>
          </p>
        </div>
      )} */}
    </div>
  );
}
