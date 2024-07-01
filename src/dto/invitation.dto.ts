import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class InvitationDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    inviter!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    invitee!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    personToInviter!: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    inviteeEmail!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    howOften!: string;

}