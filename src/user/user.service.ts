import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Observable, catchError, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigGetOptions, ConfigService } from '@nestjs/config';
import { Email } from './entities/email.entity';

@Injectable()
export class UserService {
  constructor(private readonly httpService: HttpService) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    const response = this.httpService
      .get(`http://localhost:3001/email`)
      .pipe(map((res) => res?.data))
      .pipe(
        catchError(() => {
          throw new ForbiddenException('API not available');
        }),
      );
    return response;
  }

  findOne(id: number): Observable<Email> {
    const response = this.httpService
      .get<Email>(`http://localhost:3001/email/${id}`)
      .pipe(map((res) => res?.data))
      .pipe(
        catchError(() => {
          throw new ForbiddenException('API not available');
        }),
      );
    return response;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
