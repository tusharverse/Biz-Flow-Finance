#!/usr/bin/env python3
"""
TypeScript to JavaScript converter for React project.
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
            
            # 3. Remove interface declarations
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
        # Match: import { type Foo, Bar } or import type { Foo }
        # Replace with: import { Foo, Bar } or import { Foo }
        
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
        
        self.stats['imports_updated'] += content.count('import')
        return content
    
    def _update_import_paths(self, content: str) -> str:
        """Update import paths from .tsx to .jsx and .ts to .js."""
        original_len = len(re.findall(r'from\s+[\'"]([^\'"]*\.tsx?)[\'"]', content))
        
        # Update .tsx to .jsx
        content = re.sub(
            r'(from\s+[\'"])([^\'"]*\.tsx)([\'"])',
            r'\1\2x\3',
            content
        )
        
        # Update .ts to .js (but not node_modules)
        content = re.sub(
            r'(from\s+[\'"])([^\'"]*(?<!tsx)\.ts)([\'"])',
            r'\1\2x\3',
            content
        )
        
        self.stats['imports_updated'] += original_len
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
            if re.match(r'\s*(export\s+)?interface\s+\w+', line):
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
        # This is complex because type declarations can span multiple lines
        # We need to handle nested generics and braces
        
        original_content = content
        count = 0
        
        # Pattern 1: Single-line type declarations
        # type Foo = string; or type Foo = Bar | Baz;
        type_pattern_simple = r'(export\s+)?type\s+\w+\s*(?:<[^>]*>)?\s*=\s*[^{;]+;'
        matches = re.findall(type_pattern_simple, content, re.MULTILINE)
        count += len(matches)
        content = re.sub(type_pattern_simple, '', content, flags=re.MULTILINE)
        
        # Pattern 2: Multi-line type declarations with object literals
        # type Foo = { ... }
        # We need to find matching braces
        lines = content.split('\n')
        new_lines = []
        i = 0
        in_type_decl = False
        brace_count = 0
        
        while i < len(lines):
            line = lines[i]
            
            # Check if line starts a type declaration
            if re.match(r'\s*(export\s+)?type\s+\w+\s*(?:<[^>]*>)?\s*=\s*\{', line):
                in_type_decl = True
                brace_count = line.count('{') - line.count('}')
                count += 1
                i += 1
                continue
            
            if in_type_decl:
                brace_count += line.count('{') - line.count('}')
                if brace_count <= 0:
                    in_type_decl = False
                i += 1
                continue
            
            new_lines.append(line)
            i += 1
        
        content = '\n'.join(new_lines)
        
        # Clean up extra blank lines created by removal
        content = re.sub(r'\n\n\n+', '\n\n', content)
        
        self.stats['types_removed'] += count
        return content
    
    def _remove_generics(self, content: str) -> str:
        """Remove generic type parameters like <Type>, <string>, etc."""
        count = 0
        
        # Remove generics from React.forwardRef<Type1, Type2>
        original = content
        content = re.sub(
            r'React\.forwardRef\s*<[^>]+>',
            'React.forwardRef',
            content
        )
        count += len(re.findall(r'React\.forwardRef\s*<[^>]+>', original))
        
        # Remove generics from React.createContext<Type>
        original = content
        content = re.sub(
            r'React\.createContext\s*<[^>]+>',
            'React.createContext',
            content
        )
        count += len(re.findall(r'React\.createContext\s*<[^>]+>', original))
        
        # Remove generics from function declarations: function foo<T>
        original = content
        content = re.sub(
            r'(function\s+\w+)\s*<[^>]+>',
            r'\1',
            content
        )
        count += len(re.findall(r'function\s+\w+\s*<[^>]+>', original))
        
        # Remove generics from const declarations: const foo = <Type>(...) or const foo: Type<T> = ...
        original = content
        content = re.sub(
            r'(const\s+\w+\s*(?::\s*\w+)?)\s*<[^>]+>\s*',
            r'\1 ',
            content
        )
        count += len(re.findall(r'const\s+\w+\s*(?::\s*\w+)?\s*<[^>]+>', original))
        
        # Remove arrow function generics: const foo = <T,>(param: T)
        original = content
        content = re.sub(
            r'(=\s*)<([^>]+)>(\s*\()',
            r'\1\3',
            content
        )
        count += len(re.findall(r'=\s*<[^>]+>\s*\(', original))
        
        # Remove remaining generic brackets on other identifiers
        # But be careful not to break JSX comparisons
        lines = content.split('\n')
        for i, line in enumerate(lines):
            # Skip JSX lines (lines with < likely to be JSX)
            if '<' in line and '>' in line:
                # Only remove generics that look like type parameters, not JSX
                # Look for patterns like: identifier<Type>
                original = line
                # Match: word<stuff> where word is not a tag name
                line = re.sub(
                    r'([a-zA-Z_]\w+)\s*<\s*([A-Z][^>]*)>',
                    r'\1',
                    line
                )
                count += len(re.findall(r'[a-zA-Z_]\w+\s*<\s*[A-Z][^>]*>', original))
                lines[i] = line
        
        content = '\n'.join(lines)
        self.stats['generics_removed'] += count
        return content
    
    def _remove_type_annotations(self, content: str) -> str:
        """Remove type annotations like : string, : number, : React.FormEvent."""
        count = 0
        
        # Remove function parameter type annotations: (param: Type) -> (param)
        # This is complex because we need to handle nested types and generics
        
        # Pattern 1: Simple type annotations in function params
        original = content
        content = re.sub(
            r'(\(|,\s*)(\w+)\s*:\s*(?:React\.\w+(?:<[^>]*>)?|[\w.]+(?:<[^>]*>)?)',
            r'\1\2',
            content
        )
        count += len(re.findall(r':\s*(?:React\.\w+(?:<[^>]*>)?|[\w.]+(?:<[^>]*>)?)', original))
        
        # Pattern 2: Type annotations for variables/properties
        original = content
        content = re.sub(
            r'(\w+)\s*:\s*(?:React\.\w+(?:<[^>]*>)?|[\w.]+(?:<[^>]*>)?)\s*=',
            r'\1 =',
            content
        )
        count += len(re.findall(r'\w+\s*:\s*(?:React\.\w+(?:<[^>]*>)?|[\w.]+(?:<[^>]*>)?)\s*=', original))
        
        # Pattern 3: Return type annotations: function foo(): Type
        original = content
        content = re.sub(
            r'(\))\s*:\s*(?:React\.\w+(?:<[^>]*>)?|[\w.]+(?:<[^>]*>)?|void|null)\s*(?=\{|=>)',
            r'\1',
            content
        )
        count += len(re.findall(r'\)\s*:\s*(?:React\.\w+(?:<[^>]*>)?|[\w.]+(?:<[^>]*>)?|void|null)\s*(?=\{|=>)', original))
        
        # Pattern 4: Property type annotations in objects (but not JSX)
        original = content
        content = re.sub(
            r'(\w+)\s*:\s*[\w.]+(?:<[^>]*>)?,',
            r'\1,',
            content
        )
        count += len(re.findall(r'\w+\s*:\s*[\w.]+(?:<[^>]*>)?,', original))
        
        self.stats['type_annotations_removed'] += count
        return content
    
    def _remove_type_casts(self, content: str) -> str:
        """Remove 'as' type casting: (value as Type) -> (value)."""
        count = 0
        
        # Pattern: value as Type or (value as Type)
        original = content
        content = re.sub(
            r'\(\s*([^)]+?)\s+as\s+[\w.]+(?:<[^>]*>)?\s*\)',
            r'(\1)',
            content
        )
        count += len(re.findall(r'\s+as\s+[\w.]+(?:<[^>]*>)?', original))
        
        # Also match outside parentheses but be careful
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
        # But be careful not to match !important or != or !== or false !
        original = content
        content = re.sub(
            r'([a-zA-Z_]\w*)\!(?=\s*[,\)\]\}\.;:]|\s*$|\s+)',
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
        
        # Match property?: but preserve : for regular properties
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
        print(f"  Import paths updated:       {self.stats['imports_updated']}")
        print("="*70 + "\n")


if __name__ == '__main__':
    root_directory = '/Users/tusharsingh/Downloads/biz-master/src'
    
    converter = TypeScriptConverter()
    converter.process_directory(root_directory)
    converter.print_summary()
