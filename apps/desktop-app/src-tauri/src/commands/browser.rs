use tauri::command;
use std::process::Command;
use std::env;

#[command]
pub fn open_browser(url: &str) {
    let mut open_command = match env::consts::OS {
        "windows" => {
            let mut cmd = Command::new("cmd");
            cmd.args(&["/C", "start", url]);
            cmd
        }
        "macos" => {
            let mut cmd = Command::new("open");
            cmd.arg(url);
            cmd
        }
        "linux" => {
            let mut cmd = Command::new("xdg-open");
            cmd.arg(url);
            cmd
        }
        _ => panic!("Unsupported operating system"),
    };
    open_command.spawn().expect("Failed to open browser");
}