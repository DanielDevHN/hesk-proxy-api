import "dotenv/config";
import express from "express";
import multer from "multer";
import path from "path";
import fs, { readFileSync } from "fs";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import { TicketController } from "./controllers/ticket.controller.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const PHP_BASE_URL = process.env.PHP_BASE_URL;

app.use(express.json());

const swaggerRaw = readFileSync(
  path.resolve(__dirname, "./docs/swagger.json"),
  "utf8",
);
const swaggerDocument = JSON.parse(swaggerRaw);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const uploadDir = path.join(process.cwd(), "uploads");

const ensureUploadDir = () => {
  if (!fs.existsSync(uploadDir)) {
    console.log("📂 Uploads folder not found. Creating...");
    fs.mkdirSync(uploadDir, { recursive: true });
  }
};

ensureUploadDir();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureUploadDir();
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`,
    );
  },
});
const upload = multer({ storage });

app.get("/api/categories", TicketController.getCategories);

app.get("/api/tickets", TicketController.getAllTickets);
app.get("/api/ticket/:id", TicketController.getTicketById);

app.post(
  "/api/proxy/upload",
  upload.single("attachment"),
  TicketController.uploadAttachment,
);
app.post("/api/proxy/submit", TicketController.submitTicket);

app.listen(PORT, () => {
  console.log(`\n🚀 Server ready at http://localhost:${PORT}`);
  console.log(`📖 Swagger Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🔗 Proxying to PHP backend at: ${PHP_BASE_URL}\n`);
  console.log("👀 Watch mode active with tsx...\n");
});
