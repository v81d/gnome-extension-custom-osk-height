# Translating Custom OSK Height

Thank you for your interest in translating this project! This guide will help you get started contributing translations using standard gettext tools (`.po`, `.pot`, and `.mo` files).

## File Structure

This project uses GNU gettext for localization. Translation files are located in the `po/` directory. Under this directory, you should see:

```
└── po/
    ├── LINGUAS                 # list of added localizations
    ├── POTFILES.in
    ├── custom-osk-height.pot   # translation template (do not edit)
    └── ...
```

## How Translations Work

All original English strings are stored in `custom-osk-height.pot`. Translations are stored in language-specific `.po` files (e.g., `fr.po`, `es.po`). Compiled `.mo` files are used at runtime.

## Guidelines

- Don't forget to fill out the metadata at the top of the `.po` file.
- Please do not translate the extension name. Keep all instances of the string "Custom OSK Height" as-is unless it is not used as the name of this software.

## Getting Started

You can edit `.po` files with [Poedit](https://poedit.net) or simply a text editor. To get started, follow the instructions below.

1. [Fork](https://github.com/v81d/custom-osk-height/fork) the repository and clone the `main` branch locally.

```bash
git clone --branch=main https://github.com/v81d/custom-osk-height.git
cd custom-osk-height
```

2. Create a `.po` file under the `po/` directory (only if it does not already exist):

```bash
msginit --locale=LL --input=po/custom-osk-height.pot --output-file=po/LL.po
```

Replace `LL` with your language code (e.g., `de`, `fr`, `es`, `pt_BR`, etc.). Make sure to answer all prompts correctly.

3. Fill translations using your preferred editor.
4. Add your language code to `po/LINGUAS`.
5. Commit and push your changes to your fork.

## Updating Translations

If strings in the extension change, update your `.po` file using:

```bash
msgmerge --update po/LL.po po/custom-osk-height.pot
```

Again, don't forget to replace `LL` with the correct code.

## Submitting Translations

Once you have completed and tested your translations, you can begin the submission process. To do so, follow the steps below.

1. Navigate to the [project's repository](https://github.com/v81d/custom-osk-height).
2. Create a new pull request:

- Select `develop` as the base branch and your translation branch as the head branch.
- Title your pull request `i18n: add LL translations` (replace `LL` with your language code) or similar.

3. Submit the pull request and wait for approval.

## Thank You

Thank you for contributing to this project and making the extension more accessible for everyone!
