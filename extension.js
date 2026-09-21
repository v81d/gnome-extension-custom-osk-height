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
          const monitor = Main.layoutManager.primaryMonitor;
          const isPortrait = monitor.height > monitor.width;
          const oskHeightMultiplier = isPortrait
            ? settings.get_double("portrait-osk-height-multiplier")
            : settings.get_double("landscape-osk-height-multiplier");

          // modify OSK height
          this.height = Math.round(this.height * oskHeightMultiplier);
        };
      },
    );

    const forceRelayout = () => Main.keyboard._keyboard?.queue_relayout();

    this._landscapeChangedId = this._settings.connect(
      "changed::landscape-osk-height-multiplier",
      forceRelayout,
    );
    this._portraitChangedId = this._settings.connect(
      "changed::portrait-osk-height-multiplier",
      forceRelayout,
    );

    forceRelayout();
  }

  disable() {
    this._settings?.disconnect(this._landscapeChangedId);
    this._settings?.disconnect(this._portraitChangedId);
    this._landscapeChangedId = null;
    this._portraitChangedId = null;
    this._injectionManager?.clear();
    this._injectionManager = null;
  }
}
