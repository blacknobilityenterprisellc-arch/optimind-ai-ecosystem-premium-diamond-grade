#!/bin/bash

# Find all files with merge conflicts
find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | grep -v node_modules | grep -v .next | while read file; do
    if grep -q "<<<<<<< HEAD" "$file"; then
        echo "Resolving conflicts in $file"
        # Remove conflict markers and keep the content after <<<<<<< HEAD
        sed -i '/^<<<<<<< HEAD$/,/^=======$/ {
            /^<<<<<<< HEAD$/d
            /^=======$/d
        }' "$file"
        # Remove the remaining conflict marker
        sed -i '/^>>>>>>> .*$/d' "$file"
    fi
done

echo "All conflicts resolved"
