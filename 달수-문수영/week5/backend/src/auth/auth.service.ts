import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import refreshConfig from 'src/auth/config/refresh.config';
import { AuthJwtPayload } from 'src/auth/types/auth-jwtPayload';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserService } from 'src/users/users.service';
import { excludeFields } from '../common/utils/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
  ) {}

  async registerUser(createUserDto: CreateUserDto) {
    const user = await this.userService.findByEmail(createUserDto.email);

    if (user) {
      throw new ConflictException('이미 존재하는 유저입니다.');
    }

    const newUser = await this.userService.create(createUserDto);

    return excludeFields(newUser, ['password', 'hashedRefreshToken']);
  }

  async validateLocalUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('유저를 찾을 수 없습니다.');

    // TODO: null 처리
    const isPasswordMatched = await verify(user.password as string, password);
    if (!isPasswordMatched)
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

    return {
      id: user.id,
      name: user.name,
    };
  }

  async login(userId: number, name?: string) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRT = await hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRT);

    return {
      id: userId,
      name,
      accessToken,
      refreshToken,
    };
  }

  async generateTokens(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateJwtUser(userId: number) {
    const user = await this.userService.findOne(userId);

    if (!user) throw new UnauthorizedException('유저를 찾을 수 없습니다.');

    const currentUser = { id: user.id, name: user.name };

    return currentUser;
  }

  async validateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.userService.findOne(userId);

    if (!user) throw new UnauthorizedException('유저를 찾을 수 없습니다.');

    const refreshTokenMatched = await verify(
      user.hashedRefreshToken as string,
      refreshToken,
    );

    if (!refreshTokenMatched)
      throw new UnauthorizedException('잘못된 리프레시 토큰입니다.');

    const currentUser = { id: user.id, name: user.name };

    return currentUser;
  }

  async refreshToken(userId: number, name: string) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRT = await hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRT);

    return {
      id: userId,
      name,
      accessToken,
      refreshToken,
    };
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    const user = await this.userService.findByEmail(googleUser.email);
    if (user) return user;

    return await this.userService.create(googleUser);
  }

  async signOut(userId: number) {
    await this.userService.updateHashedRefreshToken(userId, null);
    return null;
  }
}
