import { Request, Response } from "express";
import { DashboardService } from "../services/DashboardService";

export class DashboardController {
  private dashboardService = new DashboardService();

  async show(_request: Request, response: Response) {
    try {
      const dashboard = await this.dashboardService.getDashboard();

      return response.status(200).json(dashboard);
    } catch {
      return response.status(500).json({
        message: "Erro ao carregar dashboard.",
      });
    }
  }
}