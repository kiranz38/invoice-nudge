'use client';

import { useEffect, useRef } from 'react';

interface GoogleButtonProps {
  onSuccess: (credential: string) => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (element: HTMLElement, config: Record<string, unknown>) => void;
        };
      };
    };
  }
}

export function GoogleSignInButton({ onSuccess }: GoogleButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && buttonRef.current) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
          callback: (response: { credential?: string }) => {
            if (response.credential) {
              onSuccess(response.credential);
            }
          },
        });
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'filled_black',
          size: 'large',
          width: '100%',
          text: 'continue_with',
        });
      }
    };
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, [onSuccess]);

  return <div ref={buttonRef} className="w-full flex justify-center" />;
}
