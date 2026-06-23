use serde::{Deserialize, Serialize};
use rust_decimal::Decimal;
use uuid::Uuid;
use std::collections::BTreeMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Order {
    pub id: Uuid,
    pub user_id: String,
    pub market_id: String,
    pub outcome_id: String,
    pub order_type: OrderType,
    pub qty: Decimal,
    pub filled_qty: Decimal,
    pub price: Decimal,
    pub timestamp: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum OrderType {
	Buy,
	Sell,
}
#[derive(Debug, Clone, Serialize, Deserialize)]

pub struct Trade{
    pub maker_order_id:Uuid,
    pub taker_order_id:Uuid,
    pub price:Decimal,
    pub qty:Decimal,
    pub timestamp:i64
}

#[derive(Debug,Clone)]
pub struct OrderBook {
     pub bids: BTreeMap<Decimal, Vec<Order>>,  // buy orders
    pub asks: BTreeMap<Decimal, Vec<Order>>,  // Sell orders

}

impl OrderBook {
    pub fn new ()->Self{
         OrderBook {
            bids: BTreeMap::new(),
            asks: BTreeMap::new(),
        }


    }
}