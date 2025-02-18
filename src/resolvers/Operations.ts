import { isModelAuthed } from "../decorators/auth";
import { Resolver, Query, Mutation, Arg, UseMiddleware } from "type-graphql";

@Resolver()
export class Operations {


  @Query(() => String)
  async hello() {
    return "Hello World!";
  }

  @Mutation(() => String)
  @UseMiddleware(isModelAuthed)
  async testAuth() {
    return "Hello World!";
  }

}

