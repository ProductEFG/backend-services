class AdminService {
  constructor({ adminRepo, logger }) {
    this.adminRepo = adminRepo;
    this.logger = logger;
  }

  register = async (req, correlationId) => {
    const { email } = req.body;

    try {
      const existingAdmin = await this.adminRepo.getAdminByEmail(
        email,
        correlationId
      );
      if (existingAdmin) {
        throw new Error("this email is invalid");
      }

      const newAdmin = await this.adminRepo.addAdmin(req.body, correlationId);

      return newAdmin;
    } catch (error) {
      throw error;
    }
  };

  login = async (req, correlationId) => {
    const { email, password } = req.body;

    try {
      const admin = await this.adminRepo.getAdmin(
        email,
        password,
        correlationId
      );

      if (admin) {
        return admin;
      }

      throw new Error("Invalid Credentials");
    } catch (error) {
      throw error;
    }
  };

  getAdminByEmail = async (email, correlationId) => {
    try {
      const admin = await this.adminRepo.getAdminByEmail(email, correlationId);

      if (admin) {
        return admin;
      }

      return null;
    } catch (error) {
      throw error;
    }
  };
}

export default AdminService;
