import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HeaderAuthValidationPipe } from './pipes/header-auth-validation.pipe';
import { CustromHeader } from './decorator/custom-header.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() body) {
      return this.authService.login(body.identifier, body.password);
    }
    @Post('uam-login')
    async uamLogin(@Body() body) {
      return this.authService.uamLogin(body.identifier, body.password);
    }

    @Post('refresh')
    async refresh(@Body() body) {
      return this.authService.refresh(body.token);
    }

    @Get('me')
    async me (
      @CustromHeader (HeaderAuthValidationPipe) token:string,
    ) {
      return this.authService.me(token);
    }
}
