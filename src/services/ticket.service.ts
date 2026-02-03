import { pool } from "../config/database.js";

export interface CategoryRecord {
  id: number;
  name: string;
  cat_order: number;
  usage: number;
}

export class TicketService {
  static async getAllCategories(): Promise<CategoryRecord[]> {
    const [rows] = await pool.query("SELECT * FROM hesk_categories");
    return rows as CategoryRecord[];
  }

  static async getAllTickets() {
    const [rows]: any = await pool.query(
      "SELECT * FROM hesk_tickets ORDER BY id DESC",
    );
    return rows;
  }

static async getTicketByIdOrTrackId(identifier: string): Promise<any> {
        const [rows]: any = await pool.query(
            'SELECT ht.* FROM hesk_tickets AS ht WHERE ht.trackid = ? OR ht.id = ? LIMIT 1',
            [identifier, identifier]
        );
        
        return rows[0] || null;
    }
}
