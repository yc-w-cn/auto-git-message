use std::fs;

#[tauri::command]
pub fn is_directory(path: String) -> bool {
    match fs::metadata(path) {
        Ok(metadata) => metadata.is_dir(),
        Err(_) => false,
    }
}

#[tauri::command]
pub fn is_file(path: String) -> bool {
  fs::metadata(path)
    .map(|metadata| metadata.is_file())
    .unwrap_or(false)
}