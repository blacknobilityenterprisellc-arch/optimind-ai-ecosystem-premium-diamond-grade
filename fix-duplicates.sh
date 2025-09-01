#!/bin/bash

# Fix duplicate imports and functions in API routes
echo "Fixing duplicate imports and functions..."

# Fix health route - remove duplicate imports and functions
sed -i '1,5d' src/app/api/health/route.ts

# Fix other routes with similar issues
for file in src/app/api/*/route.ts src/app/api/*/*/route.ts; do
    if [ -f "$file" ]; then
        # Remove duplicate import lines if they exist
        sed -i '/^import.*NextResponse.*next\/server$/{
            N
            /\nimport.*NextResponse.*next\/server$/d
        }' "$file"
        
        # Remove duplicate function definitions
        sed -i '/^export async function GET() {$/,/^}$/{
            /^export async function GET() {$/{
                N
                /\n}$/!{
                    N
                    /\nexport async function GET/{
                        s/^export async function GET() {$/\n/
                    }
                }
            }
        }' "$file"
    fi
done

echo "Fixed duplicate imports and functions"
