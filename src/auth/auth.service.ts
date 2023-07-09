import { ForbiddenException, Injectable, Req } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AuthDTO } from './dto';
import { JwtService } from '@nestjs/jwt';
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
      email: 'abc@gmail.com',
    };
    return await this.signJwtToken(user.id, user.email);
  }
  //now convert to an object, not string
  async signJwtToken(
    userId: number,
    email: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const jwtString = await this.jwtService.signAsync(payload, {
      expiresIn: '30m',
      secret: this.configService.get('JWT_SECRET'),
    });
    return {
      accessToken: jwtString,
    };
  }
}
