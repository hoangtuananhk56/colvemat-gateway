import { ForbiddenException, Injectable, Req } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AuthDTO } from './dto';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';

@Injectable({}) //this is "Dependency Injection"
export class AuthService {
  user = [
    {
      id: 1,
      email: 'abc@gmail.com',
      password: '123123',
    },
    {
      id: 2,
      email: 'xyz@gmail.com',
      password: '123123',
    },
  ];
  count = 2;
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}
  async register(authDTO: AuthDTO) {
    try {
      //insert data to database
      // const user = await this.prismaService.user.create({
      //   data: {
      //     email: authDTO.email,
      //     hashedPassword: hashedPassword,
      //     firstName: '',
      //     lastName: '',
      //   },
      //   //only select id, email, createdAt
      //   select: {
      //     id: true,
      //     email: true,
      //     createdAt: true,
      //   },
      // });

      //call api regiter and make a user body to send
      const user: AuthDTO = {
        id: this.count++,
        email: authDTO.email,
        password: authDTO.password,
      };
      this.user.push(user);
      return await this.signJwtToken(user.id, user.email);
    } catch (error) {
      if (error.code == 'P2002') {
        //throw new ForbiddenException(error.message)
        //for simple
        throw new ForbiddenException('User with this email already exists');
      }
    }
    //you should add constraint "unique" to user table
  }
  async login(authDTO: AuthDTO) {
    //find user with input email
    // const user = await this.prismaService.user.findUnique({
    //   where: {
    //     email: authDTO.email,
    //   },
    // });
    // if (!user) {
    //   throw new ForbiddenException('User not found');
    // }
    // const passwordMatched = await argon.verify(
    //   user.hashedPassword,
    //   authDTO.password,
    // );
    // if (!passwordMatched) {
    //   throw new ForbiddenException('Incorrect password');
    // }
    // delete user.hashedPassword; //remove 1 field in the object

    //call api login and send a Jwt token
    const user = {
      id: 1,
      email: authDTO.email,
    };

    // const tokens = await this.signJwtToken(user.id, user.email);
    // await this.updateRefreshToken(user.id, tokens.refreshToken);
    return await this.signJwtToken(user.id, user.email);
  }

  /**Logout will clear exprie token and renew a token then send to client */
  async logout(token: string): Promise<{ accessToken: string }> {
    //update refreshToken = nil on DB

    //Return '' for client
    return {
      accessToken: '',
    };
  }

  //now convert to an object, not string
  async signJwtToken(
    userId: number,
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '30m',
      secret: this.configService.get('JWT_ACCESS_SECRET'),
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    // await this.usersService.update(userId, {
    //   refreshToken: hashedRefreshToken,
    // });
  }
}
