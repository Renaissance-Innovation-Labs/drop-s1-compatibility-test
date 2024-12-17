import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { answerQuestion } from "@/lib/socket";
import { Button } from "@/components/ui/button";
import { CarouselApi } from "@/components/ui/carousel";
import { cn } from "../lib/utils";

export default function Questioner() {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const countState = useState(0);
    const setCount = countState[1]
    const isInviter = JSON.parse(
        localStorage.getItem("isInviter") as string
    ) as boolean;
    const [questions, setQuestion] = useState(
        JSON.parse(localStorage.getItem("question") as string) as QuestionArray
    );

    function setAnswer(question: string, answer: number) {
        setQuestion((pre) =>
            pre.map((item) => {
                if (item.question === question) {
                    if (isInviter) {
                        item.inviterAnswer = answer;
                    } else {
                        item.inviteeAnswer = answer;
                    }
                }
                return item;
            })
        );
        setTimeout(() => {
            localStorage.setItem("question", JSON.stringify(questions));
        }, 200);
        answerQuestion(localStorage.getItem("connectionId") as string, {
            isQuestion: true,
            question,
            answer,
            isInviter: isInviter ? true : false,
        });
    }

    function isDone() {
        const hasAnsweredAll = isInviter
            ? questions.every(({ inviterAnswer }) => inviterAnswer !== null)
            : questions.every(({ inviteeAnswer }) => inviteeAnswer !== null);
        return hasAnsweredAll && current == questions.length;
    }

    function onDone() {
        answerQuestion(localStorage.getItem("connectionId") as string, {
            done: isInviter ? "isInviterDone" : "isInviteeDone",
        });
    }

    useEffect(() => {
        console.log(questions);
    }, [questions]);

    useEffect(() => {
        if (!api) {
            return;
        }
        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);
    return (
        <div className="py-10 px-3">
            <div className="w-full max-w-[400px] mx-auto  column justify-center align-center">
                <Carousel
                    opts={{
                        align: "start",
                        duration: 0,
                        watchDrag: false,
                    }}
                    setApi={setApi}
                    className="w-full"
                >
                    <CarouselContent>
                        {questions.length > 0 && (
                            <>
                                {questions.map(
                                    ({
                                        choices,
                                        inviteeAnswer,
                                        inviterAnswer,
                                        question,
                                    }) => (
                                        <CarouselItem className={"pb-3"} key={question}>
                                            <div className="p-1">
                                                <p className="text-center">{question}</p>
                                                <div className="mt-10 ">
                                                    <p className="text-[14px] font-[600]">
                                                        Choose one that applies
                                                    </p>
                                                    <div className="grid gap-2 mt-2">
                                                        {choices.map(({ name }, index) => (
                                                            <div
                                                                onClick={() => {
                                                                    setAnswer(question, index);
                                                                }}
                                                                className={cn(
                                                                    "border text-[14px] font-[500] mb-2 border-neutral-500 p-3 rounded-[5px] ",
                                                                    `${isInviter &&
                                                                        inviterAnswer !== null &&
                                                                        inviterAnswer == index
                                                                        ? " bg-neutral-200 "
                                                                        : ""
                                                                    }`,
                                                                    `${!isInviter &&
                                                                        inviteeAnswer !== null &&
                                                                        inviteeAnswer == index
                                                                        ? " bg-neutral-200 "
                                                                        : ""
                                                                    }`
                                                                )}
                                                            >
                                                                {name}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </CarouselItem>
                                    )
                                )}
                            </>
                        )}
                    </CarouselContent>
                    {/* <CarouselPrevious />
                    <CarouselNext /> */}
                </Carousel>
                <div className="flex items-center justify-center gap-3">
                    {current !== 1 && (
                        <Button
                            onClick={() => api?.scrollPrev()}
                            className="rounded-[50px]  "
                        >
                            {"<"}
                        </Button>
                    )}
                    {isDone() ? (
                        <Button
                            onClick={() => {
                                onDone();
                            }}
                            className="w-full bg-[#142E35] hover:bg-[#142E35]"
                        >
                            View Result
                        </Button>
                    ) : (
                        <Button
                            onClick={() => {
                                api?.scrollNext();
                            }}
                            className="w-full"
                        >
                            Next Question
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
