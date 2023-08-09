import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  register() {
    return { msg: 'Mon compte a été crée!' };
  }

  login() {
    return { msg: 'Je suis connecté' };
  }
}
