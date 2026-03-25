/* eslint-disable */

// @ts-nocheck

import { IDL } from '@icp-sdk/core/candid';

const AuthResult = IDL.Record({
  token: IDL.Opt(IDL.Text),
  success: IDL.Bool,
  message: IDL.Text,
});

const MappingRow = IDL.Record({
  requirement_id: IDL.Text,
  compliance_status: IDL.Text,
  regulatory_clause: IDL.Text,
  notes: IDL.Text,
  user_story: IDL.Text,
});

const MappingResult = IDL.Record({
  status: IDL.Text,
  data: IDL.Vec(MappingRow),
});

export const idlService = IDL.Service({
  _initializeAccessControlWithSecret: IDL.Func([IDL.Text], [], []),
  signup: IDL.Func([IDL.Text, IDL.Text], [AuthResult], []),
  login: IDL.Func([IDL.Text, IDL.Text], [AuthResult], []),
  logout: IDL.Func([IDL.Text], [IDL.Bool], []),
  validateSession: IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], ['query']),
  runMapping: IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text], [MappingResult], []),
});

export const idlInitArgs = [];

export const idlFactory = ({ IDL }) => {
  const AuthResult = IDL.Record({
    token: IDL.Opt(IDL.Text),
    success: IDL.Bool,
    message: IDL.Text,
  });
  const MappingRow = IDL.Record({
    requirement_id: IDL.Text,
    compliance_status: IDL.Text,
    regulatory_clause: IDL.Text,
    notes: IDL.Text,
    user_story: IDL.Text,
  });
  const MappingResult = IDL.Record({
    status: IDL.Text,
    data: IDL.Vec(MappingRow),
  });
  return IDL.Service({
    _initializeAccessControlWithSecret: IDL.Func([IDL.Text], [], []),
    signup: IDL.Func([IDL.Text, IDL.Text], [AuthResult], []),
    login: IDL.Func([IDL.Text, IDL.Text], [AuthResult], []),
    logout: IDL.Func([IDL.Text], [IDL.Bool], []),
    validateSession: IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], ['query']),
    runMapping: IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text], [MappingResult], []),
  });
};

export const init = ({ IDL }) => { return []; };
