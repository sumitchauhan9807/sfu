import { ApolloClient, gql, HttpLink, InMemoryCache } from "@apollo/client";
import { PRODUCTION,CROSS_SERVER_AUTH_TOKEN } from "../constants";
import fetch from "cross-fetch";

const url = PRODUCTION
  ? "https://api.globalfun.cam/graphql"
  : "http://localhost:4000/graphql";

const client = new ApolloClient({
  link: new HttpLink({ uri: url, fetch }),
  cache: new InMemoryCache(),
});

const myQuery = gql`
  query hello {
    hello
  }
`;

const SYSTEM_END_MODEL_SESSION = gql`
  mutation system_end_model_session($modelId:String!,$authToken:String!) {
    system_end_model_session(modelId:$modelId,authToken:$authToken)
  }
`;

const SYSTEM_CHECK_SESSION_ACTIVE = gql`
  query system_check_session_active($sessionId:Float!,$authToken:String!) {
    system_check_session_active(sessionId:$sessionId,authToken:$authToken)
  }
`;


export const CHECK_LIVE_SESSION_ACTIVE = async (sessionId:string) => {
  console.log("HEREEEEEEEEEEEEEEEEEEE")
  try {
    let { data ,errors } = await client.query({
      query: SYSTEM_CHECK_SESSION_ACTIVE,
      fetchPolicy:"no-cache",
      variables: {
        sessionId:Number(sessionId),
        authToken: CROSS_SERVER_AUTH_TOKEN
      }
    });
    console.log(sessionId,"sessionID")
    console.log(data,"data.system_check_session_active")
    return data.system_check_session_active
  }catch(e) {
    // console.log("1111111111111111111111111111111111111111111")
    // console.log(e.cause.result,"ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
    // console.log("1111111111111111111111111111111111111111111")

    console.log(e.cause.result,"Asdasdasdasd")
    return e.cause.message
  }
}

export const End_Model_Session = async (modelId: String) => {
  console.log("HEREEEEEEEEEEEEEEEEEEE")
  try {
    let { data ,errors } = await client.mutate({
      mutation: SYSTEM_END_MODEL_SESSION,
      fetchPolicy:"no-cache",
      variables: {
        modelId:modelId,
        authToken: CROSS_SERVER_AUTH_TOKEN
      }
    });
    // console.log(errors,"ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
    return data
  }catch(e) {
    // console.log("1111111111111111111111111111111111111111111")
    // console.log(e.cause.result,"ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
    // console.log("1111111111111111111111111111111111111111111")

    console.log(e,"Asdasdasdasd")
    return e.cause.message
  }
};
export const getData = async () => {
  console.log(url);
  let { data } = await client.query({
    query: myQuery,
  });
  return data;
};
