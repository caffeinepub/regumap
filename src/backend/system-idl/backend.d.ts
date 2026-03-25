import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AuthResult {
  token: [] | [string];
  success: boolean;
  message: string;
}
export interface MappingResult {
  status: string;
  data: Array<MappingRow>;
}
export interface MappingRow {
  requirement_id: string;
  compliance_status: string;
  regulatory_clause: string;
  notes: string;
  user_story: string;
}
export interface _SERVICE {
  _initializeAccessControlWithSecret: ActorMethod<[string], undefined>;
  login: ActorMethod<[string, string], AuthResult>;
  logout: ActorMethod<[string], boolean>;
  runMapping: ActorMethod<[string, string, string, string], MappingResult>;
  signup: ActorMethod<[string, string], AuthResult>;
  validateSession: ActorMethod<[string], [] | [string]>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
