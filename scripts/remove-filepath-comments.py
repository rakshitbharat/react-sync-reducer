import os
import re
from pathlib import Path

def get_all_files(directory):
    """Recursively get all files in directory."""
    # Only process these file extensions
    valid_extensions = {'.ts', '.tsx', '.js', '.jsx', '.md', '.json'}
    
    for root, _, files in os.walk(directory):
        # Skip node_modules and dist directories
        if 'node_modules' in root or 'dist' in root:
            continue
        
        for file in files:
            if Path(file).suffix in valid_extensions:
                yield os.path.join(root, file)

def remove_filepath_comments(file_path, project_dir):
    """Remove filepath comments from a single file."""
    try:
        # Read file content
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Remove both comment formats for various file types:
        # // filepath: path/to/file
        # <!-- filepath: path/to/file -->
        # Match full paths or relative paths
        updated_content = re.sub(
            r'(?:\/\/\s*filepath:.*?\n|<!--\s*filepath:.*?-->)',
            '',
            content
        )
        
        # Only write if changes were made
        if content != updated_content:
            try:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(updated_content)
                rel_path = os.path.relpath(file_path, project_dir)
                print(f"✓ Removed filepath comment from: {rel_path}")
            except IOError as e:
                print(f"✗ Error writing to {os.path.relpath(file_path, project_dir)}: {str(e)}")
            
    except UnicodeDecodeError:
        print(f"✗ Skipping binary file: {os.path.relpath(file_path, project_dir)}")
    except Exception as e:
        print(f"✗ Error processing {os.path.relpath(file_path, project_dir)}: {str(e)}")

if __name__ == "__main__":
    # Get the project root directory path
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.dirname(script_dir)
    
    print(f"Starting to remove filepath comments from: {project_dir}\n")
    
    try:
        files_processed = 0
        for file_path in get_all_files(project_dir):
            remove_filepath_comments(file_path, project_dir)
            files_processed += 1
        
        print(f"\nDone! Processed {files_processed} files.")
    except Exception as e:
        print(f"\nScript failed: {str(e)}")
        exit(1)
