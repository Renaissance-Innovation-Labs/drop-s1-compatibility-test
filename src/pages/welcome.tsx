import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { welcomeMailRequest } from "../api";
import { toast } from "sonner";
import { useState } from "react";
import { joinQuestionerRoom } from "../lib/socket";


const formSchema = z.object({
  inviter: z.string().min(2, {
    message: "Your name is required",
  }),
  invitee: z.string().min(2, {
    message: "Invitee name is required",
  }),
  personToInviter: z.string().min(2, {
    message: "This field is required",
  }),
  inviteeEmail: z.string().email({
    message: "Email is required",
  }),
  howOften: z.string().optional(),
});

export default function Welcome() {
  const navigate = useNavigate();
  const [hideToast, setHideToast] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inviter: "",
      invitee: "",
      personToInviter: "",
      inviteeEmail: "",
    },
  });

  const welcomeRequestMutation = useMutation({
    mutationFn: welcomeMailRequest,
    onSuccess: (data) => {
      console.log(data)
      setHideToast(true)
      navigate("/invite-sent")
      joinQuestionerRoom(data.connectionId)
      localStorage.setItem("connectionId", data.connectionId)
      localStorage.setItem("isInviter", JSON.stringify(true))

    },
    onError: (error) => {
      console.log(error);
      toast(`Something went wrong`, {
        description: "We're resolving the issue",
        action: {
          label: "Try again",
          onClick: () => console.log(error),
        },
        closeButton: true,
        classNames: {
          toast: "p-5 border pt-8",
          title: "text-red-500 text-[16px] font-medium",
          closeButton: "top-[5px] scale-[1.2] left-[15px] text-[25px] ",
        },
      });
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast(`Sending invitation`, {
      description: "Your partner will receive an invitation mail to join the test",
      classNames: {
        toast: "p-5 border pt-6",
        title: "text-[16px] font-medium",
      },
      style: {
        display: hideToast ? "none !important" : "initial"
      },

    });
    welcomeRequestMutation.mutate(values)
  }

  return (
    <div className="py-10">
      <div className="text-center p-5">
        <h1 className="font-[900] text-[25px]">Welcome</h1>
        <p>Please fill the required personalized questions</p>
      </div>

      <div className="w-[400px] mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="inviter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What is your Name?</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="invitee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What is your Partner’s name?</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter partner’s here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="personToInviter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Who is this person to you?</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g Wife" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="howOften"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Do you often see this person?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="often" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Yes, I often see them
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="not-often" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          No, I see them once a while
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="none" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          No, I have not them before
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inviteeEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Please enter their email address to send an invite
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter partner’s email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full mt-4" type="submit">
              Continue
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
