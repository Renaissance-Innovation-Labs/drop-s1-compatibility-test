import { io } from "socket.io-client";
import { VITE_PUBLIC_BASE_URL } from "./index";
import { toast } from "sonner";

const socket = io(`${VITE_PUBLIC_BASE_URL.replace("/api/v1/", "")}`);

export function socketInit() {
    if (!socket.connected) {
        socket.on("connect", () => {
            console.log(`Connected with id: ${socket.id}`);
        });
    }

    socket.on("disconnect", () => {
        console.log(`Disconnected from id: ${socket.id}`);
    });

    socket.on('questioner', (data) => {
        if (data?.title) {
            toast(`${data.title}`, {
                description: `${data.message}`,
                classNames: {
                    toast: "p-5 border pt-6",
                    title: "text-[16px] font-medium",
                }
            });
        }
        if (data.info) {
            if (data.info === "q-sel") {
                localStorage.setItem("question", JSON.stringify(data.questions))
                location.pathname = "/questioner"
            }
        }
        if (data.partnerDone === false) {
            location.pathname = "/done-waiting"
        }
        if (data.bothDone) {
            location.pathname = "/done"
        }
        console.log(data);
    });

    return socket;
}

export function joinQuestionerRoom(id: string) {
    socket.emit('joinRoom', id);
}

export function answerQuestion(id: string, content: unknown) {
    socket.emit('questioner', `${id}`, content);
}

export function socketDisconnect() {
    if (socket.connected) {
        socket.disconnect();
        console.log('Socket disconnected manually');
    } else {
        console.log('Socket is already disconnected');
    }
}
