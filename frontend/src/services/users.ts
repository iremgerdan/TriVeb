import { AxiosResponse } from 'axios';

import http from 'utils/http';

import { User } from 'interfaces/services/models/User';
import { UsersCreateDto } from 'interfaces/services/users/users.create.dto';
import { UsersLoginDto } from 'interfaces/services/users/users.login.dto';

export const login = (
  dto: UsersLoginDto
): Promise<
  AxiosResponse<{
    user: User;
    token: string;
  }>
> => {
  return http.post('users/login', dto);
};

export const signUp = (
  dto: UsersCreateDto
): Promise<
  AxiosResponse<{
    user: User;
    token: string;
  }>
> => {
  return http.post('users', dto);
};

export const getCurrentUser = (): Promise<AxiosResponse<User>> => {
  return http.get('users/@me');
};
