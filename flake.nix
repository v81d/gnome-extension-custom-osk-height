{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = {
    self,
    nixpkgs,
  }: let
    system = "x86_64-linux";
    pkgs = import nixpkgs {inherit system;};
    uuid = "custom-osk-height@v81d";
  in {
    packages.${system}.default = pkgs.stdenv.mkDerivation {
      pname = "gnome-extension-custom-osk-height";
      version = self.shortRev or self.dirtyShortRev or "dev";

      src = self;

      meta = with pkgs.lib; {
        description = "Change the height of the GNOME on-screen keyboard.";
        homepage = "https://github.com/v81d/gnome-extension-custom-osk-height";
        license = licenses.gpl2Plus;
        platforms = ["x86_64-linux" "aarch64-linux"];
      };

      nativeBuildInputs = with pkgs; [glib gettext];

      dontConfigure = true;
      dontBuild = true;

      installPhase = ''
        runHook preInstall

        extdir=$out/share/gnome-shell/extensions/${uuid}
        mkdir -p "$extdir"
        cp -r . "$extdir"

        rm -rf "$extdir"/{.git,.github,flake.nix,flake.lock,.envrc,docs,scripts}
        rm -f "$extdir"/*.md

        if [ -d "$extdir/schemas" ]; then
          glib-compile-schemas "$extdir/schemas"
        fi

        if [ -d "$extdir/po" ]; then
          for pofile in "$extdir"/po/*.po; do
            lang=$(basename "$pofile" .po)
            mkdir -p "$extdir/locale/$lang/LC_MESSAGES"
            msgfmt "$pofile" -o "$extdir/locale/$lang/LC_MESSAGES/${uuid}.mo"
          done
          rm -rf "$extdir/po"
        fi

        runHook postInstall
      '';
    };

    devShells.x86_64-linux.default = pkgs.mkShell {
      buildInputs = with pkgs; [
        prettier
        vtsls
        vscode-css-languageserver
        vscode-json-languageserver
        lemminx
        glib
      ];
    };
  };
}
