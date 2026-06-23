use rust_decimal::Decimal;
use crate::types::{Order, OrderBook, OrderType, Trade};

impl OrderBook {
    pub fn match_order(&mut self, mut incoming: Order) -> Vec<Trade> {
        let mut trade = Vec::new();

        match incoming.order_type {
            OrderType::Buy => {
                let prices: Vec<Decimal> = self.asks.keys().cloned().collect();

                for price in prices {
                    if price > incoming.price {
                        break;
                    }
                    if incoming.filled_qty >= incoming.qty {
                        break;
                    }

                    let result: Option<&mut Vec<Order>> = self.asks.get_mut(&price);

                    match result {
                        Some(orders_at_price) => {
                            let mut i = 0;
                            while i < orders_at_price.len() {
                                if incoming.filled_qty >= incoming.qty {
                                    break;
                                }

                                let maker = &mut orders_at_price[i];
                                let remaining_incoming = incoming.qty - incoming.filled_qty;
                                let remaining_maker = maker.qty - maker.filled_qty;
                                let fill_qty = remaining_incoming.min(remaining_maker);

                                trade.push(Trade {
                                    maker_order_id: maker.id,
                                    taker_order_id: incoming.id,
                                    price,
                                    qty: fill_qty,
                                    timestamp: incoming.timestamp,
                                });

                                maker.filled_qty += fill_qty;
                                incoming.filled_qty += fill_qty;

                                match maker.filled_qty >= maker.qty {
                                    true => {
                                        orders_at_price.remove(i);
                                    }
                                    false => {
                                        i += 1;
                                    }
                                }
                            }

                            match orders_at_price.is_empty() {
                                true => {
                                    self.asks.remove(&price);
                                }
                                false => {}
                            }
                        }
                        None => {}
                    }
                }

                match incoming.filled_qty < incoming.qty {
                    true => {
                        self.bids.entry(incoming.price).or_insert_with(Vec::new).push(incoming);
                    }
                    false => {}
                }
            }

            OrderType::Sell => {
                let mut prices: Vec<Decimal> = self.bids.keys().cloned().collect();
                prices.reverse();

                for price in prices {
                    if price < incoming.price {
                        break;
                    }
                    if incoming.filled_qty >= incoming.qty {
                        break;
                    }

                    let result: Option<&mut Vec<Order>> = self.bids.get_mut(&price);

                    match result {
                        Some(orders_at_price) => {
                            let mut i = 0;
                            while i < orders_at_price.len() {
                                if incoming.filled_qty >= incoming.qty {
                                    break;
                                }

                                let maker = &mut orders_at_price[i];
                                let remaining_incoming = incoming.qty - incoming.filled_qty;
                                let remaining_maker = maker.qty - maker.filled_qty;
                                let fill_qty = remaining_incoming.min(remaining_maker);

                                trade.push(Trade {
                                    maker_order_id: maker.id,
                                    taker_order_id: incoming.id,
                                    price,
                                    qty: fill_qty,
                                    timestamp: incoming.timestamp,
                                });

                                maker.filled_qty += fill_qty;
                                incoming.filled_qty += fill_qty;

                                match maker.filled_qty >= maker.qty {
                                    true => {
                                        orders_at_price.remove(i);
                                    }
                                    false => {
                                        i += 1;
                                    }
                                }
                            }

                            match orders_at_price.is_empty() {
                                true => {
                                    self.bids.remove(&price);
                                }
                                false => {}
                            }
                        }
                        None => {}
                    }
                }

                match incoming.filled_qty < incoming.qty {
                    true => {
                        self.asks.entry(incoming.price).or_insert_with(Vec::new).push(incoming);
                    }
                    false => {}
                }
            }
        }

        trade
    }
}

#[cfg(test)]

mod tests {
     use super::*;
    use rust_decimal_macros::dec;
use uuid::Uuid;

    fn make_order(side:OrderType, qty:Decimal, price:Decimal )-> Order{
         Order { id:Uuid::new_v4 (),
             user_id:"test_user".to_string (),
              market_id: "m1".to_string(), 
              outcome_id:  "yes".to_string(),
               order_type: side, 
               qty,
                filled_qty: Decimal::ZERO, 
                price, 
                timestamp: 0
            
             }
    }
    #[test]
    fn test_full_fill(){
        let mut book= OrderBook::new();

        let sell = make_order(OrderType::Sell, dec!(10), dec!(0.50));
         book.match_order(sell);
        let buy=make_order(OrderType::Buy, dec!(10), dec!(0.50));
        let trades = book.match_order(buy);

        assert_eq!(trades.len(), 1);
        assert_eq!(trades[0].qty, dec!(10));
        assert_eq!(trades[0].price, dec!(0.50));

    }
}
