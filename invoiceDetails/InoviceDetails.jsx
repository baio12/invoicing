import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { MailIcon, DocumentDownloadIcon, EmojiSadIcon } from '@heroicons/react/solid';
import Table from '../hooks/Table';
import useFormatterCurrency from '../hooks/useFormatterCurrency';
import PrimaryButton from '../hooks/PrimaryButton';
import SecondaryButton from '../hooks/SecondaryButton';
import Modal from '../hooks/Modal';
import SendInvoice from './SendInvoice';
import Loader from '../hooks/Loader';
import SkeletonLoader from '../hooks/SkeletonLoader';
import Alert from '../hooks/Alert';
//import { getInvoice } from '../../../apiClient/operations/invoiceOperations';
import useS3 from '../hooks/useS3';
import { stringToDate, dateFormatter } from '../hooks/useFormatDate';
import EmptyState from '../hooks/EmptyState';
import TotalInvoice from '../createInvoice/TotalInvoice';
import { useRouter } from 'next/router';

const tableColumns = [
    { heading: 'Clave P/S', value: 'product.key', mobile_value: 'product.key,product.name', description: 'product.name' },
    { heading: 'Concepto', value: 'description' },
    { heading: 'Unidad de medida', value: 'unit.key', mobile_value: 'unit.key,unit.name', description: 'unit.name' },
    { heading: 'Cantidad', value: 'quantity' },
    { heading: 'Valor unitario', value: 'price_formatted' },
    { heading: 'Subtotal', value: 'total_formatted' }
]

