export type ProducerTransport = {
  modelId: String;
  transport?: any;
  producer?: any;
};

export type ConsumerTransport = {
  clientId: String;
  transport?: any;
  consumer?: any;
};

export enum USER_TYPES {
  ADMIN = 'ADMIN',
  MODEL = "MODEL",
  USER = "USER",
};