// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod utils {
    pub mod environment;
}

mod commands {
    pub mod browser;
}

use std::env;
use utils::environment::AppEnvironment;
use commands::browser::open_browser;

fn main() {
    // Loads the dotenv file
    let dotenv_path = dotenvy::dotenv().ok();

    // Loads the environment variable. It doesn't matter how how it was set.
    let app_env = dotenvy::var("APP_ENV")
        .expect("APP_ENV not found")
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
    let sentry_dsn: String = dotenvy::var("SENTRY_DSN")
        .expect("SENTRY_DSN not found")
        .parse()
        .expect("Failed to parse SENTRY_DSN");

    // Initialize Sentry
    let _guard = sentry::init((
        sentry_dsn,
        sentry::ClientOptions {
            release: sentry::release_name!(),
            ..Default::default()
        },
    ));

    // Run tauri
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![open_browser])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
