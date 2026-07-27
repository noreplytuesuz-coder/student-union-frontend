import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleSignIn } from "@/entities/session";

const SCRIPT_URL = "https://accounts.google.com/gsi/client";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";

function loadGsiScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById("google-gsi")) return resolve();
    const s = document.createElement("script");
    s.id = "google-gsi";
    s.src = SCRIPT_URL;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Google script"));
    document.head.appendChild(s);
  });
}

export function useGoogleAuth() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  // Use the session hook that syncs Zustand + React Query
  const googleSignIn = useGoogleSignIn();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCredentialResponse = useCallback(
    (resp: { credential?: string }) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      if (resp.credential) {
        googleSignIn.mutate(
          { idToken: resp.credential },
          {
            onSuccess: (user) => {
              setIsLoading(false);
              // Route immediately based on user role
              navigate(user.role === "user" ? "/admin" : "/");
            },
            onError: () => {
              setIsLoading(false);
            },
          },
        );
      } else {
        setIsLoading(false);
      }
    },
    [googleSignIn, navigate],
  );

  const triggerAuth = useCallback(async () => {
    if (isLoading || !GOOGLE_CLIENT_ID) return;
    setIsLoading(true);

    timeoutRef.current = window.setTimeout(() => setIsLoading(false), 10000);

    try {
      await loadGsiScript();
      const google = (window as any).google;
      if (!google?.accounts?.id) throw new Error("Google Identity Services unavailable");

      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        ux_mode: "popup",
      });

      const hiddenBtn = document.createElement("div");
      hiddenBtn.style.display = "none";
      document.body.appendChild(hiddenBtn);

      google.accounts.id.renderButton(hiddenBtn, {
        type: "standard",
        theme: "outline",
        size: "large",
      });

      const innerBtn = hiddenBtn.querySelector('div[role="button"]') as HTMLElement;
      if (innerBtn) {
        innerBtn.click();
      } else {
        google.accounts.id.prompt();
      }

      document.body.removeChild(hiddenBtn);
    } catch (err) {
      console.error("Google auth failed:", err);
      setIsLoading(false);
    }
  }, [isLoading, handleCredentialResponse]);

  return {
    isLoading: isLoading || googleSignIn.isPending,
    triggerAuth,
  };
}
