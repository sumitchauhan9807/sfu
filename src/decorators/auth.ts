import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../types/MyContext";
import { verify } from "jsonwebtoken";
import { JWT_KEY } from "../constants";
import type { JwtPayload } from "jsonwebtoken"
import {  USER_TYPES } from '../types/DataTypes'


export const isModelAuthed: MiddlewareFn<MyContext> = async (req:any, next) => {
  let headers = req.context.req.headers
  let authorization = headers['authorization'] 
  if (!authorization) {
    throw new Error("Auth header missing");
  }
  try {
    const token = authorization.split(" ")[1];
    const payload = verify(token, JWT_KEY!) as JwtPayload;
    console.log(payload)
    if(payload.userType != USER_TYPES.MODEL){ 
      throw Error('Invalid User Type')
    }
    req.context.model = {
      name:"sumit"
    } as any;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
  return next();
};
