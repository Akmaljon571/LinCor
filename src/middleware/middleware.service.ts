import { HttpException, HttpStatus } from '@nestjs/common';
import { UserEntity } from 'src/entities/user.entity';
import jwt from 'src/utils/jwt';

export class TokenMiddleware {
  async verifyAdmin(headers: any) {
    if (!headers.admin_token) {
      throw new HttpException('Bad Request in Token', HttpStatus.BAD_REQUEST);
    }
    const idAndEmail = jwt.verify(headers.admin_token);

    if (!idAndEmail) {
      throw new HttpException('Invalid Token', HttpStatus.BAD_REQUEST);
    }
    const admin = await UserEntity.findOneBy({
      user_id: idAndEmail?.id,
      email: idAndEmail?.email,
    });

    if (!admin?.email || !admin?.active) {
      throw new HttpException('Invalid Token', HttpStatus.BAD_REQUEST);
    }
    if (admin?.email !== 'ahmadjonovakmal079@gmail.com') {
      throw new HttpException('Siz Admin emasiz', HttpStatus.BAD_REQUEST);
    }
    return admin.user_id;
  }

  async verifyUser(headers: any) {
    if (!headers.user_token) {
      throw new HttpException('Bad Request in Token', HttpStatus.BAD_REQUEST);
    }
    const idAndEmail = jwt.verify(headers.user_token);
    if (!idAndEmail) {
      throw new HttpException('Bad Request in Token', HttpStatus.BAD_REQUEST);
    }
    const user = await UserEntity.findOneBy({
      user_id: idAndEmail?.id,
      email: idAndEmail?.email,
    });
    if (!user?.email || !user?.active) {
      throw new HttpException('Invalid Token', HttpStatus.BAD_REQUEST);
    }
    return user.user_id;
  }
}
