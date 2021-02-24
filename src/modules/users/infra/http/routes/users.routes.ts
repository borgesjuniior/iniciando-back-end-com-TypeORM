import { Router } from 'express';
import multer from 'multer';
import { container } from 'tsyringe';

import uploadConfig from '@config/upload';
import CreateUserService from '@modules/users/services/CreateUserSevice';
import UpdateUserAvatar from '@modules/users/services/UpdateUserAvatarService';

import ensureAuthenticaded from '../middlewares/ensureAuthenticaded';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  const createUser = container.resolve(CreateUserService);

  const user = await createUser.execute({
    name,
    email,
    password,
  });

  //delete user.password; //Não mostra a senha na listagem de usuários

  res.json(user);
});

usersRouter.patch('/avatar', ensureAuthenticaded, upload.single('avatar'), async (req, res) => {
  const updateUserAvatar = container.resolve(UpdateUserAvatar);

  const user = await updateUserAvatar.execute({
    user_id: req.user.id,
    avatarFilename: req.file.filename,
  });

  return res.json(user);

})

export default usersRouter;