function InvoiceDetails({ user, invoiceId }) {
    const router = useRouter();
    const [openSendInvoiceModal, setOpenSendInvoiceModal] = useState(false);
    const [invoice, setInvoice] = useState(null);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const formatterCurrencyRef = useRef(useFormatterCurrency);
    const [error, setError] = useState(null);
    const { downloadFile } = useS3();

    /*useEffect(() => {
        const getInvoiceData = async () => {
            setIsLoadingData(true);
            try {
                const res = await getInvoice(user?.organizationId, invoiceId);
                setTimeout(() => {
                    setInvoice(res);
                    setIsLoadingData(false);
                }, 1000);
            } catch (e) {
                setIsLoadingData(false);
            }
        }

        getInvoiceData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [invoiceId]);*/

    useEffect(() => {
        if (!invoice) return;
        let products = invoice.products;
        setProducts(products.map(product => {
            return {
                ...product,
                price_formatted: `${formatterCurrencyRef.current(product.price / 100)} MXN`,
                total_formatted: `${formatterCurrencyRef.current(product.total / 100)} MXN`
            }
        }))
    }, [invoice]);

    const handleDownloadInvoice = async (file, retries = 4) => {
        if (!file) return;
        setError(null);
        setIsLoading(true);
        try {
            const fileName = file.key.split('/').pop();
            await downloadFile(file.bucket, file.key, fileName);
            setIsLoading(false);
        } catch (e) {
            if (retries <= 0) {
                setError(e.messageToUser);
                setIsLoading(false);
            } else {
                await new Promise(resolve => setTimeout(resolve, 1000));
                handleDownloadInvoice(file, retries - 1);
            }
        }
    }

    return (
        <>
            <Loader show={isLoading} />
            <div className='min-h-[calc(100vh-4rem)] h-full bg-gray-200/70 px-4 lg:px-9 pt-6 pb-24 lg:pb-10'>
                {error &&
                    <div className='mb-5 top-[5.5rem] sticky z-50'>
                        <Alert title={error} show={error != null} onClose={() => setError(null)} />
                    </div>
                }
                <div className='flex justify-between'>
                    <h2 className='text-3xl font-bold text-gray-900'>
                        Detalles de factura
                    </h2>
                    {invoice && (
                        <div className='hidden lg:flex gap-3'>
                            <SecondaryButton
                                onClick={() => setOpenSendInvoiceModal(true)}>
                                <MailIcon className='-ml-1 mr-3 h-5 w-5' />
                                <span className='xl:hidden'>Enviar</span>
                                <span className='hidden xl:block'>Enviar por correo</span>
                            </SecondaryButton>
                            <PrimaryButton onClick={() => handleDownloadInvoice(invoice?.documents?.zip)}>
                                <DocumentDownloadIcon className='-ml-1 mr-3 h-5 w-5' />
                                <span className='xl:hidden'>Descargar</span>
                                <span className='hidden xl:block'>Descargar factura</span>
                            </PrimaryButton>
                        </div>
                    )}
                </div>
                <div className='w-full rounded-md bg-white px-5 lg:px-9 py-7 mt-4 overflow-hidden'>
                    {!isLoadingData && !invoice ? (
                        <div className="text-center">
                            <EmptyState icon={<EmojiSadIcon className='w-12 h-12' />} title='¡Ha ocurrido un error!' message='Ocurrió un error al obtener tu factura. No te preocupes, inténtalo más tarde.' />
                        </div>
                    ) : (
                        <>
                            <div className='w-full flex flex-col lg:flex-row gap-4 justify-between lg:items-center pb-6 border-b border-gray-border'>
                                <div className='relative h-14 w-full lg:w-1/3 flex justify-center'>
                                    {isLoadingData ? (
                                        <div className='animate-pulse bg-gray-300 w-full h-full' />
                                    ) : (
                                        <>
                                            {invoice?.organization?.logo_url ? (
                                                <Image
                                                    src={invoice.organization.logo_url}
                                                    objectPosition="left"
                                                    objectFit='contain'
                                                    layout='fill'
                                                    alt='Logo'
                                                    priority
                                                />
                                            ) : (
                                                <Image
                                                    src='https://cdn.fixat.mx/intranet/fxt_logo@2x.png'
                                                    objectPosition="left"
                                                    objectFit='contain'
                                                    layout='fill'
                                                    alt='Logo fixat'
                                                    priority
                                                />
                                            )}
                                        </>
                                    )}
                                </div>
                                {invoice ? (
                                    <h5 className='text-left lg:text-right font-bold'>
                                        Folio
                                        <span className='block lg:inline font-normal text-base lg:text-xl lg:ml-1'>
                                            {invoice?.series || ''}{invoice?.folio}
                                        </span>
                                    </h5>
                                ) : (
                                    <div className='w-1/3'>
                                        <SkeletonLoader />
                                    </div>
                                )}
                            </div>
                            <div className='w-full flex flex-col lg:flex-row gap-x-4 justify-between mt-6 pb-6 border-b border-gray-border space-y-2 lg:space-y-0'>
                                <div className='lg:w-1/2 text-sm lg:space-y-1 space-y-2'>
                                    <div className="lg:mb-1">
                                        <dt className="text-gray-500">Folio fiscal:</dt>
                                        <dd className="text-gray-900">{invoice?.stamp?.uuid || <SkeletonLoader />}</dd>
                                    </div>
                                    <div className="lg:mb-1">
                                        <dt className="text-gray-500">Serie del CSD:</dt>
                                        <dd className="text-gray-900">{invoice?.stamp?.sat_cert_number || <SkeletonLoader />}</dd>
                                    </div>
                                </div>
                                <div className='lg:w-1/2 text-sm lg:space-y-1 space-y-2'>
                                    <div className="lg:mb-1">
                                        <dt className="text-gray-500">Fecha, hora de emisión:</dt>
                                        <dd className="text-gray-900">
                                            {invoice?.stamp?.date ? dateFormatter(stringToDate(invoice.stamp.date, 'YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss') : <SkeletonLoader />}
                                        </dd>
                                    </div>
                                    <div className="lg:mb-1">
                                        <dt className="text-gray-500">Efecto de comprobante:</dt>
                                        <dd className="text-gray-900">{invoice?.type == "I" ? 'Ingreso' : <SkeletonLoader />}</dd>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full mt-6 pb-6 flex flex-col lg:flex-row gap-6 lg:gap-4 border-b border-gray-border'>
                                <div className='lg:w-1/2 border-b lg:border-b-0 border-gray-border pb-6 lg:pb-0'>
                                    <h5 className='font-bold'>
                                        Datos del emisor
                                    </h5>
                                    <div className='text-sm mt-2 space-y-2 lg:space-y-1'>
                                        <div className="sm:gap-4">
                                            <dt className="text-gray-500">Nombre o razón social:</dt>
                                            <dd className="text-gray-900 sm:mt-0">{invoice?.organization?.legal_name || <SkeletonLoader />}</dd>
                                        </div>
                                        <div className="sm:gap-4">
                                            <dt className="text-gray-500">Régimen fiscal:</dt>
                                            <dd className="text-gray-900 sm:mt-0">{invoice?.organization?.tax_system?.name || <SkeletonLoader />}</dd>
                                        </div>
                                        <div className="sm:gap-4">
                                            <dt className="text-gray-500">RFC:</dt>
                                            <dd className="text-sm text-gray-900 sm:mt-0">{invoice?.organization?.tax_id || <SkeletonLoader />}</dd>
                                        </div>
                                        <div className="sm:gap-4">
                                            <dt className="text-gray-500">Código postal:</dt>
                                            <dd className="text-gray-900 sm:mt-0">{invoice?.organization?.address?.zip || <SkeletonLoader />}</dd>
                                        </div>
                                    </div>
                                </div>
                                <div className='lg:w-1/2'>
                                    <h5 className='font-bold'>
                                        Datos del cliente
                                    </h5>
                                    <div className='text-sm mt-2 space-y-2 lg:space-y-1'>
                                        <div className="sm:gap-4">
                                            <dt className="text-gray-500">Nombre o razón social:</dt>
                                            <dd className="text-gray-900 sm:mt-0">{invoice?.customer?.legal_name || <SkeletonLoader />}</dd>
                                        </div>
                                        <div className="sm:gap-4">
                                            <dt className="text-gray-500">Régimen fiscal:</dt>
                                            <dd className="text-gray-900 sm:mt-0">{invoice?.customer?.tax_system?.name || <SkeletonLoader />}</dd>
                                        </div>
                                        <div className="sm:gap-4">
                                            <dt className="text-gray-500">RFC:</dt>
                                            <dd className="text-sm text-gray-900 sm:mt-0">{invoice?.customer?.tax_id || <SkeletonLoader />}</dd>
                                        </div>
                                        <div className="sm:gap-4">
                                            <dt className="text-gray-500">Correo electrónico:</dt>
                                            <dd className="text-gray-900 sm:mt-0">{invoice?.customer?.email || <SkeletonLoader />}</dd>
                                        </div>
                                        <div className="sm:gap-4">
                                            <dt className="text-gray-500">Código postal:</dt>
                                            <dd className="text-gray-900 sm:mt-0">{invoice?.customer?.address?.zip || <SkeletonLoader />}</dd>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full mt-6 pb-6 border-b border-gray-border'>
                                <h5 className='font-bold'>
                                    Pago de factura
                                </h5>
                                <div className='text-sm mt-2 space-y-2 lg:space-y-1'>
                                    <div className="sm:gap-4">
                                        <dt className="text-gray-500">Uso de CFDI:</dt>
                                        <dd className="text-gray-900 sm:mt-0 lg:col-span-3 xl:col-span-5">{invoice?.use?.name || <SkeletonLoader />}</dd>
                                    </div>
                                    <div className="sm:gap-4">
                                        <dt className="text-gray-500">Método de Pago:</dt>
                                        <dd className="text-gray-900 sm:mt-0 lg:col-span-3 xl:col-span-5">{invoice?.payment_form?.name || <SkeletonLoader />}</dd>
                                    </div>
                                    <div className="sm:gap-4">
                                        <dt className="text-gray-500">Forma de pago:</dt>
                                        <dd className="sm:gap-4">{invoice?.payment_method?.name || <SkeletonLoader />}</dd>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full mt-6'>
                                <h5 className='font-bold'>
                                    Productos / Servicios
                                </h5>
                                <div className='w-full'>
                                    <div className='w-full mt-2'>
                                        <div className='-mx-5 lg:mx-0'>
                                            <Table title="Productos o servicios agregados" columns={tableColumns} data={products} isLoadingData={invoice == null} />
                                        </div>
                                        <div className='-mx-5 -mb-7 lg:mb-0 lg:mx-0 mt-5 lg:flex lg:justify-end'>
                                            <div className='w-full lg:w-7/12 lg:min-w-0'>
                                                {invoice ?
                                                    <TotalInvoice
                                                        subtotal={invoice.totals.subtotal / 100}
                                                        total={invoice.totals.total / 100}
                                                        taxes={invoice.totals.taxes}
                                                        editable={false} />
                                                    :
                                                    <SkeletonLoader />
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='w-full mb-2 mt-8 flex justify-end'>
                                    <div className='w-full block lg:flex justify-end gap-4'>
                                        <div className='w-full lg:w-auto mt-8 lg:mt-0'>
                                            <SecondaryButton onClick={() => router.push('/dashboard')} isFullWidth={true}>
                                                Ir al inicio
                                            </SecondaryButton>
                                        </div>
                                        <div className='mt-6 lg:mt-0 w-full lg:w-auto'>
                                            <PrimaryButton onClick={() => router.push('/facturacion/crear')} isFullWidth={true}>
                                                Crear otra factura
                                            </PrimaryButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                {invoice && (
                    <div className='mt-7 lg:hidden p-4 fixed bottom-0 left-0 md:left-64 right-0 border-t border-gray-border bg-white rounded-t-md'>
                        <div className='w-full flex gap-3'>
                            <SecondaryButton
                                isFullWidth
                                onClick={() => setOpenSendInvoiceModal(true)}>
                                <MailIcon className='-ml-1 mr-2 h-5 w-5' />
                                Enviar
                            </SecondaryButton>
                            <PrimaryButton
                                onClick={() => handleDownloadInvoice(invoice?.documents?.zip)}
                                isFullWidth>
                                <DocumentDownloadIcon className='-ml-1 mr-2 h-5 w-5' />
                                Descargar
                            </PrimaryButton>
                        </div>
                    </div>
                )}
            </div>
            <Modal open={openSendInvoiceModal} setOpen={setOpenSendInvoiceModal} className='w-full sm:max-w-[30rem]'>
                <SendInvoice
                    onCancel={() => setOpenSendInvoiceModal(false)}
                    organization={invoice?.organization}
                    invoiceId={invoice?.id}
                    email={invoice?.customer?.email}
                    setIsLoading={setIsLoading} />
            </Modal>
        </>
    )
}

export default InvoiceDetails;