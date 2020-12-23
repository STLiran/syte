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

  private async encodeDeprecated(): Promise<void> {
    const packageDefinition2 = protoLoader.loadSync(this.PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
      includeDirs: ['node_modules/google-proto-files', 'proto'],
    });
    const grpcObject: GrpcObject = grpc.loadPackageDefinition(
      packageDefinition2,
    );
    const services = grpcObject['item'] as GrpcObject;
    const constructor: ProtobufMessage = services['Item'] as ProtobufMessage;
    this.logger.log('constructor' + JSON.stringify(constructor));
    // const message = new AwesomeMessage({ awesomeField: 'hello' });
    // const buffer = AwesomeMessage.encode(message).finish();
    // const decoded = AwesomeMessage.decode(buffer);
    // this.logger.log('AwesomeMessage decoded' + JSON.stringify(decoded));
  }

  async decode(buffer: any): Promise<{ [p: string]: any }> {
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
  private async doNothing(): Promise<void> {
    try {
      const payload = { id: '2', isDone: false, txt: 'txt' };
      const root: Root = await protocolBuffer.load(this.PROTO_PATH);
      const Item = root.lookupType('item.Item');
      const errMsg = Item.verify(payload);
      if (errMsg) {
        throw Error(errMsg);
      }
      const message = Item.create(payload);
      const buffer = Item.encode(message).finish();
      const message2 = Item.decode(buffer);

      const object: { [key: string]: any } = Item.toObject(message2, {
        longs: String,
        enums: String,
        bytes: String,
        // see ConversionOptions
      });
      console.log('object' + JSON.stringify(object));
    } catch (e) {
      this.logger.error('The following error has occurred:' + e, e);
    }
  }
}
