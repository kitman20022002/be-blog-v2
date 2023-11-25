import User from '../../model/user';
import status from 'http-status';

export const login = async (req: any, res: any) => {
  const user = await User.findByCredentials(
    req.body.email,
    req.body.password,
  ).catch(() => {
    res.status(status.UNAUTHORIZED).send();
  });
  if (user === null || user === undefined) return res.status(status.UNAUTHORIZED).send();
  if (!user.isActive || !user.verify) return res.status(status.FORBIDDEN).send();
  await user.generateAuthToken();
  return res.status(status.OK).json(user);
};
