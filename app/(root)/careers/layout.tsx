import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ProofPrep - Careers",
  description: "Join our team and help revolutionize interview preparation with AI"
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
