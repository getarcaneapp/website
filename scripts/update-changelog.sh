#!/usr/bin/env bash
set -euo pipefail

REPO="${REPO:-getarcaneapp/arcane}"
CHANGELOG="${CHANGELOG:-content/changelog.md}"
PER_PAGE="${PER_PAGE:-100}"
RELEASES_JSON="${RELEASES_JSON:-}"

TMPDIR=$(mktemp -d)
cleanup() { rm -rf "$TMPDIR"; }
trap cleanup EXIT

if [[ -n "$RELEASES_JSON" && -f "$RELEASES_JSON" ]]; then
  cp "$RELEASES_JSON" "$TMPDIR/releases.json"
else
  if [[ -n "${GITHUB_TOKEN:-}" ]]; then
    curl -sSL \
      -H "Authorization: Bearer $GITHUB_TOKEN" \
      -H "Accept: application/vnd.github+json" \
      "https://api.github.com/repos/${REPO}/releases?per_page=${PER_PAGE}" \
      -o "$TMPDIR/releases.json"
  else
    curl -sSL \
      -H "Accept: application/vnd.github+json" \
      "https://api.github.com/repos/${REPO}/releases?per_page=${PER_PAGE}" \
      -o "$TMPDIR/releases.json"
  fi
fi

jq '[.[] | select(.draft == false and .prerelease == false) | {
  tag: .tag_name,
  sort: (.published_at // .created_at // ""),
  date: ((.published_at // .created_at // "") | split("T")[0]),
  url: .html_url,
  body: (.body // "")
}]' "$TMPDIR/releases.json" > "$TMPDIR/releases.filtered.json"

if [[ "$(jq 'length' "$TMPDIR/releases.filtered.json")" -eq 0 ]]; then
  echo "No releases found for $REPO" >&2
  exit 1
fi

DEFAULT_FM=$'---\n'"title: 'Changelog'"$'\n'"description: 'Release notes for Arcane'"$'\n---'

FM_FILE="$TMPDIR/frontmatter.md"
CLEAN_FILE="$TMPDIR/changelog.clean.md"
: > "$FM_FILE"
if [[ -f "$CHANGELOG" ]]; then
  awk -v title="title: 'Changelog'" -v desc="description: 'Release notes for Arcane'" -v fmfile="$FM_FILE" '
    BEGIN { in_fm=0; has_title=0; has_desc=0; buf=""; saved=0 }
    {
      line=$0
      sub(/\r$/, "", line)
      if (line == "---") {
        if (in_fm==0) {
          in_fm=1; has_title=0; has_desc=0; buf=line "\n"; next
        }
        buf=buf line "\n"
        if (has_title && has_desc) {
          if (saved==0) { printf "%s", buf > fmfile; saved=1 }
          in_fm=0; buf=""; next
        }
        printf "%s", buf
        in_fm=0; buf=""
        next
      }
      if (in_fm) {
        buf=buf line "\n"
        if (line == title) has_title=1
        if (line == desc) has_desc=1
        next
      }
      print line
    }
    END { if (in_fm) printf "%s", buf }
  ' "$CHANGELOG" > "$CLEAN_FILE"
else
  : > "$CLEAN_FILE"
fi

SECTION_DIR="$TMPDIR/sections"
MAP_FILE="$TMPDIR/section-map.tsv"
ORDER_FILE="$TMPDIR/section-order.txt"
PREAMBLE_FILE="$TMPDIR/preamble.md"
mkdir -p "$SECTION_DIR"
: > "$MAP_FILE"
: > "$ORDER_FILE"
: > "$PREAMBLE_FILE"

awk -v dir="$SECTION_DIR" -v map="$MAP_FILE" -v order="$ORDER_FILE" -v pre="$PREAMBLE_FILE" '
  function safe(s) { gsub(/[^A-Za-z0-9._-]/, "_", s); return s }
  {
    line=$0
    sub(/\r$/, "", line)
    if (line ~ /^##[[:space:]]+/) {
      if (tag != "") close(file)
      split(line, parts, /[[:space:]]+/)
      tag = parts[2]
      safe_tag = safe(tag)
      file = dir "/" safe_tag ".md"
      print tag "\t" file >> map
      print tag >> order
      print line > file
      next
    }
    if (tag == "") {
      print line > pre
    } else {
      print line > file
    }
  }
  END { if (tag != "") close(file) }
' "$CLEAN_FILE"

USED_FILE="$TMPDIR/used-tags.txt"
: > "$USED_FILE"

section_file_for_tag() {
  awk -F'\t' -v t="$1" '$1 == t { print $2; exit }' "$MAP_FILE"
}

NEW_FILE="$TMPDIR/changelog.new.md"
if [[ -s "$FM_FILE" ]]; then
  cat "$FM_FILE" > "$NEW_FILE"
else
  printf "%s\n" "$DEFAULT_FM" > "$NEW_FILE"
fi
printf "\n" >> "$NEW_FILE"

PREAMBLE_TRIM="$TMPDIR/preamble.trim.md"
awk 'NF { seen=1 } seen { print }' "$PREAMBLE_FILE" > "$PREAMBLE_TRIM"
if [[ -s "$PREAMBLE_TRIM" ]]; then
  cat "$PREAMBLE_TRIM" >> "$NEW_FILE"
  printf "\n\n" >> "$NEW_FILE"
fi

append_section_file() {
  local file="$1"
  cat "$file" >> "$NEW_FILE"
  printf "\n\n" >> "$NEW_FILE"
}

append_generated_section() {
  local tag="$1"
  local date="$2"
  local url="$3"
  local body="$4"

  {
    echo "## $tag${date:+ - $date}"
    echo
    echo "[Release]($url)"
    echo
    if [[ -n "$body" ]]; then
      printf "%s\n" "$body"
    fi
  } >> "$NEW_FILE"
  printf "\n" >> "$NEW_FILE"
}

while IFS= read -r release; do
  tag=$(jq -r .tag <<<"$release")
  date=$(jq -r .date <<<"$release")
  url=$(jq -r .url <<<"$release")
  body=$(jq -r .body <<<"$release")

  file=$(section_file_for_tag "$tag")
  if [[ -n "$file" ]]; then
    echo "$tag" >> "$USED_FILE"
    append_section_file "$file"
  else
    append_generated_section "$tag" "$date" "$url" "$body"
  fi
done < <(jq -c 'sort_by(.sort) | reverse | .[]' "$TMPDIR/releases.filtered.json")

while IFS= read -r tag; do
  [[ -z "$tag" ]] && continue
  if ! grep -qFx "$tag" "$USED_FILE"; then
    file=$(section_file_for_tag "$tag")
    if [[ -n "$file" ]]; then
      append_section_file "$file"
    fi
  fi
done < "$ORDER_FILE"

BLANKS_FILE="$TMPDIR/changelog.blanks.md"
awk '
  {
    line=$0
    sub(/\r$/, "", line)
    if (line ~ /^[[:space:]]*$/) {
      if (blank == 0) {
        print ""
        blank = 1
      }
      next
    }
    blank = 0
    print line
  }
' "$NEW_FILE" > "$BLANKS_FILE"

awk 'NF { last=NR } { lines[NR]=$0 } END { for (i=1; i<=last; i++) print lines[i] }' \
  "$BLANKS_FILE" > "$TMPDIR/changelog.final.md"

if [[ -f "$CHANGELOG" ]] && cmp -s "$TMPDIR/changelog.final.md" "$CHANGELOG"; then
  echo "Changelog already up to date."
  exit 0
fi

cp "$TMPDIR/changelog.final.md" "$CHANGELOG"
echo "Changelog updated."
