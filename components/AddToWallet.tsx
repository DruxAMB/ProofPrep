"use client";

import { useState } from 'react';
import { FeedbackData } from '@/types/feedback';

interface AddToWalletProps {
  feedback: FeedbackData;
}

export default function AddToWallet({ feedback }: AddToWalletProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const generateFeedbackImage = async () => {
    // Create canvas with higher resolution for better quality
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 900;
    const ctx = canvas.getContext('2d')!;

    // Set background with ProofPrep dark theme
    // Using the dark-100 color from the project's color palette
    ctx.fillStyle = '#0B0F19'; // dark-100 background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add subtle pattern overlay (similar to the app's pattern background)
    ctx.fillStyle = '#111827'; // dark-200
    for (let i = 0; i < canvas.width; i += 30) {
      for (let j = 0; j < canvas.height; j += 30) {
        if (Math.random() > 0.85) { // 15% of grid cells get a dot
          ctx.fillRect(i, j, 4, 4);
        }
      }
    }

    // Add gradient border using primary colors
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#00FFFF'); // primary-100
    gradient.addColorStop(0.5, '#00CCFF'); // primary-200
    gradient.addColorStop(1, '#9333EA'); // purple accent
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Add ProofPrep logo placeholder
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ProofPrep', 600, 80);

    // Add divider
    ctx.strokeStyle = '#374151'; // dark-300
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(300, 120);
    ctx.lineTo(900, 120);
    ctx.stroke();

    // Add heading
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Interview Feedback', 600, 180);

    // Add score with appropriate color based on score value
    const scoreColor = getScoreColor(feedback.score);
    ctx.fillStyle = scoreColor;
    ctx.font = 'bold 72px "Outfit", sans-serif';
    ctx.fillText(`${feedback.score}%`, 600, 280);

    // Add role and date
    ctx.fillStyle = '#9CA3AF'; // gray-400
    ctx.font = '32px "Outfit", sans-serif';
    ctx.fillText(`${feedback.role}`, 600, 340);
    ctx.font = '24px "Outfit", sans-serif';
    ctx.fillText(`${feedback.date}`, 600, 380);

    // Add divider
    ctx.strokeStyle = '#374151'; // dark-300
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(150, 420);
    ctx.lineTo(1050, 420);
    ctx.stroke();

    // Add strengths section
    ctx.fillStyle = '#10B981'; // green-500
    ctx.font = 'bold 36px "Outfit", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Strengths', 150, 480);

    // Add strengths list
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px "Outfit", sans-serif';
    feedback.strengths.slice(0, 3).forEach((strength, index) => {
      ctx.fillText(`• ${strength}`, 170, 530 + index * 40);
    });

    // Add areas for improvement
    ctx.fillStyle = '#FBBF24'; // yellow-400
    ctx.font = 'bold 36px "Outfit", sans-serif';
    ctx.fillText('Areas for Improvement', 150, 680);

    // Add areas list
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px "Outfit", sans-serif';
    feedback.areasForImprovement.slice(0, 3).forEach((area, index) => {
      ctx.fillText(`• ${area}`, 170, 730 + index * 40);
    });

    // Add footer
    ctx.fillStyle = '#9CA3AF'; // gray-400
    ctx.font = '18px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ProofPrep Interview Feedback', 600, 860);

    // Helper function to get score color
    function getScoreColor(score: number): string {
      if (score >= 80) return '#10B981'; // green-500
      if (score >= 60) return '#FBBF24'; // yellow-400
      return '#EF4444'; // red-500
    }

    return new Promise<File>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(new File([blob!], 'proofprep-feedback.png', { type: 'image/png' }));
      }, 'image/png', 0.95); // Higher quality PNG
    });
  };

  async function downloadFeedbackImage() {
    try {
      setIsLoading(true);
      setError(null);
      
      // Generate the feedback image
      const imageFile = await generateFeedbackImage();
      
      // Create a download link for the image
      const imageObjectUrl = URL.createObjectURL(imageFile);
      setImageUrl(imageObjectUrl);
      setSuccess(true);
      
      // Create a temporary link element and trigger download
      const downloadLink = document.createElement('a');
      downloadLink.href = imageObjectUrl;
      downloadLink.download = 'proofprep-feedback.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
    } catch (err) {
      console.error('Error generating feedback image:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate feedback image');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full space-y-4">
      <button
        onClick={downloadFeedbackImage}
        disabled={isLoading}
        className="w-full p-3 flex items-center justify-center gap-2 bg-primary-200 hover:bg-primary-100 text-dark-100 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            Generating Image...
          </>
        ) : (
          'Download Feedback Image'
        )}
      </button>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-red-500 text-sm text-center">{error}</p>
        </div>
      )}

      {success && !error && !isLoading && (
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <p className="text-green-500 text-sm text-center">
            Successfully generated feedback image!
            {imageUrl && (
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block underline hover:text-green-400 mt-1"
              >
                View Feedback Image
              </a>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
