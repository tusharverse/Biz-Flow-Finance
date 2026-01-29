#!/usr/bin/env python3
"""
Advanced TypeScript to JavaScript converter - Handles broken patterns from previous run.
"""

import os
import re
from pathlib import Path

class BrokenPatternFixer:
    def __init__(self):
        self.files_fixed = 0
    
    def fix_file(self, filepath):
        """Fix broken patterns in a file."""
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Fix broken React.forwardRef declarations
        # Pattern: React.forwardRef, ... should be React.forwardRef
        content = re.sub(
            r'React\.forwardRef\s*,\s*[\w.]+(?:<[^>]*>)?\s*,\s*[\w.]+(?:<[^>]*>)?\s*\]\(\(',
            'React.forwardRef((',
            content,
            flags=re.MULTILINE | re.DOTALL
        )
        
        # Fix: React.forwardRef, React.ComponentPropsWithoutRef](
        content = re.sub(
            r'React\.forwardRef\s*,\s*React\.ComponentPropsWithoutRef\s*\]\(',
            'React.forwardRef((',
            content
        )
        
        # Fix: React.forwardRef, ... ]((...) patterns (multiline)
        # This is trickier - look for forwardRef followed by comma and stuff
        lines = content.split('\n')
        i = 0
        while i < len(lines):
            line = lines[i]
            
            # Check for React.forwardRef with trailing comma
            if 'React.forwardRef' in line and line.strip().endswith(','):
                # Collect lines until we find the pattern ending
                start_idx = i
                collected_lines = [line]
                i += 1
                paren_count = 0
                bracket_count = 0
                
                while i < len(lines):
                    curr_line = lines[i]
                    collected_lines.append(curr_line)
                    
                    # Track brackets
                    bracket_count += curr_line.count('[') - curr_line.count(']')
                    paren_count += curr_line.count('(') - curr_line.count(')')
                    
                    # Look for the pattern: ]( to mark the end of type declarations
                    if '](' in curr_line:
                        # Found it - now we need to fix this
                        # Replace React.forwardRef, ... ]( with React.forwardRef((
                        collected = '\n'.join(collected_lines)
                        # Extract the function body part (after ](
                        match = re.search(r'\]\(\s*(\()', collected)
                        if match:
                            # Find where the function really starts
                            # We want: React.forwardRef(
                            fixed = re.sub(
                                r'React\.forwardRef\s*,[\s\S]*?\]\(',
                                'React.forwardRef(',
                                collected
                            )
                            # Replace in our lines array
                            new_lines = fixed.split('\n')
                            lines[start_idx:i+1] = new_lines
                            i = start_idx + len(new_lines)
                        break
                    
                    i += 1
                continue
            
            i += 1
        
        content = '\n'.join(lines)
        
        # Clean up any remaining broken type patterns
        # Remove any remaining dangling React.ComponentPropsWithoutRef or similar
        content = re.sub(
            r',\s*React\.ComponentPropsWithoutRef[^\n]*\n',
            '\n',
            content
        )
        
        # Remove dangling type references
        content = re.sub(
            r',\s*[\w.]+\s*\]\(',
            '(',
            content
        )
        
        # Fix incomplete function calls from broken generics
        # Pattern: function_name, Type >(...) should be function_name(...)
        content = re.sub(
            r'(\w+)\s*,\s*[\w.]+\s*>\s*\(\(',
            r'\1((',
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
        
        print(f"\nFixing {len(files)} files...\n")
        
        for filepath in sorted(files):
            if 'node_modules' in str(filepath):
                continue
            
            if self.fix_file(str(filepath)):
                self.files_fixed += 1
                print(f"✓ Fixed: {filepath.relative_to(root_path)}")
        
        print(f"\n{self.files_fixed} files were fixed")

if __name__ == '__main__':
    fixer = BrokenPatternFixer()
    fixer.process_directory('/Users/tusharsingh/Downloads/biz-master/src')
