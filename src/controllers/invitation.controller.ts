import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import InvitationService from "../services/invitation.service";
import { InvitationDto } from "../dto/invitation.dto";
import { ChooseTopicDto } from "../dto/choose-topic.dto";
import { CheckCompatibility } from "../dto/check-compatibility.dto";

export default class InvitationController {

    private readonly invitationService: InvitationService;

    constructor() {
        this.invitationService = new InvitationService()
    }

    public invite = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const data = request.body as InvitationDto
            const hasInvited = await this.invitationService.invite(data)
            if (hasInvited) {
                return response.status(StatusCodes.OK).send({
                    message: "invitation mail sent",
                    connectionId: hasInvited.connectionId,
                })
            }
        } catch (err) {
            next(err)
        }
    }

    public chooseTopic = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const values = request.body as ChooseTopicDto
            const question = await this.invitationService.chooseTopic(values)
            return response.status(StatusCodes.OK).send(question)
        } catch (err) {
            next(err)
        }
    }

    public checkCompatibility = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const values = request.body as CheckCompatibility
            const questioner = await this.invitationService.compatibility(values)
            return response.status(StatusCodes.OK).send({
                questioner
            })
        } catch (err) {
            next(err)
        }
    }

}