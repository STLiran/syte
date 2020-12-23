import { Injectable, Logger } from '@nestjs/common';
import { GrpcObject, ProtobufMessage } from 'grpc';
import { Root } from 'protobufjs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const protoLoader = require('@grpc/proto-loader');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const grpc = require('grpc');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const protocolBuffer = require('protobufjs');

@Injectable()
export class ProtocolBufferService {
  private readonly PROTO_PATH: string;
  constructor(private logger: Logger) {
    this.PROTO_PATH = __dirname + '/item.proto';
  }

  async decode(buffer: any): Promise<{ [key: string]: any }> {
    const root: Root = await protocolBuffer.load(this.PROTO_PATH);
    const Item = root.lookupType('item.Item');
    const message = Item.decode(buffer);
    return Item.toObject(message, {
      longs: String,
      enums: String,
      bytes: String,
    });
  }

  async encode(payload: any): Promise<Uint8Array> {
    try {
      const root: Root = await protocolBuffer.load(this.PROTO_PATH);
      const Item = root.lookupType('item.Item');
      const errMsg = Item.verify(payload);
      if (errMsg) {
        this.logger.error(`Item misconfiguration error.${errMsg}`);
        return null;
      }
      const message = Item.create(payload);
      const buffer: Uint8Array = Item.encode(message).finish();

      return buffer;
    } catch (e) {
      this.logger.error('The following error has occurred:' + e, e);
    }
  }
}
