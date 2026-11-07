/* extension.js
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

import * as Main from "resource:///org/gnome/shell/ui/main.js";
import * as KeyboardBase from "resource:///org/gnome/shell/ui/keyboard.js";
import {
  Extension,
  InjectionManager,
} from "resource:///org/gnome/shell/extensions/extension.js";

export default class CustomOskHeightExtension extends Extension {
  enable() {
    this._settings = this.getSettings();
    this._injectionManager = new InjectionManager();

    // override relayout method
    this._injectionManager.overrideMethod(
      KeyboardBase.Keyboard.prototype,
      "_relayout",
      (originalMethod) => {
        const settings = this._settings;

        return function (...args) {
          originalMethod.call(this, ...args);

          // get screen orientation
          const monitor = Main.layoutManager.keyboardMonitor;
          if (!monitor) return;

          const isPortrait = monitor.height > monitor.width;

          // whether to scale the OSK by a multiplier or set to a fixed pixel height
          const modifierMode = settings.get_string("osk-height-modifier-mode");

          if (modifierMode === "multiplier") {
            const multiplier = isPortrait
              ? settings.get_double("portrait-osk-height-multiplier")
              : settings.get_double("landscape-osk-height-multiplier");

            // multiply current OSK height by multiplier
            this.height = Math.round(this.height * multiplier);
          } else {
            const pixelHeight = isPortrait
              ? settings.get_uint("portrait-osk-height-pixels")
              : settings.get_uint("landscape-osk-height-pixels");

            // change current OSK height to new pixel value
            this.height = pixelHeight;
          }

          const suggestionsHeightEnabled = settings.get_boolean(
            "custom-osk-suggestions-height-enabled",
          );

          if (suggestionsHeightEnabled)
            this._suggestions.height = settings.get_uint(
              "osk-suggestions-height-pixels",
            );
          else this._suggestions.height = -1;
        };
      },
    );

    const forceRelayout = () => Main.keyboard?.keyboardActor?._relayout();

    // relayout when the modifier mode changes
    this._modeChangedId = this._settings.connect(
      "changed::osk-height-modifier-mode",
      forceRelayout,
    );

    // relayout when the multiplier changes
    this._landscapeMultiplierChangedId = this._settings.connect(
      "changed::landscape-osk-height-multiplier",
      forceRelayout,
    );
    this._portraitMultiplierChangedId = this._settings.connect(
      "changed::portrait-osk-height-multiplier",
      forceRelayout,
    );

    // relayout when the pixel height changes
    this._landscapePixelsChangedId = this._settings.connect(
      "changed::landscape-osk-height-pixels",
      forceRelayout,
    );
    this._portraitPixelsChangedId = this._settings.connect(
      "changed::portrait-osk-height-pixels",
      forceRelayout,
    );

    // relayout when suggestion row settings change
    this._suggestionsHeightEnabledChangedId = this._settings.connect(
      "changed::custom-osk-suggestions-height-enabled",
      forceRelayout,
    );
    this._suggestionsHeightChangedId = this._settings.connect(
      "changed::osk-suggestions-height-pixels",
      forceRelayout,
    );

    forceRelayout();
  }

  disable() {
    this._settings?.disconnect(this._modeChangedId);
    this._settings?.disconnect(this._landscapeMultiplierChangedId);
    this._settings?.disconnect(this._portraitMultiplierChangedId);
    this._settings?.disconnect(this._landscapePixelsChangedId);
    this._settings?.disconnect(this._portraitPixelsChangedId);
    this._settings?.disconnect(this._suggestionsHeightEnabledChangedId);
    this._settings?.disconnect(this._suggestionsHeightChangedId);

    this._modeChangedId = null;
    this._landscapeMultiplierChangedId = null;
    this._portraitMultiplierChangedId = null;
    this._landscapePixelsChangedId = null;
    this._portraitPixelsChangedId = null;
    this._suggestionsHeightEnabledChangedId = null;
    this._suggestionsHeightChangedId = null;

    this._injectionManager?.clear();
    this._injectionManager = null;

    const keyboardActor = Main.keyboard?.keyboardActor;
    if (keyboardActor) {
      if (keyboardActor._suggestions) keyboardActor._suggestions.height = -1;
      keyboardActor._relayout();
    }
  }
}
