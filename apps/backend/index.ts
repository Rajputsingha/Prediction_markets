import express from "express";
import cors from "cors";
import { authRouter } from "./src/routes/auth";
import { Orderrouter } from "./src/routes/order";
import { signinToken } from "./src/middleware/middleware";
import { balanceRouter } from "./src/routes/balance";
import { postionRouter } from "./src/routes/position";
import { historyRouter } from "./src/routes/history";
import { marketRouter } from "./src/routes/market";

const app = express();

app.use(express.json());
app.use(cors());

app.get('/api/test-token', (req, res) => {
  const token = signinToken('Bi1UgPMzgyr5VjLPS1gP1LK1fm9WZv23j4KHz2AWSTHD')
  res.json({ token })
})

app.use("/api", authRouter);
app.use("/api", Orderrouter);
app.use("/api",balanceRouter);
app.use("/api",postionRouter);
app.use("/api", historyRouter);
app.use("/api",marketRouter);
app.listen(8080, () => {
  console.log("Server is listening to the request")
})