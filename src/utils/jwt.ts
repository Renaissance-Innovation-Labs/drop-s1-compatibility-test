import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN } from "../config";

class Jwt {
    public static signJwt(value: any, expiresIn: string | number) {
        return jwt.sign(value, ACCESS_TOKEN as unknown as string, { expiresIn });
    }

    public static verifyJwt(value: string) {
        return jwt.verify(value, ACCESS_TOKEN as unknown as string) as JwtPayload;
    }

    public static isJwtExpired(token: string): boolean {
        try {
            const decoded = jwt.verify(token, ACCESS_TOKEN as unknown as string) as JwtPayload;
            const currentTime = Math.floor(Date.now() / 1000);
            return decoded.exp ? decoded.exp < currentTime : true;
        } catch (error) {
            return true; // If verification fails, consider the token as expired
        }
    }

    public static isDurationMoreThan(token: string, periodInSeconds: number): boolean {
        try {
            const decoded = jwt.verify(token, ACCESS_TOKEN as unknown as string) as JwtPayload;
            const currentTime = Math.floor(Date.now() / 1000);
            return decoded.exp ? (decoded.exp - currentTime) > periodInSeconds : false;
        } catch (error) {
            return false; // If verification fails, we assume the duration is not sufficient
        }
    }

    public static decodeJwtWithoutVerification(token: string): JwtPayload | null {
        try {
            return jwt.decode(token) as JwtPayload;
        } catch (error) {
            return null; // If decoding fails, return null
        }
    }

    public static refreshJwt(token: string, expiresIn: string | number): string | null {
        try {
            const decoded = jwt.verify(token, ACCESS_TOKEN as unknown as string) as JwtPayload;
            delete decoded.iat; // Remove issued at
            delete decoded.exp; // Remove expiration
            return jwt.sign(decoded, ACCESS_TOKEN as unknown as string, { expiresIn });
        } catch (error) {
            return null; // If verification fails, return null
        }
    }

    public static getTokenExpirationTime(token: string): number | null {
        try {
            const decoded = jwt.verify(token, ACCESS_TOKEN as unknown as string) as JwtPayload;
            return decoded.exp || null;
        } catch (error) {
            return null; // If verification fails, return null
        }
    }

    public static getTokenIssuedAtTime(token: string): number | null {
        try {
            const decoded = jwt.verify(token, ACCESS_TOKEN as unknown as string) as JwtPayload;
            return decoded.iat || null;
        } catch (error) {
            return null; // If verification fails, return null
        }
    }
}

export default Jwt;
