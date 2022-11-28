import React, { useEffect, useState, useRef } from 'react';
import { PlusIcon } from '@heroicons/react/solid';
import Modal from '../hooks/Modal';
import SelectProductService from '../hooks/SelectProductService';
import useFormatterCurrency from '../hooks/useFormatterCurrency';
import Table from '../hooks/Table';
import AddProduct from '../../products/AddProduct';
import PropTypes from 'prop-types';
//import { getProductKeys } from '../../../apiClient/operations/catalogs';
import Loader from '../hooks/Loader';

const tableColumns = [
    { heading: 'Clave P/S', value: 'product.key', mobile_value: 'product.key,product.name', description: 'product.name' },
    { heading: 'Concepto', value: 'description' },
    { heading: 'Unidad de medida', value: 'unit.key', mobile_value: 'unit.key,unit.name', description: 'unit.name' },
    { heading: 'Cantidad', value: 'quantity' },
    { heading: 'Valor unitario', value: 'price_formatted' },
    { heading: 'Subtotal', value: 'total_formatted' }
]

function ProductOrServices({ setSelectedProducts, catalog }) {

    const [products, setProducts] = useState([]);
    const [addPSQuery, setAddPSQuery] = useState('');
    const [openAddProduct, setOpenAddProduct] = useState(false);
    const [open, setOpen] = useState(false);
    const [psCatalog, setPsCatalog] = useState([]);
    const [product, setProduct] = useState(null);
    const formatterCurrencyRef = useRef(useFormatterCurrency);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setOpenAddProduct(false);
        return () => {
            setOpenAddProduct(false);
        }
    }, [products]);

    /*useEffect(() => {
        const getPS = async () => {
            try {
                const res = await getProductKeys();
                setPsCatalog(res);
            } catch (e) {
                setError(e.messageToUser)
            }
        }

        getPS();
    }, []);*/

    useEffect(() => {
        if (!open){
            setProduct(null);
            setOpenAddProduct(false);
        }
    }, [open]);

    const handleDeleteProduct = item => {
        const delArr = products.filter(product => product.tempId !== item.tempId);
        setProducts(delArr);
    }

    const handleEditProduct = item => {
        setProduct(item);
        setOpen(true);
    }

    const actions = [
        {
            name: 'Editar',
            action: handleEditProduct
        },
        {
            name: 'Eliminar',
            action: handleDeleteProduct
        }
    ];

    const onProductAdded = productAdded => {
        productAdded.price_formatted = `${formatterCurrencyRef.current(productAdded.price / 100)} MXN`
        productAdded.total_formatted = `${formatterCurrencyRef.current(productAdded.total / 100)} MXN`
        setOpen(false);
        let updatedProducts = products;
        if (product) {
            setProduct(null);
            updatedProducts = products.filter(product => product.tempId !== productAdded.tempId);
        }
        setProducts([
            productAdded,
            ...updatedProducts
        ]);
    }


    useEffect(() => {
        setSelectedProducts(products);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [products]);

    const handleCancel = () => {
        setOpenAddProduct(false);
        setOpen(false);
    }

    return (
        <>
            <Loader show={isLoading} />
            <div className='w-full pt-7 border-t border-gray-border'>
                <h5 className='font-bold'>
                    Productos / Servicios
                </h5>
                <div className='w-full'>
                    {products.length === 0 ?
                        <div className='w-full lg:w-1/2 mt-6 max-w-full lg:max-w-[41%]'>
                            <SelectProductService selectedPerson={products} query={addPSQuery} setQuery={setAddPSQuery} setOpen={setOpen} people={catalog} to='producto / servicio' setOpenAddProduct={setOpenAddProduct} setProduct={setProduct} />
                        </div>
                        :
                        <>
                            <div className='w-full mt-2'>
                                <div className='-mx-5 lg:mx-0'>
                                    <Table title="Productos o servicios agregados" columns={tableColumns} data={products} actionItems={actions} />
                                </div>
                                {products.length > 0 &&
                                    <div className='w-full lg:border-b border-gray-300 py-5'>
                                        {!openAddProduct ?
                                            <div className='w-auto flex items-center justify-center lg:justify-start'>
                                                <span className='flex items-center cursor-pointer gap-3 text-orange font-medium' onClick={() => setOpenAddProduct(true)}>
                                                    <PlusIcon className='w-5 h-5' /> Agregar producto
                                                </span>
                                            </div>
                                            :
                                            <div className='w-full lg:w-1/2 max-w-full lg:max-w-[41%]'>
                                                <SelectProductService selectedPerson={products} query={addPSQuery} setQuery={setAddPSQuery} setOpen={setOpen} people={catalog} to='producto / servicio' setOpenAddProduct={setOpenAddProduct} setProduct={setProduct} />
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                        </>
                    }
                </div>
            </div>
            <Modal open={open} setOpen={setOpen} className='w-full sm:max-w-[30rem]'>
                <AddProduct
                    onCancel={handleCancel}
                    product={product}
                    onAdded={onProductAdded}
                    psCatalog={psCatalog}
                    setIsLoading={setIsLoading} />
            </Modal>
        </>
    )
}

ProductOrServices.propTypes = {
    setSelectedProducts: PropTypes.func,
    catalog: PropTypes.array
}

export default ProductOrServices