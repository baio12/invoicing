import React, { useEffect, useState, useRef } from 'react';
import { PlusIcon, XIcon } from '@heroicons/react/solid';
import useFormatterCurrency from '../hooks/useFormatterCurrency';
import SelectCustom from '../hooks/SelectCustom';
import PropTypes from 'prop-types';
//import { getTaxes } from '../../../apiClient/operations/catalogs';

function TotalInvoice({ products, subtotal, total, taxes, setTaxes, taxSystemId, editable }) {

    const [taxCatalog, setTaxCatalog] = useState([]);
    const [taxList, setTaxList] = useState([]);
    const [isAddingTax, setIsAddingTax] = useState(false);
    const [selectedTaxes, setSelectedTaxes] = useState(taxes);
    const [subtotalBill, setSubtotalBill] = useState(subtotal);
    const [totalBill, setTotalBill] = useState(total);
    const formatterCurrencyRef = useRef(useFormatterCurrency);

    /*useEffect(() => {
        const getTaxList = async () => {
            try {
                const res = await getTaxes();
                if (taxSystemId) filterTaxCatalog(taxSystemId, res.data.taxes);
                else setTaxCatalog(res.data.taxes);
            } catch (e) {
                console.log(e.messageToUser);
            }
        }

        if (editable) getTaxList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);*/

    const filterTaxCatalog = (taxSystemId, catalog) => {
        if (!catalog) return;
        //Filter tax catalog by tax system `Regimen simplificado de confianza`
        let taxes = catalog.filter(tax => {
            if (tax.type == 'ISR') {
                return tax.rate != (taxSystemId == "626" ? 0.1 : 0.0125);
            }
            return true;
        })
        setTaxCatalog(taxes);
    }

    useEffect(() => {
        setSelectedTaxes(taxes);
    }, [taxes])

    useEffect(() => {
        setTaxList(taxCatalog);
    }, [taxCatalog])

    useEffect(() => {
        //If IVA type taxes with withholding in true are selected, it is validated that at least one tax with withholding in false is selected
        if (!selectedTaxes) return;
        let validTaxes = true;
        if (selectedTaxes.find(tax => tax.withholding)) {
            validTaxes = selectedTaxes.some(tax => !tax.withholding)
        }
        if (setTaxes) setTaxes(validTaxes ? selectedTaxes : []);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTaxes])

    const addTax = taxName => {
        let selectedTax = taxCatalog.find(tax => tax.name == taxName);
        const taxes = [...selectedTaxes, selectedTax];
        const leftTaxes = taxCatalog.filter(x => !taxes.includes(x));
        setIsAddingTax(false);
        let taxList = [];
        if(leftTaxes.filter(tax => !tax.withholding).length === 5){
            taxList = leftTaxes;
        } else {
            taxList = leftTaxes.filter(tax => tax.withholding)
        }
        setTaxList(taxList);
        setSelectedTaxes([
            ...selectedTaxes,
            selectedTax
        ]);
    }

    const removeTax = taxToRemove => {
        let selected = selectedTaxes.filter(tax => tax != taxToRemove);
        const AddedTaxes = taxCatalog.filter(x => selected.includes(x));
        const leftTaxes = taxCatalog.filter(x => !selected.includes(x));
        setSelectedTaxes(selected);
        let list = [];

        if(AddedTaxes.filter(tax => !tax.withholding).length === 1){
            list = leftTaxes.filter(tax => tax.withholding);
        } else {
            list = leftTaxes;
        }
        setTaxList(list);
    }

    useEffect(() => {
        if (!editable || !products || !selectedTaxes) return;
        let subtotal = products.reduce((accumulator, currentPs) => accumulator + (currentPs.total / 100), 0)
        setSubtotalBill(subtotal);
        let totalTaxes = selectedTaxes.reduce((accumulator, currentTax) => {
            let taxValue = (currentTax.rate * subtotal);
            return accumulator + (currentTax.withholding ? -taxValue : taxValue);
        }, 0);
        setTotalBill(totalTaxes + subtotal);
    }, [editable, products, selectedTaxes]);

    return (
        <div className='w-full divide-y divide-gray-300 bg-gray-50 lg:rounded-lg shadow px-5'>
            <div className='text-normal flex justify-between py-5'>
                <div className="text-gray-500">Subtotal</div>
                <div className={`${editable && 'mr-6'} text-gray-900 sm:mt-0 sm:col-span-3 text-right`}>{formatterCurrencyRef.current(subtotalBill)} MXN</div>
            </div>
            <div className='text-normal py-5 space-y-5'>
                {selectedTaxes?.sort((a, b) => Number(a.withholding) - Number(b.withholding))?.map((tax, i) => (
                    <div key={i} className='flex justify-between'>
                        <div className="text-gray-500">{tax.name}</div>
                        <div className="text-gray-900 sm:mt-0 sm:col-span-3 flex gap-1 text-right">
                            {tax.withholding && '-'} {formatterCurrencyRef.current((tax.total / 100) || (tax.rate * subtotalBill))} MXN
                            {editable &&
                                <span className='flex items-center cursor-pointer font-medium' onClick={() => removeTax(tax)}>
                                    <XIcon className='w-5 h-5' />
                                </span>
                            }
                        </div>
                    </div>
                ))}
                {editable && selectedTaxes?.length < 3 && (
                    <div className='h-10 flex items-center'>
                        {!isAddingTax ? (
                            <span className='flex items-center cursor-pointer gap-2 text-orange font-medium' onClick={() => setIsAddingTax(true)}>
                                <PlusIcon className='w-5 h-5 font-bold' />
                                Agregar impuesto
                            </span>
                        ) : (
                            <div className='w-full lg:w-2/3'>
                                <SelectCustom
                                    listOptions={taxList}
                                    setValue={addTax} />
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className='text-lg text-orange font-bold flex justify-between py-5'>
                <div className="">Total</div>
                <div className={`${editable && 'mr-6'} sm:mt-0 sm:col-span-3 text-right`}>{formatterCurrencyRef.current(totalBill)} MXN</div>
            </div>
        </div>
    )
}

TotalInvoice.propTypes = {
    products: PropTypes.array,
    subtotal: PropTypes.number, 
    total: PropTypes.number,
    taxes: PropTypes.array,
    setTaxes: PropTypes.func,
    taxSystemId: PropTypes.string,
    editable: PropTypes.bool
}

TotalInvoice.defaultProps = {
    subtotal: 0, 
    total: 0,
    taxes: [],
    editable: true
}

export default TotalInvoice