import os
import re
from pathlib import Path

def sync_changes_to_src(changes_file: str, base_dir: str) -> None:
    print("Starting sync process...")
    
    with open(changes_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if not content.strip():
        print("❌ Error: changes.md is empty!")
        print("\nPlease add file changes in this format:")
        print("\n```markdown")
        print("--- START OF MODIFIED FILE path/to/file.ts ---")
        print("```")
        print("```typescript")
        print("// Your code content here")
        print("```")
        print("```markdown")
        print("--- END OF MODIFIED FILE path/to/file.ts ---")
        print("```")
        return
    
    # Simplified pattern to be more lenient
    file_pattern = re.compile(
        r'(?:```markdown\s*)?'  # Optional markdown block start
        r'---\s*START OF MODIFIED FILE\s+([^\s]+?)\s*---\s*'  # File path capture
        r'(?:```\s*)?'  # Optional block end
        r'```(?:\w+)?\s*'  # Code block start with optional language
        r'(?:\/\/[^\n]*\n)?'  # Optional filepath comment
        r'(.*?)'  # Content capture (non-greedy)
        r'```\s*'  # Code block end
        r'(?:---\s*END[^\n]*\s*)?',  # Optional end marker
        re.DOTALL
    )
    
    matches = list(file_pattern.finditer(content))
    processed_count = 0
    error_count = 0
    
    if not matches:
        # Debug: Print first part of content
        print("\nFirst 200 chars of changes.md:")
        print(content[:200].replace('\n', '\\n'))
        print("\nNo file blocks found. Expected format:")
        print("```markdown")
        print("--- START OF MODIFIED FILE src/example/file.ts ---")
        print("```")
        print("```typescript")
        print("// code content")
        print("```")
        print("```markdown")
        print("--- END OF MODIFIED FILE src/example/file.ts ---")
        print("```")
        return

    for match in matches:
        relative_path = match.group(1).strip()
        file_content = match.group(2)
        
        try:
            # Allow files in any directory under base_dir
            full_path = os.path.normpath(os.path.join(base_dir, relative_path))
            
            # Security check: ensure the path is inside base_dir
            if not full_path.startswith(str(base_dir)):
                print(f"⚠️  Warning: Skipping file outside project directory: {relative_path}")
                continue
                
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            
            cleaned_content = clean_content(file_content)
            if not cleaned_content.strip():
                print(f"⚠️  Warning: Empty content for {relative_path}")
                continue
                
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(cleaned_content)
            
            print(f"✅ Synced: {relative_path}")
            processed_count += 1
            
        except Exception as e:
            print(f"❌ Error syncing {relative_path}: {str(e)}")
            error_count += 1
    
    # Print detailed summary
    print(f"\nSync completed!")
    if processed_count > 0:
        print(f"✅ Successfully processed: {processed_count} files")
    if error_count > 0:
        print(f"❌ Errors: {error_count}")
        
    if processed_count == 0:
        print("\nℹ️  No valid file blocks found in changes.md")
        print("\nExpected format:")
        print("--- START OF MODIFIED FILE path/to/file.ts ---")  # Updated example
        print("```typescript")
        print("// Your code here")
        print("```")
        print("--- END OF MODIFIED FILE path/to/file.ts ---")  # Updated example
        
        # Print first 100 chars of content for debugging
        print("\nFirst 100 chars of changes.md:")
        print(content[:100].replace('\n', '\\n'))

def clean_content(content: str) -> str:
    """Cleans the content by removing markdown artifacts and normalizing line endings"""
    # Remove any trailing backticks and surrounding whitespace
    content = re.sub(r'```\s*$', '', content.strip())
    
    # Remove any filepath comment at the start
    content = re.sub(r'^\/\/\s*filepath:[^\n]*\n', '', content)
    
    # Normalize line endings
    content = content.replace('\r\n', '\n')
    
    # Remove trailing whitespace from each line while preserving empty lines
    content = '\n'.join(line.rstrip() for line in content.splitlines())
    
    # Ensure single newline at end of file
    content = content.rstrip('\n') + '\n'
    
    return content

def main():
    # Get the script's directory
    script_dir = Path(__file__).parent
    base_dir = script_dir.parent
    changes_file = script_dir / 'changes.md'
    
    if not changes_file.exists():
        print(f"❌ Error: Changes file not found at {changes_file}")
        return
    
    print(f"Base directory: {base_dir}")
    print(f"Changes file: {changes_file}\n")
    
    # Confirm before proceeding
    response = input("⚠️  This will modify source files. Continue? [y/N]: ").strip().lower()
    if response != 'y':
        print("Operation cancelled.")
        return
    
    sync_changes_to_src(str(changes_file), str(base_dir))

if __name__ == "__main__":
    main()