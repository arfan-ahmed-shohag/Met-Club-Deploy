import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { getStoredLocale } from "../utils/language";

export function useLocaleRouteSync(bnPath: string, enPath: string) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedLocale = getStoredLocale();

    if (storedLocale === "en" && location.pathname === bnPath) {
      navigate(enPath, { replace: true });
      return;
    }

    if (storedLocale === "bn" && location.pathname === enPath) {
      navigate(bnPath, { replace: true });
    }
  }, [bnPath, enPath, location.pathname, navigate]);
}
