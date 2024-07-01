import { IncomingMessage, Server, ServerResponse } from "http";
import { Server as SocketServer } from "socket.io";
import { FRONTEND_URL } from "../config";
import QuestionerModel from "../model/invitation.model";

export default async function createSocket(
    server: Server<typeof IncomingMessage, typeof ServerResponse>
) {
    const questionerModel = QuestionerModel;
    const io = new SocketServer(server, {
        cors: {
            origin: FRONTEND_URL,
        },
    });

    io.on("connection", async (socket) => {
        socket.on("questioner", async (questionerId: string, content: any) => {
            const info = content;
            const questioner = await questionerModel.findOne({
                connectionId: questionerId,
            });
            if (questioner) {
                if (info.hasAccepted) {
                    if (!questioner.hasAccepted) {
                        questioner.hasAccepted = true;
                        // questioner.questions = baseQuestion
                        const saved = await questioner?.save();
                        if (saved) {
                            socket.broadcast.to(questionerId).emit("questioner", {
                                title: "Invitation accepted",
                                message: "Your partner has accepted your invitation",
                                hasAccepted: true,
                            });
                        }
                    }
                    if (questioner?.questions.length == 0) {
                        socket.emit("questioner", {
                            title: "Questions not selected",
                            message:
                                "Kindly wait while wait while your partner setup the questions",
                        });
                    } else {
                        socket.emit("questioner", {
                            info: "q-sel",
                            questions: questioner.questions,
                        });
                    }
                }

                if (info.info) {
                    socket.broadcast.to(questionerId).emit("questioner", {
                        info: info.info,
                        questions: questioner.questions,
                    });
                }

                if (info.isQuestion) {
                    const { question, answer, isInviter } = info;
                    const questionUpdate = questioner.questions.map((item) => {
                        if (item.question === question) {
                            if (isInviter) {
                                item.inviterAnswer = answer;
                            } else {
                                item.inviteeAnswer = answer;
                            }
                        }
                        return item;
                    });

                    const isSaved = await questioner.updateOne({
                        questions: questionUpdate,
                    });
                    if (isSaved) {
                        socket.broadcast.to(questionerId).emit("questioner", info);
                    }
                }

                if (info.title) {
                    socket.broadcast.to(questionerId).emit("questioner", info);
                }

                if (info.done) {
                    const isSaved = await questionerModel.findOneAndUpdate(
                        { connectionId: questionerId },
                        { $set: { [info.done]: true } },
                        { new: true }
                    );
                    if (isSaved) {
                        if (isSaved.isInviterDone && isSaved.isInviteeDone) {
                            socket.emit("questioner", { bothDone: true });
                            socket.broadcast
                                .to(questionerId)
                                .emit("questioner", { bothDone: true });
                        } else {
                            socket.emit("questioner", {
                                partnerDone: false,
                            });
                        }
                    }
                }
            }
        });

        socket.on("joinRoom", (roomId: string) => {
            socket.join(roomId);
            console.log(`User joined room: ${roomId}`);
        });

        socket.on("leaveRoom", (roomId: string) => {
            socket.leave(roomId);
            console.log(`User left room: ${roomId}`);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
}
