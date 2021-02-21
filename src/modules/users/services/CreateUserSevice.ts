
import { hash } from 'bcryptjs';
import IUsersRepository from '../repositories/IUsersRepository'
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';

interface Request {
  name: string,
  email: string,
  password: string,
}


class CreateUserService {

  private  usersRepository: IUsersRepository;

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async execute({ name, email, password}: Request): Promise<User> {

    const checkUserExists = await this.usersRepository.findByEmail(email);

    if(checkUserExists) {
      throw new AppError('Email address already used.') //Verifica se o email já existe no banco de dados
    };

    const hashedPassword = await hash(password, 8); //Salva a senha criptografada no banco de dados

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;

  }
}

export default CreateUserService;
