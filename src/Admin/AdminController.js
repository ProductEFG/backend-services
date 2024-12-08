import { v4 as uuidv4 } from "uuid";
class AdminController {
  constructor({ adminService, logger }) {
    this.adminService = adminService;
    this.logger = logger;
  }

  register = async (req, res) => {
    const { email } = req.body;
    const correlationId = req.headers["x-correlation-id"] || uuidv4();

    try {
      this.logger.info("Admin register - Request received", {
        correlationId,
        email,
      });
      const admin = await this.adminService.register(req, correlationId);

      this.logger.info("Admin register - Successfully registered a new user", {
        correlationId,
        email,
        userId: user._id,
      });
      res.status(201).json(admin);
    } catch (error) {
      this.logger.error("Admin register - Failed to register user", {
        correlationId,
        email,
        error: error.stack,
      });

      if (error.message === "this email is invalid") {
        return res.status(409).json({ error: "this email is invalid" });
      }
      res.status(500).json({ error: "an unexpected error occurred" });
    }
  };

  login = async (req, res) => {
    const { email } = req.body;
    const correlationId = req.headers["x-correlation-id"] || uuidv4();

    try {
      this.logger.info("Admin login - Request received", {
        correlationId,
        email,
      });
      const admin = await this.adminService.login(req, correlationId);

      this.logger.info("Admin login - Successfully logged in admin", {
        correlationId,
        email,
        adminId: admin._id,
      });
      res.status(200).json(admin);
    } catch (error) {
      this.logger.error("Admin login - Failed to login admin", {
        correlationId,
        email,
        error: error.stack,
      });

      if (error.message === "Invalid credentials") {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  };

  getAdminByEmail = async (req, res) => {
    const { email } = req.params;
    const correlationId = req.headers["x-correlation-id"] || uuidv4();

    try {
      this.logger.info("getAdminByEmail - Request received", {
        correlationId,
        username,
      });

      if (!email) {
        this.logger.error(
          "getAdminByEmail - email parameter is missing in the request",
          {
            correlationId,
          }
        );
        return res.status(400).json({ error: "email parameter is required" });
      }

      const admin = await this.adminService.getAdminByEmail(
        email,
        correlationId
      );

      if (!admin) {
        this.logger.error("getAdminByEmail - No admin found with this email", {
          correlationId,
          email,
        });
        return res.status(404).json({ error: "Admin not found" });
      }

      this.logger.info("getAdminByEmail - Admin found", {
        correlationId,
        email,
      });
      res.status(200).json(admin);
    } catch (error) {
      this.logger.error("getAdminByEmail - Server Error", {
        correlationId,
        username,
        error: error.message,
        stack: error.stack,
      });
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  };
}

export default AdminController;
