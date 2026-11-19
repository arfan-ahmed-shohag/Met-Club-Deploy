import type { JSX } from "react";
import { useLocation, useNavigate } from "react-router";
import HomePage from "../Home/Home";
import LoginModal from "../../components/Shared/LoginModal";

export default function LoginModalPage(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const homePath = location.pathname.startsWith("/en/") ? "/en" : "/";

  return (
    <>
      <HomePage />
      <LoginModal onClose={() => navigate(homePath, { replace: true })} />
    </>
  );
}
