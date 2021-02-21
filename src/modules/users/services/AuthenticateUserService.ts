import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';


interface Request {
  email: string;
  password: string;
}

class AuthenticateUserService {
  private  usersRepository: IUsersRepository;

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository;
  }

    public async execute({ email, password }: Request): Promise<{ user: User, token: string}> {

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401); //Se o usuário não for encontrado no banco de dados ele retorna um erro.
    }


    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 401); //Se a senha não bater com a do banco de dados retorna um erro.
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token =  sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
    }
  }
}

export default AuthenticateUserService;
