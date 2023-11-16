import _ from "lodash";
import { Request, Response } from "express";

interface UserRequest extends Request {
  user?: any;
}

export const getUserProfile = (req: UserRequest, res: Response) => {
  const user = req.user;

  const propertiesToInclude = [
    "email",
    "firstName",
    "lastName",
    "dateOfBirth",
    "createdAt",
  ];

  const responseData = _.pick(user, propertiesToInclude);

  res.status(200).json(responseData);
};
