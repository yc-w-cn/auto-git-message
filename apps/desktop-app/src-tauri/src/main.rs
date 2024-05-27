// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod utils {
    pub mod environment;
}

mod commands {
    pub mod browser;
    pub mod filesystem;
    pub mod request;
}

use commands::browser::open_browser;
use commands::filesystem::is_directory;
use commands::filesystem::is_file;
use commands::request::proxy_request;
use std::env;
use utils::environment::AppEnvironment;

fn main() {
    // Loads the dotenv file
    let dotenv_path = dotenvy::dotenv().ok();

    // Loads the environment variable. It doesn't matter how how it was set.
    let app_env = dotenvy::var("APP_ENV")
        .unwrap_or_else(|_| "production".to_string())
        .parse()
        .expect("Failed to parse APP_ENV");

    match (&app_env, &dotenv_path) {
        (AppEnvironment::Development, Some(path)) => {
            println!("Loaded dotenv file: {}", path.as_path().display())
        }
        (AppEnvironment::Development, None) => panic!("No .env file found"),
        (AppEnvironment::Production, Some(_)) => panic!(".env file found in production"),
        (AppEnvironment::Production, None) => (),
    }

    // Loads Sentry DSN from environment file.
    let sentry_dsn = env::var("SENTRY_DSN").ok();

    if let Some(dsn) = sentry_dsn {
        // If SENTRY_DSN is found, initialize Sentry
        let _guard = sentry::init((
            dsn,
            sentry::ClientOptions {
                release: sentry::release_name!(),
                ..Default::default()
            },
        ));
        println!("Sentry initialized.");
    } else {
        println!("SENTRY_DSN not found. Sentry not initialized.");
    }

    // Run tauri
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            open_browser,
            is_directory,
            is_file,
            proxy_request
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
