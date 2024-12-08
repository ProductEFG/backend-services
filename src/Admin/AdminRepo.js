import Admin from "../../db/Schemas/AdminSchema.js";
class AdminRepo {
  constructor({ logger }) {
    this.logger = logger;
  }

  async addAdmin(data, correlationId) {
    try {
      const { password, ...dataWithoutPassword } = data;

      this.logger.info("Adding new admin", {
        correlationId,
        data: dataWithoutPassword,
      });

      const admin = new Admin(data);
      await admin.save();

      const { password: userPassword, ...userWithoutPassword } =
        admin.toObject();

      return admin;
    } catch (error) {
      throw error;
    }
  }

  async getAdmin(email, password, correlationId) {
    try {
      this.logger.info("Fetching user by email and password", {
        correlationId,
        email,
      });

      const admin = await Admin.findOne({
        email: email,
        password: password,
      });

      return admin;
    } catch (error) {
      throw error;
    }
  }

  async getAdminByEmail(email, correlationId) {
    try {
      this.logger.info("Fetching admin by email", {
        correlationId,
        email,
      });

      const admin = await Admin.findOne({ email: email });

      return admin;
    } catch (error) {
      throw error;
    }
  }

  async getAdminById(adminId, correlationId) {
    try {
      this.logger.info("Fetching admin by ID", {
        correlationId,
        userId,
      });

      const admin = await Admin.findById(adminId);

      return admin;
    } catch (error) {
      throw error;
    }
  }
}

export default AdminRepo;
