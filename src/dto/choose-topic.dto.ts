import { IsString, IsNotEmpty, MinLength } from "class-validator";

export class ChooseTopicDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    connectionId!: string;

    @IsString()
    @IsNotEmpty()
    topic!: string
}