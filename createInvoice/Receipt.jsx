import React, { useState, useEffect } from 'react';
import Input from '../hooks/Input';
//import { getPaymentTypes, getPaymentMethods, getCFDI } from '../../../apiClient/operations/catalogs';
import InputCFDI from './InputCFDI';
import SelectCustom from '../hooks/SelectCustom';
import InputPaymentMethods from './InputPaymentMethods';


function Receipt({ setReceipt }) {

    const [cfdi, setCfdi] = useState('');
    const [paymentType, setPaymentType] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [cfdiCatalog, setCfdiCatalog] = useState([]);
    const [series, setSeries] = useState(null);
    const [paymentTypeCatalog, setPaymentTypeCatalog] = useState([]);
    const [paymentMethodCatalog, setPaymentMethodCatalog] = useState([]);
    /*const getCFDICatalog = async () => {
        const res = await getCFDI();
        setCfdiCatalog(res.data.cfdi_uses);
    }

    const getPaymentTypesCatalog = async () => {
        const res = await getPaymentTypes();
        setPaymentTypeCatalog(res.data.payment_types);
    }

    const getPaymentMethodCatalog = async () => {
        const res = await getPaymentMethods();
        setPaymentMethodCatalog(res.data.payment_methods);
    }

    useEffect(() => {
        getCFDICatalog();
        getPaymentTypesCatalog();
        getPaymentMethodCatalog();
    }, []);*/

    useEffect(() => {
        if (cfdi != '' && paymentType != '' && paymentMethod != '') {
            const cfdiItem = cfdiCatalog.find(item => item.name == cfdi);
            const paymentTypeItem = paymentTypeCatalog.find(item => item.name == paymentType);
            const paymentMethodItem = paymentMethodCatalog.find(item => item.name == paymentMethod);
            setReceipt({
                cfdi: {
                    cfdi_id: cfdiItem.cfdi_id,
                    name: cfdiItem.name
                },
                paymentType: {
                    form_id: paymentTypeItem.form_id,
                    name: paymentTypeItem.name
                },
                paymentMethod: {
                    method_id: paymentMethodItem.method_id,
                    name: paymentMethodItem.name
                },
                series
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cfdi, paymentType, paymentMethod, series]);

    return (
        <>
            <div className='w-full pb-9 pt-7 border-t border-gray-border'>
                <h5 className='font-bold'>
                    Comprobante
                </h5>
                <div className='w-full max-w-full grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 mt-6'>
                    <div>
                        <InputCFDI value={cfdi} setValue={setCfdi} items={cfdiCatalog.sort((a, b) => {
                                if (a.name < b.name) return -1;
                                return a.name > b.name ? 1 : 0
                            })} label='Uso del CFDI' placeholder='Busca o selecciona una opción'/>
                    </div>
                    <div>
                        <Input label='Serie personalizada' labelDescription='(Opcional)' maxLength={25} type='text' id='serie' onChange={(e) => setSeries(e.target.value)} />
                    </div>
                    <div>
                        <InputPaymentMethods value={paymentType} setValue={setPaymentType} items={paymentTypeCatalog.sort((a, b) => {
                                if (a.name < b.name) return -1;
                                return a.name > b.name ? 1 : 0
                            })} label='Método de pago' placeholder='Busca o selecciona una opción' />
                    </div>
                    <div>
                        <SelectCustom value={paymentMethod} setValue={setPaymentMethod} listOptions={paymentMethodCatalog.sort((a, b) => {
                                if (a.name < b.name) return -1;
                                return a.name > b.name ? 1 : 0
                            })} label='Forma de pago' placeholder='Selecciona una opción' />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Receipt