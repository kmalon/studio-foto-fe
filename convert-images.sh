#!/usr/bin/env bash
# Convert site images to WebP IN PLACE (originals are replaced), full-size and thumbnails.
# Run from src/assets:   bash convert-images.sh
# Needs: imagemagick, webp (cwebp + webpmux)
#
# !! Originals (jpg/png/...) in in-place directories are DELETED after a
# !! successful conversion. Keep your exports elsewhere or commit to git first.
#
# Typical use: copy the same originals into full/ AND thumbs/, run the script.
# Re-running is safe: only files that are not WebP yet get converted.
# Existing WebP files are never re-encoded (that would only lose quality).

set -uo pipefail
shopt -s nullglob nocaseglob extglob

# ============================ CONFIGURATION ============================
#
# One line per directory:   "TYPE | SOURCE DIR | OUTPUT DIR"
#
#   TYPE        full   -> max FULL_SIZE,  quality FULL_Q   (lightbox, slideshow)
#               thumb  -> max THUMB_SIZE, quality THUMB_Q  (grids)
#   SOURCE DIR  relative to where you run the script; wildcards allowed
#               (gallery/*/full = the full/ folder of every session)
#   OUTPUT DIR  leave empty = convert IN PLACE, original is replaced (normal use)
#               optional: write to another folder instead, relative to SOURCE dir,
#               originals kept — e.g. "thumb | portfolio/full | ../thumbs"
#               makes thumbnails from the full-size folder
#
DIRS=(
  "full  | src/assets/start 			|"
  "full  | src/assets/portfolio/full		|"
  "thumb | src/assets/portfolio/thumbs	|"
  "full  | src/assets/gallery/*/full		|"
  "thumb | src/assets/gallery/*/thumbial	|"
)

FULL_Q=90               # quality for full-size images (0-100)
THUMB_Q=80              # quality for thumbnails (0-100)
FULL_SIZE='2048x2048>'  # fit inside 2048x2048, never enlarge
THUMB_SIZE='800x>'      # 800px wide, never enlarge
COPYRIGHT="Angelika Malon"
FORCE=${FORCE:-0}       # 1 = rebuild existing outputs (only for lines WITH an OUTPUT DIR)
# =======================================================================

SRC='*.@(jpg|jpeg|png|tif|tiff|heic|heif)'        # formats that get converted
ANY='*.@(jpg|jpeg|png|tif|tiff|heic|heif|webp)'   # thumbnail sources (incl. converted .webp)

for cmd in convert cwebp webpmux identify; do
  command -v "$cmd" >/dev/null || { echo "Missing: $cmd"; exit 1; }
done

