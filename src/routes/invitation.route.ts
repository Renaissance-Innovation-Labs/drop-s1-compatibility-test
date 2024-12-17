import { Router } from "express";
import IRoute from "../interfaces/route.interface";
import InvitationController from "../controllers/invitation.controller";
import { InvitationDto } from "../dto/invitation.dto";
import dtoValidationMiddleware from "../middlewares/dto.validator.middleware";
import { ChooseTopicDto } from "../dto/choose-topic.dto";
import { CheckCompatibility } from "../dto/check-compatibility.dto";

class InvitationRoute implements IRoute {
    public path: string = "/invitation"
    public router: Router = Router()
    public controller: InvitationController = new InvitationController()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.post(this.path, dtoValidationMiddleware(InvitationDto, "body", "missing parameters"), this.controller.invite)
        this.router.post(`${this.path}/topic`, dtoValidationMiddleware(ChooseTopicDto, "body", "missing parameters"), this.controller.chooseTopic)
        this.router.post(`${this.path}/check`, dtoValidationMiddleware(CheckCompatibility, "body", "missing parameters"), this.controller.checkCompatibility)

    }
}

export default InvitationRoute