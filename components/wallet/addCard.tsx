"use client";
import { useRouter } from "next/navigation";
import styles from "@/components/Button/style.module.css";
import FormInput, { mapFormikProps } from "@/components/FormInput";
import CustomButton from "@/components/Button";
import BackBtn from "@/components/BackBtn";
import { Eye, EyeSlash, Password, WarningGreen } from "@/components/Svgs";
import "react-phone-input-2/lib/style.css";
import { useFormik } from "formik";
import * as yup from "yup";
import { useState } from "react";
import {Notification} from "@/components/Tag";
import { useDisclosure } from "@nextui-org/react";
import { VerificationCodeModal } from "@/components/Modal";
import Header from "@/components/Header";

const AddCard = () => {
    const [confirmPassword, setConfirmPassword] = useState(true);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const router = useRouter();
    const onSubmit = (data: any) => {};

    const registerForm = useFormik({
        initialValues: {
            cardNumber: "",
            expiry: "",
            cvv: "",
            cardPin: "",
        },
        enableReinitialize: true,
        onSubmit,
        validateOnChange: true,
        validationSchema: yup.object().shape({
            cardNumber: yup.string().required("card number is required"),
            cardPin: yup.string().required("card pin is required"),
            expiry: yup.string().required("expiry field is mandatory"),
            cvv: yup.string().required("cvv field is mandatory"),
        }),
    });

    return (
        <div className='brane-container h-full'>
            <Header handleBackPress={() => router.back()}/>
            <div>
                <div className='mb-6'>
                    <Notification bg='#A90109' bRadius='12px' p='15px 16px' h='66px'>
                        <p className='text-white'>
                            Unable to add card. Please enter the correct card number.
                        </p>
                    </Notification>
                    <h1 className='text-black-500 text-[20px] font-bold leading-medium'>
                        Add Your Card
                    </h1>
                    <p className='text-small leading-normal font-normal mt-2'>
                        Add your card for easy transactions and convenience. Add your card
                        securely now.
                    </p>
                </div>
                <div className='flex flex-col gap-[24px]'>
                    <form
                        onSubmit={registerForm.handleSubmit}
                        className='flex flex-col gap-[16px]'
                        autoComplete='off'
                    >
                        <>
                            <FormInput
                                label={"Card Number"}
                                placeholder='0000 0000 0000 0000'
                                error={registerForm.errors.cardNumber}
                                {...mapFormikProps("cardNumber", registerForm)}
                            />
                            <FormInput
                                label={"Expiry Date"}
                                placeholder='01/24'
                                error={registerForm.errors.expiry}
                                {...mapFormikProps("expiry", registerForm)}
                            />

                            <div className='mb-2'>
                                <FormInput
                                    label={"CVV (3 digits)"}
                                    placeholder='123'
                                    error={registerForm.errors.cvv}
                                    {...mapFormikProps("cvv", registerForm)}
                                />
                                <div className='flex flex-row gap-2 mt-[-12px]'>
                                    <WarningGreen />
                                    <p className='text-[#013D25]'>
                                        {" "}
                                        This is the 3 digit number behind your debit card.
                                    </p>
                                </div>
                            </div>
                            <FormInput
                                label={"Card Pin"}
                                placeholder='Enter card PIN'
                                rightContent={confirmPassword ? <Eye /> : <EyeSlash />}
                                rightClick={() => setConfirmPassword(!confirmPassword)}
                                type={confirmPassword ? "password" : "text"}
                                error={registerForm.errors.cardPin}
                                {...mapFormikProps("cardPin", registerForm)}
                            />
                            <div className='mt-12 flex flex-col items-center'>
                                <div className='flex flex-row gap-1 items-center justify-center mb-4'>
                                    <Password />
                                    <p>Secured by</p>
                                    <p className='text-[#013D25] font-[600]'>Providers name</p>
                                </div>
                                <CustomButton
                                    aria-label='Register'
                                    className={`${
                                        !registerForm.isValid ? "bg-[#AABEB6]" : "bg-[#013D25]"
                                    } ${
                                        styles.btn
                                    } text-[#D2F1E4] mx-auto w-[420px] rounded-xl h-[50px]`}
                                    title='Verify Card'
                                    type='submit'
                                    disabled={!registerForm.isValid}
                                    onClick={onOpen}
                                />
                            </div>
                        </>
                    </form>
                </div>
            </div>
            <VerificationCodeModal isOpen={isOpen} onOpenChange={onOpenChange} />
        </div>
    );
};

export default AddCard;
