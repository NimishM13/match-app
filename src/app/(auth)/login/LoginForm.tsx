"use client";

import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Input,
} from "@nextui-org/react";
import React from "react";
import { GiPadlock } from "react-icons/gi";
import { useForm } from "react-hook-form";
import {
    loginSchema,
    LoginSchema,
} from "@/lib/schemas/LoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "react-toastify";
import Link from "next/link";
// import SocialLogin from "./SocialLogin";

export default function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { isValid, errors },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
        },
    });
     
    const onSubmit = async (data: LoginSchema) => {
        console.log({ data })
        // const result = await signInUser(data);
        // if (result.status === "success") {
        //   router.push("/members");
        //   router.refresh();
        // } else {
        //   toast.error(result.error as string);
        // }
    };

    return (
        <Card className="w-3/5 mx-auto">
            <CardHeader className="flex flex-col items-center justify-center">
                <div className="flex flex-col gap-2 items-center text-default">
                    <div className="flex flex-row items-center gap-3">
                        <GiPadlock size={30} />
                        <h1 className="text-3xl font-semibold">
                            Login
                        </h1>
                    </div>
                    <p className="text-neutral-500">
                        Welcome back to MatchMe!
                    </p>
                </div>
            </CardHeader>
            <CardBody>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <Input
                            defaultValue=""
                            label="Email"
                            variant="bordered"
                            {...register("email")}
                            isInvalid={!!errors.email}
                            errorMessage={
                                errors.email?.message as string
                            }
                        />
                        <Input
                            defaultValue=""
                            label="Password"
                            variant="bordered"
                            type="password"
                            {...register("password")}
                            isInvalid={!!errors.password}
                            errorMessage={
                                errors.password?.message as string
                            }
                        />
                        <Button
                            fullWidth
                            color="default"
                            type="submit"
                            isDisabled={!isValid}
                        >
                            Login
                        </Button>
                        {/* <SocialLogin /> */}
                        <div className="flex justify-center hover:underline text-sm">
                            <Link href="/forgot-password">
                                Forgot password?
                            </Link>
                        </div>
                    </div>
                </form>
            </CardBody>
        </Card>
    );
}