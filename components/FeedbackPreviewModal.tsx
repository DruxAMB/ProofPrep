"use client";

import { useState, useEffect } from "react";
import { X, Download, Share2, Twitter } from "lucide-react";
import Image from "next/image";

interface FeedbackPreviewModalProps {
  imageUrl: string;
  onClose: () => void;
  onDownload: () => void;
  feedbackScore?: number;
}

export default function FeedbackPreviewModal({
  imageUrl,
  onClose,
  onDownload,
  feedbackScore = 0,
}: FeedbackPreviewModalProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  // Generate share message with the feedback score
  const shareMessage = `I just took a mock interview with @proofprepai and got a feedback score of ${feedbackScore}%! Try it out at proofprep.druxamb.dev`;

  // Create a blob URL for image download if needed
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  // Prepare the image for sharing when the component mounts
  useEffect(() => {
    const prepareImageForSharing = async () => {
      try {
        // Fetch the image and convert to blob
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        // Create a blob URL
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
      } catch (error) {
        console.error("Error preparing image for sharing:", error);
      }
    };

    prepareImageForSharing();

    // Clean up blob URL when component unmounts
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [imageUrl]);

  // Generate URLs for social sharing
  // For Twitter, we can't directly attach the image via URL params, but we include the message
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareMessage
  )}`;

  // For Warpcast, we also can't directly attach images via URL, but we include the message
  const warpcastShareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(
    shareMessage
  )}`;

  // Handle copying the share message
  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Error copying message:", error);
    }
  };

  // Function to download image for manual sharing
  // const downloadImageForSharing = async () => {
  //   try {
  //     if (!blobUrl) {
  //       const response = await fetch(imageUrl);
  //       const blob = await response.blob();
  //       const url = URL.createObjectURL(blob);
  //       setBlobUrl(url);
  //       return url;
  //     }
  //     return blobUrl;
  //   } catch (error) {
  //     console.error('Error preparing image for sharing:', error);
  //     return null;
  //   }
  // };

  // Handle sharing the image
  // const handleShare = async () => {
  //   try {
  //     // Try using the Web Share API if available
  //     if (navigator.share) {
  //       const response = await fetch(imageUrl);
  //       const blob = await response.blob();
  //       const file = new File([blob], 'proofprep-feedback.png', { type: 'image/png' });

  //       await navigator.share({
  //         title: 'ProofPrep Interview Feedback',
  //         text: shareMessage,
  //         files: [file]
  //       });
  //     } else {
  //       // If Web Share API is not available, show the share tab
  //       await downloadImageForSharing(); // Ensure the image is ready for download
  //       setActiveTab('share');
  //     }
  //   } catch (error) {
  //     console.error('Error sharing:', error);
  //     setActiveTab('share');
  //   }
  // };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-100 rounded-xl max-w-full w-fit max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-300">
          <h3 className="text-lg font-semibold text-white">Feedback Preview</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Image preview */}
        <div className="flex-1 overflow-aut flex items-center justify-center">
          <Image
            src={imageUrl}
            alt="Feedback Preview"
            height={1000}
            width={1000}
            className="max-w-sm md:max-w-lg object-contain rounded-lg shadow-lg"
          />
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-dark-300">
          {
            <div className="flex flex-wrap gap-3 justify-center">
              <div className="space-y-4">
                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-2">
                    For best results, download the image first and attach it
                    when posting.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs md:text-md">
                  <button
                    onClick={handleCopyMessage}
                    className="px-4 py-2 flex items-center justify-center gap-2 bg-dark-300 hover:bg-dark-400 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <Share2 size={18} />
                    {copySuccess ? "Message Copied!" : "Copy Message"}
                  </button>

                  <button
                    onClick={onDownload}
                    className="px-4 py-2 flex items-center justify-center gap-2 bg-primary-200 hover:bg-primary-100 text-dark-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <Download size={18} />
                    Download Image
                  </button>

                  <a
                    href={twitterShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 flex items-center justify-center gap-2 bg-[#1DA1F2] hover:bg-opacity-80 text-white rounded-lg transition-colors cursor-pointer"
                    onClick={() => {
                      // Remind user to attach the image manually
                      alert(
                        "Remember to attach the downloaded image to your post for the best impact!"
                      );
                    }}
                  >
                    <Twitter size={18} />
                    Share on X
                  </a>

                  <a
                    href={warpcastShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 flex items-center justify-center gap-2 bg-[#6328d2] hover:bg-opacity-80 text-white rounded-lg transition-colors cursor-pointer"
                    onClick={() => {
                      // Remind user to attach the image manually
                      alert(
                        "Remember to attach the downloaded image to your post for the best impact!"
                      );
                    }}
                  >
                    <b>W</b>
                    Share on Warpcast
                  </a>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
}
