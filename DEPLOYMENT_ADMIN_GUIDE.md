
# 🚀 SZCZECIN SAFEPOINT: INSTRUKCJA WDROŻENIA I ADMINISTRACJI (2025)

Ten dokument zawiera kompletny plan działania dla Ciebie, jako administratora systemu, aby uruchomić testową i publiczną wersję aplikacji online.

---

## 1. PRZYGOTOWANIE LOKALNE (Windows 10 + VS Code)
Zanim wyślesz kod w chmurę, upewnij się, że masz:
1. **VS Code**: Zainstaluj rozszerzenie "Live Server" lub użyj `server.py` (instrukcja w folderze).
2. **Node.js**: Zainstalowany lokalnie, aby móc ewentualnie używać `npm` w przyszłości.
3. **API Key**: Pobierz swój klucz Gemini z [Google AI Studio](https://aistudio.google.com/).

---

## 2. PUBLIKACJA NA GITHUB (Baza Kodu)
GitHub to Twoje główne archiwum. 
1. Stwórz repozytorium: `szczecin-safepoint`.
2. Prześlij wszystkie pliki (`index.html`, `index.tsx`, `types.ts`, `components/`, etc.).
3. **BEZPIECZEŃSTWO**: Nigdy nie wpisuj klucza API bezpośrednio do plików na GitHubie. Nasza aplikacja korzysta z `process.env.API_KEY`, który wstrzykniesz w konfiguracji chmury.

---

## 3. WDROŻENIE ONLINE (Opcje)

### OPCJA A: Hugging Face Spaces (Najprostsza)
Idealna dla statycznych aplikacji React z modułami.
1. Stwórz nowy "Space" na [Hugging Face](https://huggingface.co/spaces).
2. Wybierz SDK: **Static**.
3. Prześlij pliki lub połącz z GitHub.
4. W ustawieniach (Settings) dodaj **Variable/Secret**: `API_KEY` = (Twój klucz z Google AI Studio).

### OPCJA B: Google Cloud Firebase (Najbardziej profesjonalna)
1. Wejdź na [Firebase Console](https://console.firebase.google.com/).
2. Stwórz projekt `Szczecin SafePoint`.
3. Uruchom **Firebase Hosting**.
4. Zainstaluj `firebase-tools` w VS Code i wpisz: `firebase deploy`.

---

## 4. ZADANIA ADMINISTRATORA (Twój Plan Działania)

### KROK 1: Weryfikacja Punktów (Admin Panel)
- Wejdź do aplikacji, kliknij logo ☢ 5 razy.
- Przejdź do zakładki **SZTAB (HQ)**.
- Sprawdzaj **REPORTS** (zgłoszenia błędów) i **SUBMISSIONS** (nowe punkty od ludzi).
- Zawsze weryfikuj fizycznie lub przez Google Street View, czy schron (np. parking podziemny) faktycznie istnieje.

### KROK 2: Aktualizacja Protokołów
- Jeśli RCB (Rządowe Centrum Bezpieczeństwa) wyda nowy komunikat, zaktualizuj plik `components/ProtocolLibrary.tsx`.
- Pamiętaj o priorytecie języka Polskiego.

### KROK 3: Komunikacja SOS
- Monitoruj zakładkę **SOS_LOG**. Jeśli AI Ratownik wykryje sygnał od użytkownika (np. JUNIOR w stresie), log pojawi się w panelu z koordynatami GPS.

---

## 5. ROZWÓJ "GRA!"
- Jako agent, możesz rozwijać moduł `GameModule.tsx`. Dodawaj nowe poziomy (np. "Znajdź najbliższy defibrylator AED w Szczecinie").
- Możesz generować nowe grafiki edukacyjne używając wbudowanego w aplikację **VisionTool**.

---
**STATUS MISJI: GOTOWY DO STARTU. SZCZECIN JEST BEZPIECZNIEJSZY DZIĘKI TOBIE.**
