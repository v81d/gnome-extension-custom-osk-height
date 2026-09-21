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

    const landscapeOskHeightModifierAdjustment = new Gtk.Adjustment({
      lower: 0.1,
      upper: 4096.0,
      step_increment: 0.1,
      page_increment: 1.0,
      value: 1.0,
    });

    const portraitOskHeightModifierAdjustment = new Gtk.Adjustment({
      lower: 0.1,
      upper: 4096.0,
      step_increment: 0.1,
      page_increment: 1.0,
      value: 1.0,
    });

    const oskHeightModifierModeRow = new Adw.ComboRow({
      title: _("OSK Height Modifier Mode"),
      subtitle: _("How the OSK height modifier is interpreted."),
      model: Gtk.StringList.new([_("Multiplier"), _("Pixel value")]),
    });
    mainGroup.add(oskHeightModifierModeRow);

    oskHeightModifierModeRow.selected =
      settings.get_string("osk-height-modifier-mode") === "multiplier" ? 0 : 1;

    const landscapeOskHeightModifierRow = new Adw.SpinRow({
      title: _("Landscape Mode OSK Height Modifier"),
      subtitle: _("OSK height modifier when in landscape mode."),
      adjustment: landscapeOskHeightModifierAdjustment,
      digits: 2,
    });
    mainGroup.add(landscapeOskHeightModifierRow);

    const portraitOskHeightModifierRow = new Adw.SpinRow({
      title: _("Portrait Mode OSK Height Modifier"),
      subtitle: _("OSK height modifier when in portrait mode."),
      adjustment: portraitOskHeightModifierAdjustment,
      digits: 2,
    });
    mainGroup.add(portraitOskHeightModifierRow);

    oskHeightModifierModeRow.connect("notify::selected", () => {
      settings.set_string(
        "osk-height-modifier-mode",
        oskHeightModifierModeRow.selected === 0 ? "multiplier" : "pixel-value",
      );
    });

    settings.bind(
      "landscape-osk-height-modifier",
      landscapeOskHeightModifierRow,
      "value",
      Gio.SettingsBindFlags.DEFAULT,
    );
    settings.bind(
      "portrait-osk-height-modifier",
      portraitOskHeightModifierRow,
      "value",
      Gio.SettingsBindFlags.DEFAULT,
    );
  }
}
