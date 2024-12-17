import { IsString, IsNotEmpty, MinLength } from "class-validator";

export class CheckCompatibility {
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    connectionId!: string;

}