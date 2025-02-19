import { isModelAuthed } from "../decorators/auth";
import { Resolver, Query, Mutation, Arg, UseMiddleware } from "type-graphql";
import {getData,End_Model_Session} from '../services/system'
@Resolver()
export class Operations {


  @Query(() => String)
  async checkGQL() {
    let data = await End_Model_Session("15")
    // console.log(data)
    return JSON.stringify(data);
  }

  @Mutation(() => String)
  @UseMiddleware(isModelAuthed)
  async testAuth() {
    return "Hello World!";
  }

}

