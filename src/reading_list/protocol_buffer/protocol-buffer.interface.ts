export interface ProtocolBuffeInterface {
  decode(buffer: any): Promise<{ [key: string]: any }>;

  encode(payload: any): Promise<Uint8Array>;
}
