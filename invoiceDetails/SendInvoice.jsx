import React, { useState } from 'react';
import TextArea from '../hooks/TextArea';
import Input from '../hooks/Input';
import PrimaryButton from '../hooks/PrimaryButton';
import SecondaryButton from '../hooks/SecondaryButton';
import Alert from '../hooks/Alert';
import { emailRegex } from '../hooks/useRegex';
import { PlusIcon, XIcon, CheckIcon } from '@heroicons/react/solid';
import { Transition } from '@headlessui/react';
//import { sendInvoice } from '../../../apiClient/operations/invoiceOperations';

function SendInvoice({ organization, invoiceId, onCancel, email, setIsLoading }) {

    const [error, setError] = useState(null);
    const [errors, setErrors] = useState(null);
    const [additionalEmails, setAdditionalEmails] = useState([]);
    const [sentInvoice, setSentInvoice] = useState(false);

    const defaultSubject = organization ? `Factura electrónica emitida por ${organization.legal_name}` : 'Facturación FIXAT';
    const defaultBody = organization ? `Usted ha recibido el comprobante fiscal digital (Factura Electrónica) que ampara su compra a ${organization.legal_name} en formatos XML y PDF, los cuales podrá imprimir libremente e incluir en su contabilidad.` : 'Usted ha recibido el comprobante fiscal digital (Factura Electrónica) que ampara su compra en formatos XML y PDF, los cuales podrá imprimir libremente e incluir en su contabilidad.';

    const addEmail = e => {
        e.preventDefault();
        setAdditionalEmails([
            ...additionalEmails,
            { id: `additional_email_${additionalEmails.length + 1}` }
        ]);
    }

    const handleSubject = e => {
        const subject = e.target.value;
        if (!errors) return;
        if (subject == null || subject == "") {
            setErrors({ ...errors, subject: "Ingresa el asunto" });
        } else if (subject.length < 8) {
            setErrors({ ...errors, subject: "Ingresa correctamente el asunto" });
        } else {
            setErrors({ ...errors, subject: null });
        }
    }

    const handleEmail = e => {
        const email = e.target.value;
        if (!errors) return;
        if (email == null || email == "") {
            setErrors({ ...errors, email: "Ingresa el correo electrónico" });
        } else if (!emailRegex(email)) {
            setErrors({ ...errors, email: "Ingresa correctamente el correo electrónico" });
        } else {
            setErrors({ ...errors, email: null });
        }
    }

    const handleBody = e => {
        const body = e.target.value;
        if (!errors) return;
        if (body == null || body == "") {
            setErrors({ ...errors, body: "Ingresa el cuerpo" });
        } else if (body.length < 8) {
            setErrors({ ...errors, body: "Ingresa correctamente el cuerpo" });
        } else {
            setErrors({ ...errors, body: null });
        }
    }

    const onSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        const values = validateFields(e);
        if (values) {
            try {
                //await sendInvoice(organization.id, invoiceId, values.email, values.emailsToCopy, values.subject, values.body);
                setIsLoading(false);
                setSentInvoice(true);
            } catch (e) {
                setError(e.messageToUser);
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    }

    const validateFields = e => {
        setErrors(null);
        const email = e.target.elements.email.value;
        const subject = e.target.elements.subject.value;
        const body = e.target.elements.body.value;
        const inputs = e.target.elements;
        const emailsToCopy = [];
        let err = {};

        if (email == null || email == "") {
            err.email = "Ingresa el correo electrónico";
        } else if (!emailRegex(email)) {
            err.email = "Ingresa correctamente el correo electrónico";
        }

        if (subject == null || subject == "") {
            err.subject = "Ingresa el asunto";
        } else if (subject.length < 8) {
            err.subject = "Ingresa correctamente el asunto";
        }

        if (body == null || body == "") {
            err.body = "Ingresa el cuerpo";
        } else if (body.length < 8) {
            err.body = "Ingresa correctamente el cuerpo";
        }

        for (const element of inputs) {
            const inputId = element.id;
            const inputType = element.type;
            if (inputType === "email" && inputId != "email") {
                const value = element.value;
                if (value == null || value == "") continue;
                if (!emailRegex(value)) {
                    err[inputId] = "Ingresa correctamente el correo electrónico"
                } else if (value == email || emailsToCopy.includes(value)) {
                    err[inputId] = "Ingresa un correo electrónico diferente"
                } else {
                    emailsToCopy.push(value);
                }
            }
        }

        if (Object.keys(err).length === 0) {
            const values = {
                email,
                subject,
                body,
                emailsToCopy
            }
            return values;
        } else {
            setErrors(err);
            return null;
        }
    }

    return (
        <div className='w-full'>
            {!sentInvoice ? (
                <>
                    <h5 className='font-bold'>Enviar factura</h5>
                    <div className='mt-5 -mx-6 border-t-2 border-gray-300' />
                    <form className="w-full" onSubmit={onSubmit}>
                        <div className="max-h-[calc(100vh-270px)] overflow-y-auto space-y-4 -mx-6 px-6 py-5">
                            {error &&
                                <div className='mb-5 top-0 sticky z-50'>
                                    <Alert title={error} show={error != null} onClose={() => setError(null)} />
                                </div>
                            }
                            <span className='text-sm text-gray-500'>Envia tu factura de una manera muy sencilla, agregando los siguientes datos.</span>
                            <div className="mt-4 space-y-4">
                                <Input
                                    label='Correo electrónico'
                                    type='email'
                                    id='email'
                                    onChange={handleEmail}
                                    needed
                                    defaultValue={email}
                                    error={errors?.email} />
                                <Input
                                    label='Asunto'
                                    type='text'
                                    id='subject'
                                    onChange={handleSubject}
                                    defaultValue={defaultSubject}
                                    needed
                                    error={errors?.subject} />
                                <TextArea
                                    label='Cuerpo de correo'
                                    id='body'
                                    onChange={handleBody}
                                    needed
                                    defaultValue={defaultBody}
                                    rows={4}
                                    error={errors?.body}
                                    maxLength={256} />
                                {additionalEmails.map(email => (
                                    <Transition
                                        key={email.id}
                                        show={true}
                                        appear={true}
                                        enter="transition-all ease-in"
                                        enterFrom="max-h-0 opacity-0"
                                        enterTo="max-h-screen opacity-100"
                                        leave="transition-all ease-out"
                                        leaveFrom="max-h-screen opacity-100"
                                        leaveTo="max-h-0 opacity-0">
                                        <Input
                                            label='Copiar a:'
                                            type='email'
                                            id={email.id}
                                            error={errors && errors[email.id]} />
                                    </Transition>
                                ))}
                                <button
                                    type='button'
                                    onClick={addEmail}
                                    className='flex items-center cursor-pointer gap-3 text-orange font-medium'>
                                    <PlusIcon className='w-5 h-5' /> Agregar correo
                                </button>
                            </div>
                        </div>
                        <div>
                            <div className='mb-5 -mx-6 border-t-2 border-gray-300' />
                            <div className="flex justify-end gap-5">
                                <SecondaryButton
                                    type="button"
                                    onClick={() => onCancel && onCancel()}>
                                    Cancelar
                                </SecondaryButton>
                                <PrimaryButton
                                    type="submit">
                                    Enviar factura
                                </PrimaryButton>
                            </div>
                        </div>
                    </form>
                </>
            ) : (
                <>
                    <div className="absolute top-0 right-0 pt-4 pr-4 mt-2">
                        <button
                            type="button"
                            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-indigo-500"
                            onClick={() => onCancel()}>
                            <span className="sr-only">Cerrar</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className='w-full'>
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                            <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                        </div>
                        <div className="mt-3 text-center sm:mt-5">
                            <h3 className="leading-6 font-medium text-gray-900">
                                Factura enviada
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500 mx-10 lg:mx-20">
                                    Felicidades has enviado una factura desde FIXAT.
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default SendInvoice;