trim() { local s="$1"; s="${s#"${s%%[![:space:]]*}"}"; echo "${s%"${s##*[![:space:]]}"}"; }

# Copyright metadata (XMP) embedded into every WebP with webpmux
XMP_FILE=$(mktemp)
trap 'rm -f "$XMP_FILE"' EXIT
cat > "$XMP_FILE" <<XMP
<?xpacket begin="" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/"
    xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/">
   <dc:creator><rdf:Seq><rdf:li>$COPYRIGHT</rdf:li></rdf:Seq></dc:creator>
   <dc:rights><rdf:Alt><rdf:li xml:lang="x-default">© $COPYRIGHT</rdf:li></rdf:Alt></dc:rights>
   <photoshop:Credit>$COPYRIGHT</photoshop:Credit>
   <xmpRights:Marked>True</xmpRights:Marked>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>
XMP

# $1 = source, $2 = resize geometry, $3 = quality, $4 = output webp
# Writes to temp files and checks the result is a valid image before moving it into place.
encode() {
  local tmp="$4.tmp.$$" tmp2="$4.tmp2.$$"
  convert "$1[0]" -auto-orient -resize "$2" -colorspace sRGB -strip png:- 2>/dev/null \
    | cwebp -quiet -q "$3" -m 6 -sharp_yuv -o "$tmp" -- - 2>/dev/null \
    && webpmux -set xmp "$XMP_FILE" "$tmp" -o "$tmp2" >/dev/null 2>&1 \
    && [ -s "$tmp2" ] && identify "$tmp2" >/dev/null 2>&1 \
    && mv -f "$tmp2" "$4" && rm -f "$tmp" || { rm -f "$tmp" "$tmp2"; return 1; }
}

full_jobs=()
thumb_jobs=()
skipped=0
declare -A seen      # output path -> source, to catch name clashes (a.jpg + a.png)
declare -A replaced  # sources that will be converted in place (new/replaced photos)

add_job() {  # $1 type, $2 src, $3 geometry, $4 quality, $5 output, $6 delete-source(0/1)
  local type=$1 src=$2 out=$5
  if [[ -n "${seen[$out]:-}" ]]; then
    # a converted .webp next to a new original of the same name — the original wins, skip quietly
    [[ "${src,,}" == *.webp ]] && return
    echo "  SKIP (name clash): $src -> $out already comes from ${seen[$out]}"
    return
  fi
  seen[$out]=$src

  # skip check only for lines with an OUTPUT DIR; in-place sources are always unconverted
  if [[ "$6" != 1 && "$type" == thumb && "$FORCE" != 1 && -f "$out" ]]; then
    if [[ -n "${replaced[$src]:-}" ]]; then
      :                                   # photo is new/replaced -> always redo its thumbnail
    elif [[ "${src,,}" == *.webp || "$out" -nt "$src" ]]; then
      skipped=$((skipped + 1)); return    # thumbnail already exists and is up to date
    fi
  fi

  if [[ "$type" == full ]]; then
    [[ "$6" == 1 ]] && replaced[$src]=1
    full_jobs+=("$src|$3|$4|$out|$6")
  else
    thumb_jobs+=("$src|$3|$4|$out|$6")
  fi
}

# ---- build the job lists from DIRS (all "full" lines first, then "thumb") ----
for pass in full thumb; do
  for line in "${DIRS[@]}"; do
    IFS='|' read -r type pattern outrel <<< "$line"
    type=$(trim "${type,,}"); pattern=$(trim "$pattern"); outrel=$(trim "${outrel:-}")

    case "$type" in
      full)  geom=$FULL_SIZE;  q=$FULL_Q ;;
      thumb) geom=$THUMB_SIZE; q=$THUMB_Q ;;
      *) echo "Config error: unknown type '$type' in: $line (use full or thumb)"; exit 1 ;;
    esac
    [[ "$type" != "$pass" ]] && continue

    matched=0
    for dir in $pattern; do
      [ -d "$dir" ] || continue
      matched=1
      if [ -z "$outrel" ]; then
        for f in "$dir"/$SRC; do            # in place: originals get replaced
          add_job "$type" "$f" "$geom" "$q" "$dir/$(basename "${f%.*}").webp" 1
        done
      else
        out=$(realpath -m --relative-to=. "$dir/$outrel"); mkdir -p "$out"
        for f in "$dir"/$ANY; do
          [[ "$type" == full && "${f,,}" == *.webp ]] && continue   # never re-encode full webp
          [[ "$type" == full && "$FORCE" != 1 && -f "$out/$(basename "${f%.*}").webp" \
             && "$out/$(basename "${f%.*}").webp" -nt "$f" ]] && { skipped=$((skipped + 1)); continue; }
          add_job "$type" "$f" "$geom" "$q" "$out/$(basename "${f%.*}").webp" 0
        done
      fi
    done
    [ "$matched" -eq 0 ] && echo "  WARNING: no directory matches '$pattern' — check DIRS"
  done
done

# thumbnails first (when made from a full/ folder they need its originals), then full-size
jobs=("${thumb_jobs[@]}" "${full_jobs[@]}")
total=${#jobs[@]}
if [ "$total" -eq 0 ]; then
  echo "Nothing new to convert — everything is already WebP."; exit 0
fi

echo "Converting ${#full_jobs[@]} full-size + ${#thumb_jobs[@]} thumbnails (full q$FULL_Q, thumbs q$THUMB_Q)..."
start_ts=$(date +%s)
failed=0; deleted=0; in_bytes=0; out_bytes=0
written=()

for i in "${!jobs[@]}"; do
  IFS='|' read -r src geom q out del <<< "${jobs[$i]}"
  n=$((i + 1))

  if [ ! -f "$src" ]; then
    failed=$((failed + 1)); printf '\n  MISSING: %s\n' "$src"
  elif encode "$src" "$geom" "$q" "$out"; then
    written+=("$out")
    out_bytes=$((out_bytes + $(stat -c%s "$out")))
    if [[ "$del" == 1 ]]; then
      in_bytes=$((in_bytes + $(stat -c%s "$src")))
      rm -f -- "$src" && deleted=$((deleted + 1))
    fi
  else
    failed=$((failed + 1))
    printf '\n  FAILED (original kept): %s\n' "$src"
  fi

  # progress bar + ETA
  pct=$((n * 100 / total))
  filled=$((pct * 30 / 100))
  bar=$(printf '%*s' "$filled" '' | tr ' ' '#')$(printf '%*s' $((30 - filled)) '' | tr ' ' '.')
  elapsed=$(( $(date +%s) - start_ts ))
  eta=$(( elapsed * (total - n) / n ))
  printf '\r[%s] %3d%%  %d/%d  ETA %dm%02ds  %-45.45s' \
    "$bar" "$pct" "$n" "$total" $((eta / 60)) $((eta % 60)) "$out"
done
echo

elapsed=$(( $(date +%s) - start_ts ))
printf 'Done in %dm%02ds: %d written, %d failed, %d originals replaced (%d MB -> WebP total written %d MB)\n' \
  $((elapsed / 60)) $((elapsed % 60)) ${#written[@]} "$failed" "$deleted" \
  $((in_bytes / 1048576)) $((out_bytes / 1048576))
