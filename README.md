# Custom OSK Height

![GitHub top language](https://img.shields.io/github/languages/top/v81d/gnome-extension-custom-osk-height?style=for-the-badge)
![GitHub contributors](https://img.shields.io/github/contributors/v81d/gnome-extension-custom-osk-height?style=for-the-badge)
![GitHub license](https://img.shields.io/github/license/v81d/gnome-extension-custom-osk-height?style=for-the-badge)
![GitHub release](https://img.shields.io/github/v/release/v81d/gnome-extension-custom-osk-height?style=for-the-badge)

Custom OSK Height is a GNOME Shell extension that allows you to change the height of the GNOME on-screen keyboard.

This is designed to fix a quirk related to how the GNOME OSK scales: for some reason, the OSK keys randomly change size and become really tiny out of nowhere, which can be very frustrating.

This extension also fixes another UX bug in the OSK, where the keyboard resizes on each keystroke whenever the word suggestions bar appears or disappears. With this extension, you can set a custom fixed height for the suggestions bar. For more details about this bug, see: https://gitlab.gnome.org/GNOME/gnome-shell/-/work_items/8255.

## Setup Guide

This extension is not hosted anywhere but here, on this official GitHub page, at least for now. To install this extension, you must set it up manually.

### Manual Installation

To install Custom OSK Height manually, follow the instructions:

1. Clone this repository:

```bash
git clone https://github.com/v81d/gnome-extension-custom-osk-height.git
cd gnome-extension-custom-osk-height
```

2. Pack the extension into a `.zip` archive:

```bash
gnome-extensions pack --extra-source=lib --podir=po .
```

3. Install the extension:

```bash
gnome-extensions install custom-osk-height@v81d.shell-extension.zip
```

To update the extension from an existing installation, pass the flag `--force`.

4. Log out and log in again to restart the GNOME Shell.

Now, the extension should be installed. You can use the GNOME Extensions app or run the following command to enable the extension:

```bash
gnome-extensions enable custom-osk-height@v81d
```

## Acknowledgements

A huge thank you to the developers of these open-source projects. Their work made developing this extension much easier:

- [GJS Guide for GNOME Extensions](https://gjs.guide/extensions): Documentation for creating GNOME extensions.
- [Keyboard Suggestions Height (GNOME Extension)](https://codeberg.org/zhaose233/gnome-extension-keyboard-suggestions-height): Explicitly enlarge the suggestions row to avoid it changing size all the time due to a unfixed gnome-shell bug.

## Contributing

### Reporting Issues

To report an issue or bug, visit the official [issue tracker](https://github.com/v81d/gnome-extension-custom-osk-height/issues) on GitHub.

### Translating the Project

You can contribute by adding translations for strings in the application. See [TRANSLATING.md](TRANSLATING.md) for more information.

### Pull Requests

To push your features or fixes into this official repository:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/my-feature`) or a fix branch (`git checkout -b fix/my-fix`).
3. Commit your changes (`git commit -m "feat: add new feature"`). **Please follow the [Conventional Commits](https://www.conventionalcommits.org) guideline when doing so!**
4. Push the branch (`git push origin feature/my-feature`).
5. Open a pull request with `develop` as the base branch. Make sure to create a detailed title and description of your change.

Please follow the [GitHub flow](https://guides.github.com/introduction/flow) when submitting a pull request.

## License

Custom OSK Height is free software distributed under the **GNU General Public License, version 2.0 or later (GPL-2.0+).**

You are free to use, modify, and share the software under the terms of the GPL.
For full details, see the [GNU General Public License v2.0](https://www.gnu.org/licenses/gpl-2.0.html).
