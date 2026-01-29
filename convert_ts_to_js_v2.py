#!/usr/bin/env python3
"""
TypeScript to JavaScript converter for React project - V2 with advanced pattern matching.
Removes TypeScript syntax while preserving JSX structure.
"""

import os
import re
import sys
from pathlib import Path
from typing import Tuple

class TypeScriptConverter:
    def __init__(self):
        self.stats = {
            'files_processed': 0,
            'files_modified': 0,
            'interfaces_removed': 0,
            'types_removed': 0,
            'type_annotations_removed': 0,
            'generics_removed': 0,
            'non_null_assertions_removed': 0,
            'type_casts_removed': 0,
            'optional_props_removed': 0,
            'imports_updated': 0,
        }
    
    def convert_file(self, filepath: str) -> Tuple[bool, str]:
        """Convert a single file from TypeScript to JavaScript."""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                original_content = f.read()
            
            content = original_content
            
            # 1. Remove type import statements: import { type Foo } -> import { Foo }
            content = self._remove_type_imports(content)
            
            # 2. Update import paths from .tsx to .jsx and .ts to .js
            content = self._update_import_paths(content)
            
            # 3. Remove interface declarations (must be before type removal)
            content = self._remove_interfaces(content)
            
            # 4. Remove type declarations
            content = self._remove_type_declarations(content)
            
            # 5. Remove generic type parameters from function calls and declarations
            content = self._remove_generics(content)
            
            # 6. Remove type annotations (: Type)
            content = self._remove_type_annotations(content)
            
            # 7. Remove "as" type casting
            content = self._remove_type_casts(content)
            
            # 8. Remove non-null assertions (!)
            content = self._remove_non_null_assertions(content)
            
            # 9. Remove optional property syntax (property?: -> property:)
            content = self._remove_optional_property_syntax(content)
            
            # Check if content changed
            if content == original_content:
                return False, "No changes"
            
            # Write back to file
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            
            return True, "Converted"
            
        except Exception as e:
            return False, f"Error: {str(e)}"
    
    def _remove_type_imports(self, content: str) -> str:
        """Remove 'type' keyword from import statements."""
        # Remove standalone type imports: import type { ... }
        content = re.sub(
            r'import\s+type\s+\{\s*([^}]+)\s*\}',
            r'import { \1 }',
            content,
            flags=re.MULTILINE
        )
        
        # Remove type keyword from mixed imports: import { type Foo, Bar }
        content = re.sub(
            r'(\bimport\s+\{[^}]*?)\btype\s+',
            r'\1',
            content,
            flags=re.MULTILINE
        )
        
        return content
    
    def _update_import_paths(self, content: str) -> str:
        """Update import paths from .tsx to .jsx and .ts to .js."""
        # Update .tsx to .jsx
        content = re.sub(
            r'(from\s+[\'"])([^\'"]*\.tsx)([\'"])',
            r'\1\2x\3',
            content
        )
        
        # Update .ts to .js (but not .tsx)
        content = re.sub(
            r'(from\s+[\'"])([^\'"]*(?<!x)\.ts)([\'"])',
            r'\1\2x\3',
            content
        )
        
        return content
    
    def _remove_interfaces(self, content: str) -> str:
        """Remove interface declarations (single and multi-line)."""
        lines = content.split('\n')
        new_lines = []
        i = 0
        count = 0
        
        while i < len(lines):
            line = lines[i]
            
            # Check if line starts an interface declaration
            if re.match(r'\s*(export\s+)?interface\s+', line):
                count += 1
                # Skip until we find the closing brace
                brace_count = line.count('{') - line.count('}')
                i += 1
                
                while i < len(lines) and brace_count > 0:
                    brace_count += lines[i].count('{') - lines[i].count('}')
                    i += 1
                
                continue
            
            new_lines.append(line)
            i += 1
        
        content = '\n'.join(new_lines)
        
        # Clean up extra blank lines
        content = re.sub(r'\n\n\n+', '\n\n', content)
        
        self.stats['interfaces_removed'] += count
        return content
    
    def _remove_type_declarations(self, content: str) -> str:
        """Remove type declarations (single and multi-line)."""
        lines = content.split('\n')
        new_lines = []
        i = 0
        count = 0
        
        while i < len(lines):
            line = lines[i]
            
            # Check if line starts a type declaration
            # Pattern: type Name<T> = ... or export type Name = ...
            if re.match(r'\s*(export\s+)?type\s+\w+', line):
                count += 1
                # Skip until we find the semicolon or closing brace at top level
                brace_count = line.count('{') - line.count('}')
                i += 1
                
                # If it's a simple assignment (ends with ;), we're done
                if re.search(r';\s*$', line):
                    continue
                
                # Otherwise, look for closing brace
                while i < len(lines):
                    brace_count += lines[i].count('{') - lines[i].count('}')
                    if brace_count < 0 or (brace_count == 0 and re.search(r'}\s*$', lines[i])):
                        i += 1
                        break
                    i += 1
                
                continue
            
            new_lines.append(line)
            i += 1
        
        content = '\n'.join(new_lines)
        
        # Clean up extra blank lines
        content = re.sub(r'\n\n\n+', '\n\n', content)
        
        self.stats['types_removed'] += count
        return content
    
    def _remove_generics(self, content: str) -> str:
        """Remove generic type parameters like <Type>, <string>, etc."""
        count = 0
        
        # Remove generics from React methods
        patterns_to_remove = [
            (r'React\.forwardRef\s*<[^>]+>', 'React.forwardRef'),
            (r'React\.createContext\s*<[^>]+>', 'React.createContext'),
            (r'React\.useState\s*<[^>]+>', 'React.useState'),
            (r'React\.useCallback\s*<[^>]+>', 'React.useCallback'),
            (r'React\.useReducer\s*<[^>]+>', 'React.useReducer'),
        ]
        
        for pattern, replacement in patterns_to_remove:
            original = content
            content = re.sub(pattern, replacement, content)
            count += len(re.findall(pattern, original))
        
        # Remove arrow function generics: const foo = <T,>(param)
        original = content
        content = re.sub(
            r'(=\s*)<([^>]+)>\s*(\()',
            r'\1\3',
            content
        )
        count += len(re.findall(r'=\s*<[^>]+>\s*\(', original))
        
        # Remove function declaration generics: function foo<T>
        original = content
        content = re.sub(
            r'(function\s+\w+)\s*<[^>]+>',
            r'\1',
            content
        )
        count += len(re.findall(r'function\s+\w+\s*<[^>]+>', original))
        
        # Remove const declaration generics: const foo = <T>(...) but not JSX
        # This needs careful handling to not break JSX
        lines = content.split('\n')
        for i, line in enumerate(lines):
            # Look for patterns like: const Name = <Type>
            original = line
            # Only if followed by parenthesis or arrow function
            line = re.sub(
                r'(const\s+\w+\s*=\s*)<([A-Z][^>]*)>(\s*[\({])',
                r'\1\3',
                line
            )
            count += len(re.findall(r'const\s+\w+\s*=\s*<[A-Z][^>]*>\s*[\({]', original))
            lines[i] = line
        
        content = '\n'.join(lines)
        
        # Remove remaining generics on identifiers where applicable
        # Pattern: identifier<Type> (but be careful with JSX)
        original = content
        content = re.sub(
            r'([a-zA-Z_]\w*)\s*<\s*([A-Z][a-zA-Z0-9_]*)\s*>(?!\w)',
            r'\1',
            content
        )
        count += len(re.findall(r'[a-zA-Z_]\w*\s*<\s*[A-Z][a-zA-Z0-9_]*\s*>(?!\w)', original))
        
        self.stats['generics_removed'] += count
        return content
    
    def _remove_type_annotations(self, content: str) -> str:
        """Remove type annotations like : string, : number, : React.FormEvent."""
        count = 0
        
        # Pattern 1: Function parameter annotations: (param: Type) or (param: Type = default)
        original = content
        content = re.sub(
            r'(\(|,\s*)(\w+)\s*:\s*(?:React\.\w+(?:<[^>]*>)?|[\w.]+(?:<[^>]*>)?|[\w\[\]|&]+)(?=\s*[,=\)])',
            r'\1\2',
            content
        )
        count += len(re.findall(r':\s*(?:React\.\w+(?:<[^>]*>)?|[\w.]+(?:<[^>]*>)?|[\w\[\]|&]+)\s*[,=\)]', original))
        
        # Pattern 2: Return type annotations: ): Type { or ): Type =>
        original = content
        content = re.sub(
            r'(\))\s*:\s*(?:React\.\w+(?:<[^>]*>)?|[\w.]+(?:<[^>]*>)?|void|null)(?=\s*[{=])',
            r'\1',
            content
        )
        count += len(re.findall(r'\)\s*:\s*(?:React\.\w+(?:<[^>]*>)?|[\w.]+(?:<[^>]*>)?|void|null)\s*[{=]', original))
        
        # Pattern 3: Variable declarations with types: const foo: Type = ...
        original = content
        content = re.sub(
            r'(const|let|var)\s+(\w+)\s*:\s*(?:React\.\w+(?:<[^>]*>)?|[\w.]+(?:<[^>]*>)?)',
            r'\1 \2',
            content
        )
        count += len(re.findall(r'(const|let|var)\s+\w+\s*:\s*(?:React\.\w+(?:<[^>]*>)?|[\w.]+(?:<[^>]*>)?)', original))
        
        self.stats['type_annotations_removed'] += count
        return content
    
    def _remove_type_casts(self, content: str) -> str:
        """Remove 'as' type casting: (value as Type) -> (value)."""
        count = 0
        
        # Pattern 1: value as Type inside parentheses
        original = content
        content = re.sub(
            r'\(\s*([^)]+?)\s+as\s+[\w.]+(?:<[^>]*>)?\s*\)',
            r'(\1)',
            content
        )
        count += len(re.findall(r'\s+as\s+[\w.]+(?:<[^>]*>)?', original))
        
        # Pattern 2: value as Type outside parentheses
        original = content
        content = re.sub(
            r'([a-zA-Z_]\w*)\s+as\s+[\w.]+(?:<[^>]*>)?(?=\s*[^a-zA-Z_]|$)',
            r'\1',
            content
        )
        count += len(re.findall(r'\s+as\s+[\w.]+(?:<[^>]*>)?', original))
        
        self.stats['type_casts_removed'] += count
        return content
    
    def _remove_non_null_assertions(self, content: str) -> str:
        """Remove non-null assertions: value! -> value."""
        count = 0
        
        # Match identifier followed by ! (non-null assertion)
        original = content
        content = re.sub(
            r'([a-zA-Z_]\w*)\!(?=\s*[,\)\]\}\.;:\s])',
            r'\1',
            content,
            flags=re.MULTILINE
        )
        
        count = len(re.findall(r'[a-zA-Z_]\w*!', original))
        self.stats['non_null_assertions_removed'] += count
        return content
    
    def _remove_optional_property_syntax(self, content: str) -> str:
        """Remove optional property syntax: property?: -> property:"""
        count = 0
        
        # Match property?: in function parameters or object definitions
        original = content
        content = re.sub(
            r'(\w+)\?\s*:',
            r'\1:',
            content
        )
        
        count = len(re.findall(r'\w+\?(?=\s*:)', original))
        self.stats['optional_props_removed'] += count
        return content
    
    def process_directory(self, root_dir: str) -> None:
        """Process all .js and .jsx files in the directory."""
        root_path = Path(root_dir)
        
        # Find all .js and .jsx files
        files = list(root_path.glob('**/*.jsx')) + list(root_path.glob('**/*.js'))
        
        print(f"\nFound {len(files)} files to process\n")
        
        for filepath in sorted(files):
            if 'node_modules' in str(filepath):
                continue
            
            self.stats['files_processed'] += 1
            modified, msg = self.convert_file(str(filepath))
            
            if modified:
                self.stats['files_modified'] += 1
                print(f"✓ {filepath.relative_to(root_path)}")
            else:
                print(f"  {filepath.relative_to(root_path)}")
    
    def print_summary(self) -> None:
        """Print conversion summary."""
        print("\n" + "="*70)
        print("CONVERSION SUMMARY")
        print("="*70)
        print(f"Files processed:              {self.stats['files_processed']}")
        print(f"Files modified:               {self.stats['files_modified']}")
        print(f"\nRemoved:")
        print(f"  Interfaces:                 {self.stats['interfaces_removed']}")
        print(f"  Type declarations:          {self.stats['types_removed']}")
        print(f"  Type annotations:           {self.stats['type_annotations_removed']}")
        print(f"  Generic parameters:         {self.stats['generics_removed']}")
        print(f"  Non-null assertions (!):    {self.stats['non_null_assertions_removed']}")
        print(f"  Type casts (as):            {self.stats['type_casts_removed']}")
        print(f"  Optional properties (?:):   {self.stats['optional_props_removed']}")
        print("="*70 + "\n")


if __name__ == '__main__':
    root_directory = '/Users/tusharsingh/Downloads/biz-master/src'
    
    converter = TypeScriptConverter()
    converter.process_directory(root_directory)
    converter.print_summary()
