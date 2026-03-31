export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import AdmissionFormClient from '@/components/pages/AdmissionFormClient';

export const metadata: Metadata = {
  title: "Admission Enquiry | Aarambha School",
  description: "Apply for admission at Aarambha School. Fill out the enquiry form for Nursery to Grade 10. Our team will contact you within 24-48 hours.",
};

export default function AdmissionFormPage() {
  return <AdmissionFormClient />;
}
