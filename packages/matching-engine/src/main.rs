use actix_web::{web, App, HttpServer, HttpResponse, Responder};
pub  mod  types;
pub mod engine;
pub mod state;

use types::Order;
use state::AppState;
async fn match_handler(
   data: web::Data<AppState>,
    order: web::Json<Order>,
) -> impl Responder {
  let mut  books=data.books.lock().unwrap();
    let book = books.entry(order.outcome_id.clone()).or_insert_with(types::OrderBook::new);

    let trades = book.match_order(order.into_inner());

    HttpResponse::Ok().json(trades)

}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let app_state = web::Data::new(AppState::new());

    println!("Matching engine running on port 8081");

    HttpServer::new(move || {
        App::new()
            .app_data(app_state.clone())
            .route("/match", web::post().to(match_handler))
    })
    .bind("127.0.0.1:8081")?
    .run()
    .await
}

