# marco-heilmann.dev

Persönlicher Blog mit [Hugo](https://gohugo.io/) und dem Theme
[PaperMod](https://github.com/adityatelange/hugo-PaperMod). Quellcode auf
**Codeberg**, Deployment auf **Cloudflare Pages** (Direct Upload) über CI.


---

## 1. Lokal starten

Voraussetzung: **Hugo extended** (mind. 0.146) und Git.

```bash
# macOS:         brew install hugo
# Debian/Ubuntu: sudo apt install hugo   (ggf. zu alt -> Binary von GitHub)
# Arch:          sudo pacman -S hugo

hugo server -D      # Vorschau inkl. Entwürfe auf http://localhost:1313
```

## 2. Neuen Beitrag schreiben

```bash
hugo new posts/mein-erster-artikel.md
```

Die Datei liegt dann unter `content/posts/`, zunächst `draft = true` —
auf `false` setzen, damit sie live geht.

## 3. Anpassen (vor dem ersten Push)

- **`hugo.toml`**
- **`content/about.md`**
- **Favicon**: eigene Dateien unter `static/` ablegen und den
  `[params.assets]`-Block in `hugo.toml` einkommentieren.

## 4. Cloudflare-Projekt einmalig anlegen

  ```bash
  npx wrangler pages project create [Projekt] --production-branch=main
  ```

Der API-Token braucht die Berechtigung **Account → Cloudflare Pages → Edit**.

## 5. Auf Codeberg pushen

Öffentliches Repo auf Codeberg anlegen, dann:

```bash
git init
git add .
git commit -m "Initial commit: Hugo + PaperMod"
git branch -M main
git remote add origin https://codeberg.org/[DEIN-USERNAME]/[Projekt].git
git push -u origin main
```

## 6. CI: bauen und deployen (Woodpecker)

Die Pipeline liegt in `.woodpecker.yml`. Sie klont das Repo, installiert Hugo
extended, baut mit `hugo --gc --minify` und deployt mit
`wrangler pages deploy public --project-name=[Projekt]`.

**Repo aktivieren:** auf [ci.codeberg.org](https://ci.codeberg.org) mit dem
Codeberg-Account anmelden und dieses Repo aktivieren (setzt den Webhook).

**Secrets** (Repo -> Settings -> Secrets, exakt diese Namen):
- `cloudflare_api_token` (Token mit Berechtigung *Cloudflare Pages: Edit*)
- `cloudflare_account_id`

Nicht fuer `pull_request` freigeben (Default ist sicher). Ab dann loest jeder
Push auf `main` ein Deployment aus; danach ist die Seite unter
`marco-heilmann.pages.dev` erreichbar.

## 9. Theme aktualisieren

Das Theme liegt direkt im Repo unter `themes/PaperMod/`. Zum Aktualisieren
den Ordner durch die neueste PaperMod-Version ersetzen.

---