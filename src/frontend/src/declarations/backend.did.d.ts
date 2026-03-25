/* eslint-disable */

// @ts-nocheck

import type { ActorMethod } from '@icp-sdk/core/agent';
import type { IDL } from '@icp-sdk/core/candid';
import type { Principal } from '@icp-sdk/core/principal';

export interface AuthResult {
  token: [] | [string];
  success: boolean;
  message: string;
}
export interface MappingRow {
  requirement_id: string;
  compliance_status: string;
  regulatory_clause: string;
  notes: string;
  user_story: string;
}
export interface MappingResult {
  status: string;
  data: Array<MappingRow>;
}
export interface _SERVICE {
  _initializeAccessControlWithSecret: ActorMethod<[string], undefined>;
  signup: ActorMethod<[string, string], AuthResult>;
  login: ActorMethod<[string, string], AuthResult>;
  logout: ActorMethod<[string], boolean>;
  validateSession: ActorMethod<[string], [] | [string]>;
  runMapping: ActorMethod<[string, string, string, string], MappingResult>;
}
export declare const idlService: IDL.ServiceClass;
export declare const idlInitArgs: IDL.Type[];
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
