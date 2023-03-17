import { RegistrCreateDto } from './dto/registrCreate';
import { utilsDate } from './../../utils/date';
import * as bcrypt from 'bcrypt';
import Redis from 'ioredis';
import senMail from 'src/utils/node_mailer';
import jwt from 'src/utils/jwt';
import { ParolEmailUserDto } from './dto/parol_email';
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
import { fn } from 'src/utils/time_left';
import { Request, Response } from 'express';
import { trim } from 'src/utils/trim';

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

  async registr_email(random: string, res: Response) {
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

    res.cookie('code', random);

    return {
      message: 'Malumotlar togri',
      status: 200,
    };
  }

  async registrCreate(req: Request, body: RegistrCreateDto, res: Response) {
    const random = req.cookies?.code;
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
        email: redis.email,
        first_name: body.first_name,
        last_name: body.last_name,
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
    res.clearCookie('code');
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
        course_id: true,
      },
    });
    const users = allUsers.filter((e) => e.email !== 'shakhboz2427@gmail.com');
    const activeUser = users.filter((e) => e.active).length;
    const delUser = users.filter((e) => !e.active).length;

    console.log(takeCourse);
    const today = utilsDate(new Date());
    const result = [];
    let hafta = 0;
    let oy = 0;
    let yil = 0;
    for (let i = 0; i < takeCourse.length; i++) {
      result.push(fn(utilsDate(takeCourse[i].create_data), today));
    }

    for (let i = 0; i < result.length; i++) {
      console.log(result[i].ketgan_kun);
      if (result[i].ketgan_kun <= 7 || result[i].ketgan_kun == undefined) {
        if (result[i].ketgan_oy == 0) {
          hafta += trim(takeCourse[i].course_id.course_price);
        }
      }
      if (result[i].ketgan_kun <= 7 || result[i].ketgan_kun == undefined) {
        if (result[i].ketgan_oy == 0) {
          oy += trim(takeCourse[i].course_id.course_price);
        }
      }
      if (result[i].ketgan_kun == undefined && result[i].ketgan_oy == 1) {
        oy += trim(takeCourse[i].course_id.course_price);
      }
      yil += trim(takeCourse[i].course_id.course_price);
    }

    const res = {
      allUsers: users,
      activeUser,
      delUser,
      byCourse: takeCourse.length,
      hafta,
      oy,
      yil,
    };
    return res;
  }

  async get(id: string) {
    const findUser: any = await UserEntity.findOne({
      relations: {
        open_course: true,
        take_workbook: true,
        watch_video: true,
      },
      where: {
        user_id: id,
      },
    });

    const data: any = new Date();
    const today = utilsDate(data);

    for (let i = 0; i < findUser.open_course.length; i++) {
      findUser.open_course[i].bought = utilsDate(
        findUser.open_course[i].create_data,
      );
      const newObj = fn(utilsDate(findUser.open_course[i].create_data), today);
      findUser.open_course[i].ketgan_kun = newObj.ketgan_kun;
      findUser.open_course[i].ketgan_oy = newObj.ketgan_oy;
      findUser.open_course[i].qolgan_kun = newObj.qolgan_kun;
      findUser.open_course[i].qolgan_oy = newObj.qolgan_oy;
      delete findUser.open_course[i].create_data;
    }

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
    if (!findUser && findUser.email !== 'shakhboz2427@gmail.com') {
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
