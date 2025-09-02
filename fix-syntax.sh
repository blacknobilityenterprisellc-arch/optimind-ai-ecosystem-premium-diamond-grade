#!/bin/bash

# Fix remaining syntax issues in files
echo "Fixing syntax issues..."

# Fix use-toast.ts - remove unused eslint-disable directive
sed -i '21s/.*//' src/hooks/use-toast.ts

echo "Fixed use-toast.ts"

echo "Syntax fixes completed"
