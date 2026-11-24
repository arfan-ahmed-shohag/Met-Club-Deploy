import { useEffect, type JSX } from "react";
import { useLocation, useNavigate } from "react-router";
import HomePage from "../Home/Home";
import LoginModal from "../../components/Shared/LoginModal";
import { publicApi } from "../../lib/api";
import { getExternalRedirect } from "../../utils/gameRedirect";

export default function LoginModalPage(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const homePath = location.pathname.startsWith("/en/") ? "/en" : "/";
  const externalRedirect = getExternalRedirect(location.search);

  // The game sends players here with ?redirect=. If the sign-in cookie is
  // still valid, send them straight back instead of showing the form. This
  // checks the cookie (what the game uses), not the stored token, so a stale
  // token can't bounce the player between the game and this page.
  useEffect(() => {
    if (!externalRedirect) return;
    let cancelled = false;
    publicApi
      .get("/auth/refresh-token")
      .then(() => {
        if (!cancelled) window.location.replace(externalRedirect);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [externalRedirect]);

  return (
    <>
      <HomePage />
      <LoginModal onClose={() => navigate(homePath, { replace: true })} />
    </>
  );
}
