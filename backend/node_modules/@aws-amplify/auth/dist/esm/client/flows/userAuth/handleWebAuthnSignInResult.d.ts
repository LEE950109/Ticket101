import { ChallengeParameters } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/types';
import { AuthSignInOutput } from '../../../types';
export declare function handleWebAuthnSignInResult(challengeParameters: ChallengeParameters): Promise<AuthSignInOutput>;
