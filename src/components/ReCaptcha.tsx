'use client';

import ReCAPTCHA from 'react-google-recaptcha';
import { forwardRef } from 'react';

interface ReCaptchaProps {
  onChange: (token: string | null) => void;
}

const ReCaptchaWidget = forwardRef<ReCAPTCHA, ReCaptchaProps>(
  function ReCaptchaWidget({ onChange }, ref) {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    if (!siteKey) {
      console.warn('NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set');
      return null;
    }

    return (
      <ReCAPTCHA
        ref={ref}
        sitekey={siteKey}
        onChange={onChange}
        theme="light"
      />
    );
  }
);

export default ReCaptchaWidget;
