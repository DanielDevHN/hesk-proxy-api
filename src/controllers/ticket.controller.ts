import type { Request, Response } from "express";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import { TicketService } from "../services/ticket.service.js";

const fileTracker: Record<string, string> = {};
const PHP_BASE_URL = process.env.PHP_BASE_URL || "";

export class TicketController {
  static async getCategories(_req: Request, res: Response): Promise<any> {
    try {
      const categories = await TicketService.getAllCategories();
      return res.json({ success: true, data: categories });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: "Error al obtener categorías de la BD",
      });
    }
  }

  static async getAllTickets(_req: Request, res: Response): Promise<any> {
    try {
      const tickets = await TicketService.getAllTickets();
      return res.json({ success: true, data: tickets });
    } catch (error: any) {
      return res
        .status(500)
        .json({ success: false, error: "Error al obtener tickets de la BD" });
    }
  }

  static async getTicketById(req: Request, res: Response): Promise<any> {
    try {
      const id = req.params.id;

      if (typeof id !== "string") {
        return res.status(400).json({
          success: false,
          error: "El identificador del ticket debe ser un texto válido.",
        });
      }

      const ticket = await TicketService.getTicketByIdOrTrackId(id);

      if (!ticket) {
        return res
          .status(404)
          .json({ success: false, message: "Ticket no encontrado" });
      }

      return res.json({ success: true, data: ticket });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  static async uploadAttachment(req: Request, res: Response): Promise<any> {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    try {
      const form = new FormData();
      form.append("attachment", fs.createReadStream(req.file.path), {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      const response = await axios.post(
        `${PHP_BASE_URL}/upload_attachment.php`,
        form,
        {
          headers: form.getHeaders(),
        },
      );

      const serverKey = response.data.file_key;
      if (serverKey) {
        fileTracker[serverKey.toString().trim()] = req.file.path;
      }

      return res.json(response.data);
    } catch (error: any) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(500).json({ error: error.message });
    }
  }

  static async submitTicket(req: Request, res: Response): Promise<any> {
    try {
      const form = new FormData();

      const orderedFields = [
        "name",
        "email",
        "priority",
        "subject",
        "message",
        "category",
        "hx",
        "hy",
      ];

      orderedFields.forEach((field) => {
        const value =
          req.body[field] !== undefined ? req.body[field].toString() : "";
        form.append(field, value);
      });

      const rawKey = req.body.file_key;
      if (rawKey) {
        const normalizedKey = rawKey.toString().trim();
        form.append("attachments[]", normalizedKey);
      }

      const response = await axios.post(
        `${process.env.PHP_BASE_URL}/submit_ticket.php?submit=1`,
        form,
        {
          headers: {
            ...form.getHeaders(),
            Cookie: `hesk_myemail=${encodeURIComponent(req.body.email || "")}`,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          },
        },
      );

      if (rawKey) {
        const normalizedKey = rawKey.toString().trim();
        const filePath = fileTracker[normalizedKey];

        if (filePath && fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          delete fileTracker[normalizedKey];
          console.log(
            `✅ Archivo temporal ${normalizedKey} eliminado exitosamente.`,
          );
        }
      }

      return res.json(response.data);
    } catch (error: any) {
      const status = error.response?.status || 500;
      const errorData = error.response?.data || error.message;

      console.error(`❌ Error en Hesk Submit (${status}):`, errorData);

      return res.status(status).json({
        success: false,
        error: "Error al procesar el ticket en Hesk",
        details: errorData,
      });
    }
  }
}
