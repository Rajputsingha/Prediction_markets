use std::collections::HashMap;
use std::sync::Mutex;
use crate::types::OrderBook;

pub struct AppState {
    pub books: Mutex<HashMap<String, OrderBook>>,
}

impl AppState {
    pub fn new() -> Self {
        AppState {
            books: Mutex::new(HashMap::new()),
        }
    }
}