import { ParolEmailUserDto } from './dto/parol_email';
import * as bcrypt from 'bcrypt';
import Redis from 'ioredis';
import senMail from 'src/utils/node_mailer';
import jwt from 'src/utils/jwt';
import { LoginUserDto } from './dto/login';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { RegistrUserDto } from './dto/registr';
import { random } from 'src/utils/random';
import { UserEntity } from 'src/entities/user.entity';
import { InsertResult } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ParolUserDto } from './dto/parol';
import { PatchUserDto } from './dto/patch.all';
import { CoursesOpenUsers } from 'src/entities/course_open_users.entity';
// import { CoursesOpenUsers } from 'src/entities/course_open_users.entity';

@Injectable()
export class UsersService {
  private readonly redis: Redis;

  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getClient();
  }

  async registr(body: RegistrUserDto) {
    const randomSon = random();
    const findUser = await UserEntity.findOne({
      where: {
        email: body.email,
      },
    }).catch(() => []);
    if (findUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    await senMail(body.email, randomSon);
    const solt = await bcrypt.genSalt();

    const newObj = {
      email: body.email,
      area: body.area,
      first_name: body.first_name,
      last_name: body.last_name,
      password: await bcrypt.hash(body.password, solt),
      random: randomSon,
    };

    await this.redis.set(randomSon, JSON.stringify(newObj));

    return 'Code send Email';
  }

  async login(body: LoginUserDto) {
    const randomSon = random();
    const findUser: any = await UserEntity.findOne({
      where: {
        email: body.email,
      },
    }).catch(() => []);
    if (!findUser) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }

    const solt = await bcrypt.genSalt();
    const pass = await bcrypt.compare(body.password, findUser.password);
    if (!pass) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }

    await senMail(body.email, randomSon);

    const newObj = {
      email: body.email,
      password: await bcrypt.hash(body.password, solt),
      random: randomSon,
    };

    await this.redis.set(randomSon, JSON.stringify(newObj));

    return 'Code send Email';
  }

  async registr_email(random: string) {
    const result: any = await this.redis.get(random);
    const redis = JSON.parse(result);

    if (!redis || redis.random != random) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    const findUser = await UserEntity.findOne({
      where: {
        email: redis.email,
      },
    }).catch(() => []);
    if (findUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const newUser: InsertResult = await UserEntity.createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values({
        area: redis.area,
        email: redis.email,
        first_name: redis.first_name,
        last_name: redis.last_name,
        password: redis.password,
      })
      .returning('*')
      .execute()
      .catch(() => {
        throw new HttpException(
          'UNPROCESSABLE_ENTITY',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      });
    const token = jwt.sign({
      id: newUser?.raw[0]?.user_id,
      email: newUser?.raw[0]?.email,
    });

    this.redis.del(random);
    return token;
  }

  async login_email(random: string) {
    const result: any = await this.redis.get(random);
    const redis = JSON.parse(result);

    if (!redis || redis.random != random) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    const findUser: any = await UserEntity.findOne({
      where: {
        email: redis.email,
      },
    }).catch(() => []);
    if (!findUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const token = jwt.sign({
      id: findUser.user_id,
      email: findUser.email,
    });

    this.redis.del(random);
    return token;
  }

  async parol(body: ParolUserDto) {
    const randomSon = random();
    const findUser = await UserEntity.findOne({
      where: {
        email: body.email,
      },
    }).catch(() => []);
    if (!findUser) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    await senMail(body.email, randomSon);

    const newObj = {
      email: body.email,
      random: randomSon,
    };

    await this.redis.set(randomSon, JSON.stringify(newObj));

    return 'Code send Email';
  }

  async parol_email(random: string, body: ParolEmailUserDto) {
    const result: any = await this.redis.get(random);
    const redis = JSON.parse(result);

    if (!redis || redis.random != random) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    const findUser: any = await UserEntity.findOne({
      where: {
        email: redis.email,
      },
    }).catch(() => []);
    if (!findUser) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    this.redis.del(random);
    if (body.newPassword != body.password) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }

    const solt = await bcrypt.genSalt();
    await UserEntity.createQueryBuilder()
      .update()
      .set({
        password: await bcrypt.hash(body.password, solt),
      })
      .where({ user_id: findUser.user_id })
      .execute();
    return 'User password successfully updated';
  }

  async statistika() {
    const allUsers: UserEntity[] = await UserEntity.find();
    const takeCourse: CoursesOpenUsers[] = await CoursesOpenUsers.find({
      relations: {
        user_id: true,
      },
    });

    const users = allUsers.filter(
      (e) => e.email !== 'ahmadjonovakmal079@gmail.com',
    );
    const activeUser = users.filter((e) => e.active).length;
    const delUser = users.filter((e) => !e.active).length;

    const res = {
      status: 200,
      allUsers: users,
      activeUser,
      delUser,
      byCourse: takeCourse.length,
    };

    return res;
  }

  async get(id: string) {
    const findUser = await UserEntity.findOne({
      relations: {
        open_course: true,
        take_workbook: true,
        watch_video: true,
      },
      where: {
        user_id: id,
      },
    });

    return findUser;
  }

  async updateImage(userId: string, img: string) {
    const findUser = await UserEntity.findOne({
      where: {
        user_id: userId,
      },
    }).catch(() => []);
    if (!findUser) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }

    await UserEntity.createQueryBuilder()
      .update()
      .set({
        image: img,
      })
      .where({
        user_id: userId,
      })
      .execute();
  }

  async patch(userId: string, body: PatchUserDto) {
    const findUser: any = await UserEntity.findOne({
      where: {
        user_id: userId,
      },
    }).catch(() => []);
    if (!findUser) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }

    await UserEntity.createQueryBuilder()
      .update()
      .set({
        area: body.area || findUser.area,
        first_name: body.first_name || findUser.first_name,
        last_name: body.last_name || findUser.last_name,
        password: body.password || findUser.password,
      })
      .where({
        user_id: userId,
      })
      .execute();
  }

  async delete(userId: string) {
    const findUser: any = await UserEntity.findOne({
      where: {
        user_id: userId,
      },
    }).catch(() => []);
    if (!findUser) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }

    await UserEntity.createQueryBuilder()
      .update()
      .set({
        active: false,
      })
      .where({
        user_id: userId,
      })
      .execute();
  }

  async admin_login(body: LoginUserDto) {
    const randomSon = random();
    const findUser: any = await UserEntity.findOne({
      where: {
        email: body.email,
      },
    }).catch(() => []);
    // Shahboz akani email pochtalarini && tekshiruvi bilan tekshirib qoyish kerak
    if (!findUser) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }

    const solt = await bcrypt.genSalt();
    const pass = await bcrypt.compare(body.password, findUser.password);
    if (!pass) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }

    await senMail(body.email, randomSon);

    const newObj = {
      email: body.email,
      password: await bcrypt.hash(body.password, solt),
      random: randomSon,
    };

    await this.redis.set(randomSon, JSON.stringify(newObj));

    return 'Code send Email';
  }

  async admin_login_email(random: string) {
    const result: any = await this.redis.get(random);
    const redis = JSON.parse(result);

    if (!redis || redis.random != random) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    const findUser: any = await UserEntity.findOne({
      where: {
        email: redis.email,
      },
    }).catch(() => []);
    if (!findUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const token = jwt.sign({
      id: findUser.user_id,
      email: findUser.email,
    });

    this.redis.del(random);
    return token;
  }
}
