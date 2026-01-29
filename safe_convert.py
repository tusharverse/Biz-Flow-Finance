#!/usr/bin/env python3
"""
Carefully convert TypeScript to JavaScript without damaging JSX.
"""
import re
from pathlib import Path

def safe_convert(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Only remove type annotations that look obviously wrong
    # Pattern 1: : Type at the end of function parameters (before  ) or ,)
    content = re.sub(r':\s+([A-Za-z_][A-Za-z0-9_\.]*)\s*([,\)])', r'\2', content)
    
    # Pattern 2: : type | type (union types)
    content = re.sub(r':\s+[A-Za-z_][A-Za-z0-9_\.]*\s*\|[\s\w\.]*', '', content)
    
    # Pattern 3: Remove import type
    content = re.sub(r'import\s+type\s+{', 'import {', content)
    content = re.sub(r',\s*type\s+\w+', '', content)
    
    # Pattern 4: Update import paths
    content = re.sub(r"from\s+['\"]([^'\"]+)\.tsx['\"]", r"from '\1.jsx'", content)
    content = re.sub(r"from\s+['\"]([^'\"]+)\.ts['\"]", r"from '\1.js'", content)
    
    # Pattern 5: Remove !  only when it's a non-null assertion (followed by . or [ or ))
    content = re.sub(r'([a-zA-Z0-9_\)\]"\'`])\!(?=[\.\[\)])', r'\1', content)
    
    # Pattern 6: Remove as Type (but not as * import)
    content = re.sub(r'\s+as\s+([A-Z][A-Za-z0-9_]*)\s*([,\)])', r'\2', content)
    
    # Pattern 7: Remove generic types ONLY if they look safe (no JSX)
    # Only match <Type> patterns that are clearly types, not JSX
    # Don't remove if between < and > there's a / or already contains JSX-like syntax
    lines = content.split('\n')
    for i, line in enumerate(lines):
        # Skip lines that look like JSX (contain React keywords or /> syntax)
        if 'React' not in line and 'JSX' not in line and 'jsx' not in line:
            # Only remove pure type generics like useState<Type>
            line = re.sub(r'(useState|useCallback|useRef|useReducer|useMemo)<[^>]+>', lambda m: m.group(1), line)
            lines[i] = line
    content = '\n'.join(lines)
    
    # Pattern 8: Remove non-null (!) from getElementById-like patterns
    content = re.sub(r'getElementById\([^)]+\)!', lambda m: m.group(0)[:-1], content)
    
    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    src_dir = Path('src')
    
    # Convert TS to JS and rename
    converted = 0
    for file_path in src_dir.rglob('*.tsx'):
        # Rename first
        new_path = file_path.with_suffix('.jsx')
        file_path.rename(new_path)
        converted += 1
        
    for file_path in src_dir.rglob('*.ts'):
        if not file_path.name.endswith('.d.ts'):
            new_path = file_path.with_suffix('.js')
            file_path.rename(new_path)
            converted += 1
    
    # Now convert content
    modified = 0
    for file_path in src_dir.rglob('*.jsx'):
        if safe_convert(str(file_path)):
            modified += 1
            
    for file_path in src_dir.rglob('*.js'):
        if safe_convert(str(file_path)):
            modified += 1
    
    print(f"Renamed: {converted} files")
    print(f"Modified: {modified} files")

if __name__ == '__main__':
    main()
