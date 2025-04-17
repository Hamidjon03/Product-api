import { DataSource } from 'typeorm';
import { User } from '../../modules/auth/entities/user.entity';
import { Role } from '../../common/enums/role.enum';

export const createAdminUser = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);

  // Check if admin already exists
  const existingAdmin = await userRepository.findOne({
    where: { username: 'john_doe' },
  });

  if (!existingAdmin) {
    // Create new admin user
    const admin = userRepository.create({
      username: 'john_doe',
      password: 'password123',
      role: Role.ADMIN,
    });

    await userRepository.save(admin);
    console.log('Admin user created successfully');
  } else {
    console.log('Admin user already exists');
  }
};
