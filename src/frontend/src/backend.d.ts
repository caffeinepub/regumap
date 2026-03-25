import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
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
export interface backendInterface {
  _initializeAccessControlWithSecret(secret: string): Promise<undefined>;
  signup(userId: string, password: string): Promise<AuthResult>;
  login(userId: string, password: string): Promise<AuthResult>;
  logout(token: string): Promise<boolean>;
  validateSession(token: string): Promise<[] | [string]>;
  runMapping(token: string, regulatoryRequirement: string, textInput: string, fileData: string): Promise<MappingResult>;
}
