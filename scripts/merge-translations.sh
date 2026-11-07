for pofile in po/*.po; do
  msgmerge --update "$pofile" po/custom-osk-height.pot
done
