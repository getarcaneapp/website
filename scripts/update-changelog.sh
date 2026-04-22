#!/usr/bin/env bash
set -euo pipefail

REPO="${REPO:-getarcaneapp/arcane}"
CHANGELOG_DIR="${CHANGELOG_DIR:-content/changelog}"
PER_PAGE="${PER_PAGE:-100}"
RELEASES_JSON="${RELEASES_JSON:-}"

WORK_DIR=$(mktemp -d)
cleanup() { rm -rf "$WORK_DIR"; }
trap cleanup EXIT

if [[ -n "$RELEASES_JSON" && -f "$RELEASES_JSON" ]]; then
	cp "$RELEASES_JSON" "$WORK_DIR/releases.json"
else
	if [[ -n "${GITHUB_TOKEN:-}" ]]; then
		curl -sSL \
			-H "Authorization: Bearer $GITHUB_TOKEN" \
			-H "Accept: application/vnd.github+json" \
			"https://api.github.com/repos/${REPO}/releases?per_page=${PER_PAGE}" \
			-o "$WORK_DIR/releases.json"
	else
		curl -sSL \
			-H "Accept: application/vnd.github+json" \
			"https://api.github.com/repos/${REPO}/releases?per_page=${PER_PAGE}" \
			-o "$WORK_DIR/releases.json"
	fi
fi

jq '[.[] | select(.draft == false and .prerelease == false) | {
	tag: .tag_name,
	sort: (.published_at // .created_at // ""),
	date: ((.published_at // .created_at // "") | split("T")[0]),
	url: .html_url,
	body: (.body // "")
}]' "$WORK_DIR/releases.json" > "$WORK_DIR/releases.filtered.json"

if [[ "$(jq 'length' "$WORK_DIR/releases.filtered.json")" -eq 0 ]]; then
	echo "No releases found for $REPO" >&2
	exit 1
fi

mkdir -p "$CHANGELOG_DIR"

EXISTING_DIR="$WORK_DIR/existing-sections"
OUT_DIR="$WORK_DIR/out-sections"
GENERATED_DIR="$WORK_DIR/generated"
MAP_FILE="$WORK_DIR/section-map.tsv"
ORDER_FILE="$WORK_DIR/section-order.tsv"
USED_FILE="$WORK_DIR/used-tags.txt"
YEARS_FILE="$WORK_DIR/years.txt"

mkdir -p "$EXISTING_DIR" "$OUT_DIR" "$GENERATED_DIR"
: > "$MAP_FILE"
: > "$ORDER_FILE"
: > "$USED_FILE"
: > "$YEARS_FILE"

safe_name() {
	printf '%s' "$1" | tr -c 'A-Za-z0-9._-' '_'
}

for file in "$CHANGELOG_DIR"/*.md; do
	[[ -e "$file" ]] || continue

	year=$(basename "$file" .md)
	awk \
		-v dir="$EXISTING_DIR" \
		-v year="$year" \
		-v map="$MAP_FILE" \
		-v order="$ORDER_FILE" '
		function safe(s) {
			gsub(/[^A-Za-z0-9._-]/, "_", s)
			return s
		}
		BEGIN {
			in_fm = 0
			fm_done = 0
			tag = ""
		}
		{
			line = $0
			sub(/\r$/, "", line)

			if (!fm_done && line == "---") {
				in_fm = !in_fm
				if (!in_fm) fm_done = 1
				next
			}

			if (in_fm) next

			if (line ~ /^##[[:space:]]+/) {
				if (tag != "") close(section_file)
				split(line, parts, /[[:space:]]+/)
				tag = parts[2]
				section_file = dir "/" year "-" safe(tag) ".md"
				print tag "\t" year "\t" section_file >> map
				print year "\t" tag >> order
				print line > section_file
				next
			}

			if (tag != "") {
				print line > section_file
			}
		}
		END {
			if (tag != "") close(section_file)
		}
	' "$file"
done

section_file_for_tag() {
	awk -F'\t' -v t="$1" '$1 == t { print $3; exit }' "$MAP_FILE"
}

section_year_for_tag() {
	awk -F'\t' -v t="$1" '$1 == t { print $2; exit }' "$MAP_FILE"
}

register_year() {
	local year="$1"
	if ! grep -qFx "$year" "$YEARS_FILE"; then
		echo "$year" >> "$YEARS_FILE"
	fi
}

append_section_file_to_year() {
	local year="$1"
	local file="$2"
	register_year "$year"
	cat "$file" >> "$OUT_DIR/$year.md"
	printf "\n\n" >> "$OUT_DIR/$year.md"
}

append_generated_section() {
	local year="$1"
	local tag="$2"
	local date="$3"
	local url="$4"
	local body="$5"

	register_year "$year"
	{
		echo "## $tag${date:+ - $date}"
		echo
		echo "[Release]($url)"
		echo
		if [[ -n "$body" ]]; then
			printf "%s\n" "$body"
		fi
		echo
	} >> "$OUT_DIR/$year.md"
}

while IFS= read -r release; do
	tag=$(jq -r .tag <<<"$release")
	date=$(jq -r .date <<<"$release")
	url=$(jq -r .url <<<"$release")
	body=$(jq -r .body <<<"$release")
	year="${date:0:4}"
	if [[ -z "$year" || "$year" == "null" ]]; then
		echo "Release $tag is missing a publish date" >&2
		exit 1
	fi

	file=$(section_file_for_tag "$tag")
	if [[ -n "$file" ]]; then
		echo "$tag" >> "$USED_FILE"
		append_section_file_to_year "$year" "$file"
	else
		append_generated_section "$year" "$tag" "$date" "$url" "$body"
	fi
done < <(jq -c 'sort_by(.sort) | reverse | .[]' "$WORK_DIR/releases.filtered.json")

while IFS=$'\t' read -r year tag; do
	[[ -z "$year" || -z "$tag" ]] && continue
	if ! grep -qFx "$tag" "$USED_FILE"; then
		file=$(section_file_for_tag "$tag")
		[[ -n "$file" ]] || continue
		append_section_file_to_year "$year" "$file"
	fi
done < "$ORDER_FILE"

trim_file() {
	local input="$1"
	local output="$2"

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
	' "$input" > "$output.blanks"

	awk '
		NF { last = NR }
		{ lines[NR] = $0 }
		END {
			for (i = 1; i <= last; i++) print lines[i]
		}
	' "$output.blanks" > "$output"
}

changed=false

while IFS= read -r year; do
	[[ -z "$year" ]] && continue

	bucket="$OUT_DIR/$year.md"
	trimmed="$GENERATED_DIR/$year.body.md"
	final="$GENERATED_DIR/$year.md"
	target="$CHANGELOG_DIR/$year.md"

	trim_file "$bucket" "$trimmed"

	{
		echo "---"
		echo "title: 'Changelog $year'"
		echo "description: 'Arcane release notes for $year'"
		echo "---"
		echo
		cat "$trimmed"
		echo
	} > "$final"

	if [[ ! -f "$target" ]] || ! cmp -s "$final" "$target"; then
		cp "$final" "$target"
		changed=true
	fi
done < <(sort -r "$YEARS_FILE")

for file in "$CHANGELOG_DIR"/*.md; do
	[[ -e "$file" ]] || continue
	year=$(basename "$file" .md)
	if ! grep -qFx "$year" "$YEARS_FILE"; then
		rm -f "$file"
		changed=true
	fi
done

if [[ "$changed" == "false" ]]; then
	echo "Changelog already up to date."
else
	echo "Changelog updated."
fi
