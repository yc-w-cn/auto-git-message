use std::str::FromStr;
use std::fmt;

pub enum AppEnvironment {
    Development,
    Production,
}

impl FromStr for AppEnvironment {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "development" => Ok(AppEnvironment::Development),
            "production" => Ok(AppEnvironment::Production),
            _ => Err(format!("Unknown app environment: {}", s)),
        }
    }
}

impl fmt::Display for AppEnvironment {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            AppEnvironment::Development => write!(f, "development"),
            AppEnvironment::Production => write!(f, "production"),
        }
    }
}
