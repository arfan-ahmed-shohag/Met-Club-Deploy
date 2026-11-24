import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import router from "./routes/router.tsx";
import { Toaster } from "react-hot-toast";
import { AudioProvider } from "./hooks/UseAudio.tsx";
import { getStoredLocale } from "./utils/language";
import "sweetalert2/dist/sweetalert2.min.css";

const htmlElement = document.documentElement;
htmlElement.lang = getStoredLocale();

const nukeDarkReader = () => {
  if (
    htmlElement.hasAttribute("data-darkreader-mode") ||
    htmlElement.hasAttribute("data-darkreader-scheme") ||
    htmlElement.hasAttribute("data-darkreader-proxy-injected")
  ) {
    htmlElement.removeAttribute("data-darkreader-mode");
    htmlElement.removeAttribute("data-darkreader-scheme");
    htmlElement.removeAttribute("data-darkreader-proxy-injected");
  }

  const darkReaderStyles = document.querySelectorAll(
    "style.darkreader, .darkreader",
  );
  if (darkReaderStyles.length > 0) {
    darkReaderStyles.forEach((style) => style.remove());
  }
};

nukeDarkReader();

const observer = new MutationObserver(() => {
  nukeDarkReader();
});

observer.observe(htmlElement, { attributes: true });
observer.observe(document.head, { childList: true });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AudioProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AudioProvider>
  </StrictMode>,
);
