use reqwest::blocking::Client;
use reqwest::Proxy;
use std::collections::HashMap;
use tauri::command;

#[command]
pub fn proxy_request(
    method: &str,
    url: &str,
    headers: HashMap<String, String>,
    body: Option<String>,
    proxy_url: Option<String>,
) -> Result<String, String> {
    let client = if let Some(proxy_url) = proxy_url {
        let proxy = Proxy::http(proxy_url).map_err(|e| e.to_string())?;
        Client::builder()
            .proxy(proxy)
            .build()
            .map_err(|e| e.to_string())?
    } else {
        Client::new()
    };

    let mut req = client.request(method.parse().unwrap(), url);

    for (key, value) in headers {
        req = req.header(&key, &value);
    }

    if let Some(body_content) = body {
        req = req.body(body_content);
    }

    let res = req.send().map_err(|e| e.to_string())?;
    let text = res.text().map_err(|e| e.to_string())?;

    Ok(text)
}
