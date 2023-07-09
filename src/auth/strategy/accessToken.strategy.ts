import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

type JwtPayload = {
  sub: string;
  username: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService, private authService: AuthService) {
    super({
      //token string is added to every request(except login / register)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
    });
  }
  async validate(payload: JwtPayload) {
    // const u = this.authService.user.find((e) => e.id === payload.sub);
    // delete u.password;
    // console.log(u);
    // console.log(payload);
    return payload;
  }
}
