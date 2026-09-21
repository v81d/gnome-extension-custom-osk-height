/* prefs.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */
import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import {
  ExtensionPreferences,
  gettext as _,
} from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js";
import Gio from "gi://Gio";

export default class CustomOskHeightPreferences extends ExtensionPreferences {
  fillPreferencesWindow(window) {
    const settings = this.getSettings();

    const mainPage = new Adw.PreferencesPage();
    window.add(mainPage);

    const mainGroup = new Adw.PreferencesGroup();
    mainPage.add(mainGroup);

    const landscapeOskHeightMultiplierRow = new Adw.SpinRow({
      title: _("Landscape Mode OSK Height Multiplier"),
      subtitle: _("OSK height multiplier when in landscape mode."),
      adjustment: new Gtk.Adjustment({
        lower: 0.1,
        upper: 3.0,
        step_increment: 0.1,
        page_increment: 1.0,
      }),
      digits: 2,
    });
    mainGroup.add(landscapeOskHeightMultiplierRow);

    const portraitOskHeightMultiplierRow = new Adw.SpinRow({
      title: _("Portrait Mode OSK Height Multiplier"),
      subtitle: _("OSK height multiplier when in portrait mode."),
      adjustment: new Gtk.Adjustment({
        lower: 0.1,
        upper: 4.0,
        step_increment: 0.1,
        page_increment: 1.0,
      }),
      digits: 2,
    });
    mainGroup.add(portraitOskHeightMultiplierRow);

    settings.bind(
      "landscape-osk-height-multiplier",
      landscapeOskHeightMultiplierRow,
      "value",
      Gio.SettingsBindFlags.DEFAULT,
    );
    settings.bind(
      "portrait-osk-height-multiplier",
      portraitOskHeightMultiplierRow,
      "value",
      Gio.SettingsBindFlags.DEFAULT,
    );
  }
}
