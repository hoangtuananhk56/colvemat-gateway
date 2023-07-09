import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';

@Controller('api/v2/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register') //register a new user
  register(@Body() authDTO: AuthDTO) {
    //not validate using class-validator AND class-transformer
    return this.authService.register(authDTO);
  }
  //POST: .../auth/login
  @Post('login')
  login(@Body() authDTO: AuthDTO) {
    return this.authService.login(authDTO);
  }

  //POST: .../auth/login
  @Post('login')
  logout(@Body() authDTO: AuthDTO) {
    return this.authService.login(authDTO);
  }
}
