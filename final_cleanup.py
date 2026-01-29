#!/usr/bin/env python3
"""
Final cleanup for TypeScript to JavaScript conversion.
Fixes remaining pattern issues after generic removal.
"""

import re
from pathlib import Path

class FinalCleanup:
    def __init__(self):
        self.files_fixed = 0
    
    def cleanup_file(self, filepath):
        """Clean up remaining broken patterns."""
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Fix: React.forwardRef followed by ]( or >( with junk in between
        # Pattern: React.forwardRef\n>(
        content = re.sub(
            r'(React\.forwardRef)\s*\n\s*>(\s*\()',
            r'\1\2',
            content
        )
        
        # Pattern: React.forwardRef with junk then >(
        content = re.sub(
            r'(React\.forwardRef)[^\n]*\n\s*>(\s*\()',
            r'\1\2',
            content
        )
        
        # Remove dangling >( from JSX-like contexts
        # Pattern: >( should be ( in function declarations
        # Only when preceded by React.forwardRef on same line with removed generics
        lines = content.split('\n')
        for i, line in enumerate(lines):
            # If line starts with >( it's likely a remnant
            if line.strip().startswith('>('):
                lines[i] = line.replace('>(',  '(')
        
        content = '\n'.join(lines)
        
        # Clean up any dangling ], >
        content = re.sub(r'\]\s*>\s*\(', '(', content)
        
        # Fix any lines that have dangling React.ComponentPropsWithoutRef
        content = re.sub(
            r'React\.ComponentPropsWithoutRef[^\n]*\n',
            '',
            content
        )
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    
    def process_directory(self, root_dir):
        """Process all JSX files."""
        root_path = Path(root_dir)
        files = list(root_path.glob('**/*.jsx')) + list(root_path.glob('**/*.js'))
        
        print(f"\nCleaning up {len(files)} files...\n")
        
        for filepath in sorted(files):
            if 'node_modules' in str(filepath):
                continue
            
            if self.cleanup_file(str(filepath)):
                self.files_fixed += 1
                print(f"✓ Cleaned: {filepath.relative_to(root_path)}")
        
        print(f"\n{self.files_fixed} files were cleaned up")

if __name__ == '__main__':
    cleanup = FinalCleanup()
    cleanup.process_directory('/Users/tusharsingh/Downloads/biz-master/src')
