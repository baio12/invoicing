import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import Emmiter from './Emmiter';
import Client from './Client';
import Receipt from './Receipt';
import { ReceiptTaxIcon, CurrencyDollarIcon, CheckIcon } from '@heroicons/react/solid';
import ProductOrServices from './ProductOrServices';
import TotalInvoice from './TotalInvoice';
import Modal from '../hooks/Modal';
import Loader from '../hooks/Loader';
import PrimaryButton from '../hooks/PrimaryButton';
import SecondaryButton from '../hooks/SecondaryButton';
import Alert from '../hooks/Alert';
//import { getProducts } from '../../../apiClient/operations/products';
//import { getOrganization } from '../../../apiClient/operations/organizationOperations';
//import { createInvoice } from '../../../apiClient/operations/invoiceOperations';

function CreateInvoice() {
    let user = {}
    const router = useRouter();
    const [organization, setOrganization] = useState(null);
    const [catalog, setCatalog] = useState([]);
    const [client, setClient] = useState(null);
    const [receipt, setReceipt] = useState(null);
    const [products, setProducts] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [openConfrimModal, setOpenConfirmModal] = useState(false);
    const [invoice, setInvoice] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [taxes, setTaxes] = useState(null);
    const [generalError, setGeneralError] = useState(null);

    /*const getOrg = async () => {
        try {
            const organization = await getOrganization(user.organizationId, user.id);
            setOrganization(organization);
        } catch (e) {
            setGeneralError(e.messageToUser);
        }
    }

    const getCatalog = async () => {
        try {
            const res = await getProducts(user?.organizationId);
            setCatalog(res?.data?.products);
        } catch (e) {
            setGeneralError(e.messageToUser);
        }
    }

    useEffect(() => {
        getCatalog();
        getOrg();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);*/

    const mixedProducts = () => {
        const taxesList = taxes?.map(item => {
            const { type, rate, name, withholding } = item;
            return {
                type,
                rate,
                name,
                withholding
            }
        });
        const productsList = products.map(item => {
            const {
                id,
                description,
                product,
                price,
                unit,
                quantity,
                total
            } = item;
            return {
                ...(id && {
                    id: id,
                }),
                description,
                product,
                price,
                tax_included: "false",
                taxability: "02",
                taxes: taxesList,
                local_taxes: taxesList,
                unit,
                quantity,
                total,
                discount: 0
            }
        });
        return productsList;
    }

    const create = async e => {
        e.preventDefault();
        setGeneralError(null);
        setOpenConfirmModal(false);
        setTimeout(async () => {
            setIsLoading(true);
            const products = mixedProducts();
            const { cfdi, paymentType, paymentMethod, series } = receipt;
            try {
                //const invoice = await createInvoice(user?.organizationId, client.id, products, paymentType, paymentMethod, cfdi, series);
                setIsLoading(false);
                setInvoice(invoice);
            } catch (e) {
                setIsLoading(false);
                setGeneralError(e.messageToUser);
            }
        }, 300);
    }

    useEffect(() => {
        setDisabled(
            organization == null ||
            client == null ||
            receipt == null ||
            products == null || products.length == 0 ||
            taxes == null || !taxes.some(tax => !tax.withholding)
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client, receipt, products, taxes]);

    return (
        <>
            <Loader show={isLoading} title='Facturando...'/>
            <div className='h-full bg-gray-200/70 px-4 lg:px-9 pt-6 pb-20 lg:pb-24'>
                {generalError &&
                    <div className='mb-5 top-[5.5rem] sticky z-50'>
                        <Alert type="Error" show={generalError != null} title={generalError} onClose={() => setGeneralError(null)} />
                    </div>
                }
                <h2 className='text-3xl font-bold text-gray-900'>
                    Crear nueva factura
                </h2>
                <div className='mt-1 block lg:flex items-center gap-7 mb-4 text-gray-500 font-medium text-sm'>
                    <div className='flex items-center gap-2'>
                        <CurrencyDollarIcon className='w-5 h-5 text-gray-400' /> Moneda: Peso mexicano
                    </div>
                    <div className='flex items-center gap-2'>
                        <ReceiptTaxIcon className='w-5 h-5 text-gray-400' /> Tipo de factura: Ingreso
                    </div>
                </div>
                <div className='w-full rounded-md bg-white px-5 lg:px-9 py-7'>
                    <Emmiter organization={organization} />
                    <Client user={user} setClient={setClient} />
                    <Receipt setReceipt={setReceipt} />
                    <ProductOrServices taxSystemId={organization?.tax_system?.id} setSelectedProducts={setProducts} catalog={catalog} />
                    {products && products.length > 0 && (
                        <div className='-mx-5 lg:mx-0 lg:mt-5 lg:flex lg:justify-end'>
                            <div className='w-full lg:w-7/12 lg:min-w-0'>
                                <TotalInvoice products={products} setTaxes={setTaxes} taxSystemId={organization?.tax_system?.id} />
                            </div>
                        </div>
                    )}
                    <div className='w-full flex justify-end mt-10 lg:mt-12'>
                        <div className='w-full lg:w-1/3'>
                            <PrimaryButton
                                isFullWidth
                                disabled={disabled}
                                onClick={() => setOpenConfirmModal(true)}>
                                Generar factura
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </div>
            <Modal open={openConfrimModal} setOpen={setOpenConfirmModal} className="w-full sm:w-auto">
                <div className='sm:max-w-sm sm:w-full'>
                    <div className="text-center">
                        <h3 className="leading-6 font-medium text-gray-900">
                            ¿Listo para facturar?
                        </h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                Las facturas no se pueden editar o cancelar una vez creadas.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-5 sm:mt-6 space-y-5">
                    <PrimaryButton
                        type="button"
                        isFullWidth
                        onClick={create}>
                        Sí, facturar
                    </PrimaryButton>
                    <SecondaryButton
                        isFullWidth
                        onClick={() => setOpenConfirmModal(false)}>
                        Cerrar
                    </SecondaryButton>
                </div>
            </Modal>
            <Modal open={invoice != null} setOpen={() => router.reload('/facturacion/crear')} className="w-full sm:w-auto">
                <div className='sm:max-w-sm sm:w-full'>
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                        <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                        <h3 className="leading-6 font-medium text-gray-900">
                            Factura generada
                        </h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500 mx-10 lg:mx-20">
                                Felicidades has generado una factura desde FIXAT.
                            </p>
                        </div>
                    </div>
                    <div className="mt-5 sm:mt-6 space-y-5">
                        <button
                            type="button"
                            className="bg-emerald-600 hover:bg-emerald-700 w-full transition-all inline-flex items-center justify-center px-4 py-2 border border-transparent text-white shadow-sm text-base font-medium rounded-md"
                            onClick={() => router.push(`/facturacion/${invoice.id}`)}>
                            Consultar factura
                        </button>
                        <SecondaryButton
                            type="button"
                            isFullWidth
                            onClick={() => router.reload('/facturacion/crear')}>
                            Hacer otra factura
                        </SecondaryButton>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default CreateInvoice