import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { PlusIcon, DocumentTextIcon, SearchIcon } from '@heroicons/react/solid';
import PrimaryButton from './hooks/PrimaryButton';
import EmptyState from './hooks/EmptyState';
import Input from './hooks/Input';
import Table from './hooks/Table';
import Pagination from './hooks/Pagination';
import Alert from './hooks/Alert';
//import { getInvoices } from '../../apiClient/operations/invoiceOperations';
//import { dateFormatter } from './hooks/useFormatDate';
import useScrollPosition from './hooks/useScrollPosition';
import usePagination from './hooks/usePagination';
import useFormatterCurrency from './hooks/useFormatterCurrency';
import useS3 from './hooks/useS3';
import Loader from './hooks/Loader';

const tableColumns = [
    { heading: 'Fecha', value: 'short_date' },
    { heading: 'Folio', value: 'custom_folio' },
    { heading: 'Folio fiscal', value: 'stamp.uuid' },
    { heading: 'Nombre o razón social', value: 'customer.legal_name' },
    { heading: 'RFC', value: 'customer.tax_id' },
    { heading: 'Monto', value: 'formatted_total' }
]

const itemsLimitInTable = 20;

function Invoices({ user }) {

    const router = useRouter();
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrenPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [error, setError] = useState(null);
    const [invoicesList, setInvoicesList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const setScrollPosition = useScrollPosition();
    const paginate = usePagination();
    const formatterCurrencyRef = useRef(useFormatterCurrency);
    const { downloadFile } = useS3();

    /*useEffect(() => {
        const getInvoiceList = async (limit, page) => {
            setIsLoadingData(true);
            setScrollPosition(0);
            try {
                const res = await getInvoices(user?.organizationId, limit, page);
                let invoices = res.data.invoices.map(invoice => {
                    return {
                        ...invoice,
                        custom_folio: `${invoice.series || ''}${invoice.folio}`,
                        formatted_date: dateFormatter(invoice.created_at, 'DD MMMM YYYY'),
                        short_date: dateFormatter(invoice.created_at, 'DD-MM-YYYY'),
                        formatted_total: `${formatterCurrencyRef.current(invoice.totals?.total / 100)}  MXN`
                    }
                })
                setInvoices(invoices);
                setPagination(paginate(res.total_items, itemsLimitInTable, res.total_pages,));
                setIsLoadingData(false);
            } catch (e) {
                setIsLoadingData(false);
                setError(e.messageToUser);
            }
        }

        getInvoiceList(itemsLimitInTable, currentPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);*/

    const pushToCreateInvoice = () => router.push('/facturacion/crear');

    const handleSearch = value => {
        const filtered = invoices.filter(item => {
            if (value == '') {
                return item
            } else if ( item.custom_folio.toLocaleLowerCase().includes(value.toLocaleLowerCase()) || item.customer.legal_name.toLocaleLowerCase().includes(value.toLocaleLowerCase()) || item.customer.tax_id.toLocaleLowerCase().includes(value.toLocaleLowerCase()) || item.stamp.uuid.toLocaleLowerCase().includes(value.toLocaleLowerCase()) || item.formatted_date.toLocaleLowerCase().includes(value.toLocaleLowerCase()) || item.short_date.toLocaleLowerCase().includes(value.toLocaleLowerCase())) {
                return item
            } else {
                return ''
            }
        });
        setInvoicesList(filtered);
    }

    useEffect(() => {
        setInvoicesList(invoices);
        return () => {
            setInvoicesList([]);
        }
    }, [invoices]);

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

    const handleGetData = async (item) => {
        await handleDownloadInvoice(item?.documents?.zip);
    }

    const actions = [
        {
            name: 'Visualizar',
            action: (item) => router.push(`/facturacion/${item.id}`)
        },
        {
            name: 'Descargar',
            action: handleGetData
        }
    ];

    return (
        <>
            <Loader show={isLoading} title='Descargando...' />
            {/* Calculate min height -> screen height minus top bar height*/}
            <div className='min-h-full md:min-h-[calc(100vh-4rem)] bg-gray-200/70 px-4 xl:px-9 pt-6 pb-10'>
                {error &&
                    <div className='mb-5 top-[5.5rem] sticky z-50'>
                        <Alert title={error} show={error != null} onClose={() => setError(null)} />
                    </div>
                }
                <div className='flex justify-between'>
                    <h2 className='text-3xl font-bold text-gray-900'>
                        Facturación
                    </h2>
                    {invoices.length > 0 && (
                        <PrimaryButton
                            onClick={() => pushToCreateInvoice()}>
                            <PlusIcon className='-ml-1 mr-3 h-5 w-5' />
                            <span className='block lg:hidden'>Crear</span>
                            <span className='hidden lg:block'>Crear nueva factura</span>
                        </PrimaryButton>
                    )}
                </div>
                <div className='w-full rounded-md lg:bg-white px-0 lg:px-3 xl:px-9 py-0 lg:py-7 mt-4'>
                    {isLoadingData ? (
                        <Table title="Facturadas generadas" columns={tableColumns} isLoadingData={isLoadingData} isButton={true} onButtonClick={(item) => handleGetData(item)} invoiceActions={actions} />
                    ) : (
                        <>
                            {invoices.length > 0 ? (
                                <div>
                                    <div>
                                        <Input
                                            type="search"
                                            placeholder="Buscar"
                                            onChange={e => handleSearch(e.target.value)}
                                            leftIcon={<SearchIcon className='w-4 h-4 text-gray-400' />}
                                        />
                                    </div>
                                    <div>
                                    {invoicesList.length > 0 ?
                                    <>  
                                        <div className='mt-4'>
                                            <Table title="Facturadas generadas" data={invoicesList} columns={tableColumns} onItemClick={(item) => router.push(`/facturacion/${item.id}`)} isButton={true} onButtonClick={(item) => handleGetData(item)} invoiceActions={actions}/>
                                        </div>
                                        <div className="lg:flex-1 lg:flex items-center justify-between pt-3">
                                            {pagination && (
                                                <p className="select-none text-sm text-gray-700 hidden lg:block">
                                                    Mostrando {pagination.pages.find(element => element.page == currentPage).range.join(' a ')} de {pagination.totalItems} resultados
                                                </p>
                                            )}
                                            <div>
                                                <Pagination pages={pagination?.totalPages || pagination?.pages?.length} currentPage={currentPage} setCurrentPage={setCurrenPage} />
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <div className='w-full'>
                                        <EmptyState icon={<SearchIcon className='w-12 h-12' />} title='No existen coincidencias' message='Inténtalo de nuevo con otra palabra.' />
                                    </div>
                                    }
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <EmptyState icon={<DocumentTextIcon className='w-12 h-12' />} title='No hay facturas generadas' message='Comienza a facturar ahora. Todo es muy sencillo.' />
                                    <div className="mt-6">
                                        <PrimaryButton
                                            onClick={() => pushToCreateInvoice()}>
                                            <PlusIcon className='-ml-1 mr-3 h-5 w-5' />
                                            Crear nueva factura
                                        </PrimaryButton>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default Invoices;