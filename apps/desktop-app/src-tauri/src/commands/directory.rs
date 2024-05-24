use std::fs;

#[tauri::command]
pub fn is_directory(path: String) -> bool {
    match fs::metadata(path) {
        Ok(metadata) => metadata.is_dir(),
        Err(_) => false,
    }
}
