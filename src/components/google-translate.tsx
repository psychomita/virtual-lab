// components/GoogleTranslateDropdown.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Languages } from "lucide-react";
import { usePathname } from "next/navigation";

const languages = [
  { code: "en", name: "English" },
  { code: "bn", name: "বাংলা" },
  { code: "hi", name: "हिंदी" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Português" },
  { code: "ru", name: "Русский" },
  { code: "zh-CN", name: "中文" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
];

export function GoogleTranslateDropdown() {
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;

    const script = document.createElement("script");
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = () => {
      setLoaded(true);
    };

    return () => {
      if (window.googleTranslateElementInit) {
        delete window.googleTranslateElementInit;
      }
    };
  }, [loaded]);

  const changeLanguage = (langCode: string) => {
    if (!window.google || !window.google.translate) return;

    setCurrentLanguage(langCode);
    window.location.hash = `#googtrans(${langCode})`;

    // Force translation update
    if (window.google.translate.TranslateElement) {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: languages.map((l) => l.code).join(","),
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element",
      );
    }
  };

  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2">
      <div id="google_translate_element" className="hidden" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            {pathname === "/" ? (
              <Languages className="h-4 w-4" />
            ) : (
              <>
                {" "}
                <Languages className="h-4 w-4" />
                <span>Translate</span>
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={currentLanguage === lang.code ? "bg-accent" : ""}
            >
              {lang.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
