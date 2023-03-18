import { HttpException, HttpStatus } from '@nestjs/common';
import { UserEntity } from 'src/entities/user.entity';
import jwt from 'src/utils/jwt';

export class TokenMiddleware {
  async verifyAdmin(headers: any) {
    if (!headers.autharization) {
      throw new HttpException('Bad Request in Token', HttpStatus.BAD_REQUEST);
    }
    const idAndEmail = jwt.verify(headers.autharization);

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
    if (
      admin?.email !== 'ahmadjonovakmal079@gmail.com' &&
      admin.password !== 'adminprodvd2427'
    ) {
      throw new HttpException('Siz Admin emasiz', HttpStatus.BAD_REQUEST);
    }
    return admin.user_id;
  }

  async verifyUser(headers: any) {
    if (!headers.autharization) {
      throw new HttpException('Bad Request in Token', HttpStatus.BAD_REQUEST);
    }
    const idAndEmail = jwt.verify(headers.autharization);
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
