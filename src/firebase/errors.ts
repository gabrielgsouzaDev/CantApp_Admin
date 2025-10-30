// src/firebase/errors.ts

import { getAuth } from "firebase/auth";
import { adminAuth } from "../firebase";

export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  requestResourceData?: any;
};

function formatFirestoreError(context: SecurityRuleContext): string {
  const auth = adminAuth; // Always use adminAuth for context generation
  const user = auth.currentUser;

  const requestBody = {
    auth: user ? {
      uid: user.uid,
      token: {
        email: user.email,
        email_verified: user.emailVerified,
        name: user.displayName,
        picture: user.photoURL,
      },
    } : null,
    method: context.operation,
    path: `/databases/(default)/documents/${context.path}`,
    request: context.requestResourceData ? { resource: { data: context.requestResourceData } } : {},
    time: new Date().toISOString(),
  };

  return `FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules:\n${JSON.stringify(requestBody, null, 2)}`;
}

export class FirestorePermissionError extends Error {
  constructor(context: SecurityRuleContext) {
    super(formatFirestoreError(context));
    this.name = 'FirestorePermissionError';
    // Ensure the prototype is correctly set
    Object.setPrototypeOf(this, FirestorePermissionError.prototype);
  }
}
