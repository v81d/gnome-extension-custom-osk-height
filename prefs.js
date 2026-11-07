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

    const interpretationModeGroup = new Adw.PreferencesGroup({
      title: _("Interpretation Mode"),
      description: _("Configure how the height value is interpreted."),
    });
    mainPage.add(interpretationModeGroup);

    const multiplierSettingsGroup = new Adw.PreferencesGroup({
      title: _("Multiplier Settings"),
      description: _("Adjust the OSK height multiplier values."),
    });
    mainPage.add(multiplierSettingsGroup);

    const pixelHeightSettingsGroup = new Adw.PreferencesGroup({
      title: _("Pixel Height Settings"),
      description: _("Adjust the OSK pixel height values."),
    });
    mainPage.add(pixelHeightSettingsGroup);

    const suggestionsHeightOptionsGroup = new Adw.PreferencesGroup({
      title: _("Suggestions Height Options"),
      description: _("Control the OSK suggestions height."),
    });
    mainPage.add(suggestionsHeightOptionsGroup);

    /** The landscape OSK height multiplier adjustment. */
    const landscapeMultiplierAdjustment = new Gtk.Adjustment({
      lower: 0.1,
      upper: 4.0,
      step_increment: 0.1,
      page_increment: 1.0,
      value: 1.0,
    });

    /** The portrait OSK height multiplier adjustment. */
    const portraitMultiplierAdjustment = new Gtk.Adjustment({
      lower: 0.1,
      upper: 4.0,
      step_increment: 0.1,
      page_increment: 1.0,
      value: 1.0,
    });

    /** The landscape OSK pixel height adjustment. */
    const landscapePixelsAdjustment = new Gtk.Adjustment({
      lower: 128,
      upper: 4096,
      step_increment: 1,
      page_increment: 8,
      value: 432,
    });

    /** The portrait OSK pixel height adjustment. */
    const portraitPixelsAdjustment = new Gtk.Adjustment({
      lower: 128,
      upper: 4096,
      step_increment: 1,
      page_increment: 8,
      value: 480,
    });

    /** The OSK suggestion row height adjustment. */
    const suggestionsHeightAdjustment = new Gtk.Adjustment({
      lower: 32,
      upper: 128,
      step_increment: 1,
      page_increment: 4,
      value: 60,
    });

    /**
     * The OSK height interpretation mode row.
     *
     * Changing the selection changes which modifier rows to display.
     * For example, if the value is changed from Multiplier to Pixels, the multiplier rows will be hidden and the pixel height rows will be shown.
     */
    const modifierModeRow = new Adw.ComboRow({
      title: _("OSK Height Modifier Mode"),
      subtitle: _("How the OSK height modifier is interpreted."),
      model: Gtk.StringList.new([_("Multiplier"), _("Pixels")]),
    });
    interpretationModeGroup.add(modifierModeRow);

    modifierModeRow.selected =
      settings.get_string("osk-height-modifier-mode") === "multiplier" ? 0 : 1;

    /** The landscape mode OSK height multiplier value. */
    const landscapeMultiplierRow = new Adw.SpinRow({
      title: _("Landscape OSK Height Multiplier"),
      subtitle: _("The OSK height multiplier when in landscape mode."),
      adjustment: landscapeMultiplierAdjustment,
      digits: 2,
    });
    multiplierSettingsGroup.add(landscapeMultiplierRow);

    /** The portrait mode OSK height multiplier value. */
    const portraitMultiplierRow = new Adw.SpinRow({
      title: _("Portrait OSK Height Multiplier"),
      subtitle: _("OSK height multiplier when in portrait mode."),
      adjustment: portraitMultiplierAdjustment,
      digits: 2,
    });
    multiplierSettingsGroup.add(portraitMultiplierRow);

    /** The landscape mode OSK pixel height value. */
    const landscapePixelsRow = new Adw.SpinRow({
      title: _("Landscape OSK Pixel Height"),
      subtitle: _("The OSK pixel height when in landscape mode."),
      adjustment: landscapePixelsAdjustment,
    });
    pixelHeightSettingsGroup.add(landscapePixelsRow);

    /** The portrait mode OSK pixel height value. */
    const portraitPixelsRow = new Adw.SpinRow({
      title: _("Portrait OSK Pixel Height"),
      subtitle: _("The OSK pixel height when in portrait mode."),
      adjustment: portraitPixelsAdjustment,
    });
    pixelHeightSettingsGroup.add(portraitPixelsRow);

    /** The row to enable or disable customizing the OSK suggestion row height. */
    const suggestionsHeightEnabledRow = new Adw.SwitchRow({
      title: _("Enable Custom OSK Suggestions Height"),
      subtitle: _("Allow customizing the OSK suggestion row height."),
    });
    suggestionsHeightOptionsGroup.add(suggestionsHeightEnabledRow);

    /** The OSK suggestion row height value. */
    const suggestionsHeightPixelsRow = new Adw.SpinRow({
      title: _("OSK Suggestions Pixel Height"),
      subtitle: _("The pixel height of the OSK suggestion row."),
      adjustment: suggestionsHeightAdjustment,
    });
    suggestionsHeightOptionsGroup.add(suggestionsHeightPixelsRow);

    // callback when a new modifier mode is selected
    modifierModeRow.connect("notify::selected", () => {
      settings.set_string(
        "osk-height-modifier-mode",
        modifierModeRow.selected === 0 ? "multiplier" : "pixels",
      );

      updateModifierSensitivity();
    });

    suggestionsHeightEnabledRow.connect(
      "notify::active",
      updateSuggestionsPixelHeightSensitivity,
    );

    // on UI initialization
    updateModifierSensitivity();
    updateSuggestionsPixelHeightSensitivity();

    // add reset button to each row
    addResetButton(landscapeMultiplierRow, "landscape-osk-height-multiplier");
    addResetButton(portraitMultiplierRow, "portrait-osk-height-multiplier");
    addResetButton(landscapePixelsRow, "landscape-osk-height-pixels");
    addResetButton(portraitPixelsRow, "portrait-osk-height-pixels");
    addResetButton(suggestionsHeightPixelsRow, "osk-suggestions-height-pixels");

    // bind all multiplier rows to their respective gsettings keys
    settings.bind(
      "landscape-osk-height-multiplier",
      landscapeMultiplierRow,
      "value",
      Gio.SettingsBindFlags.DEFAULT,
    );
    settings.bind(
      "portrait-osk-height-multiplier",
      portraitMultiplierRow,
      "value",
      Gio.SettingsBindFlags.DEFAULT,
    );

    // bind all pixel height rows to their respective gsettings keys
    settings.bind(
      "landscape-osk-height-pixels",
      landscapePixelsRow,
      "value",
      Gio.SettingsBindFlags.DEFAULT,
    );
    settings.bind(
      "portrait-osk-height-pixels",
      portraitPixelsRow,
      "value",
      Gio.SettingsBindFlags.DEFAULT,
    );

    // bind custom suggestion height rows to their gsettings keys
    settings.bind(
      "custom-osk-suggestions-height-enabled",
      suggestionsHeightEnabledRow,
      "active",
      Gio.SettingsBindFlags.DEFAULT,
    );
    settings.bind(
      "osk-suggestions-height-pixels",
      suggestionsHeightPixelsRow,
      "value",
      Gio.SettingsBindFlags.DEFAULT,
    );

    /** Disable the multiplier group when pixel mode is enabled and vice versa. */
    function updateModifierSensitivity() {
      const isMultiplier = modifierModeRow.selected === 0;

      // disable the previous settings rows
      multiplierSettingsGroup.set_sensitive(isMultiplier);
      pixelHeightSettingsGroup.set_sensitive(!isMultiplier);
    }

    /** Disable the suggestions pixel height value row when its setting is toggled off. */
    function updateSuggestionsPixelHeightSensitivity() {
      suggestionsHeightPixelsRow.set_sensitive(
        suggestionsHeightEnabledRow.active,
      );
    }

    /** Add a reset to default button at the end of a row. */
    function addResetButton(row, key, afterReset = () => {}) {
      const button = new Gtk.Button({
        icon_name: "edit-undo-symbolic",
        tooltip_text: _("Reset to Default"),
        valign: Gtk.Align.CENTER,
      });

      button.add_css_class("flat");
      button.connect("clicked", () => {
        settings.reset(key);
        afterReset();
      });

      row.add_suffix(button);
    }
  }
}
