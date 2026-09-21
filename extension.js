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

// testing first
const HEIGHT_MULTIPLIER = 1.25;

export default class CustomOskHeightExtension extends Extension {
  enable() {
    this._injectionManager = new InjectionManager();

    // override
    this._injectionManager.overrideMethod(
      KeyboardBase.Keyboard.prototype,
      "_relayout",
      (originalMethod) =>
        function (...args) {
          originalMethod.call(this, ...args);
          this.height = Math.round(this.height * HEIGHT_MULTIPLIER); // TODO: get the multiplier from prefs
        },
    );

    Main.keyboard._keyboard?.queue_relayout();
  }

  disable() {
    this._injectionManager?.clear();
    this._injectionManager = null;
  }
}
