import React from 'react';
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/solid';
import { Combobox } from '@headlessui/react';
import PropTypes from 'prop-types';

function SelectProductService({ selectedPerson, query, setQuery, setOpen, people, to, setOpenAddProduct, setProduct }) {
    const filteredPeople = people.filter(item => {
        if (query == '') {
            return item
        } else if (item.description.toLowerCase().includes(query.toLowerCase())) {
            return item
        } else {
            return ''
        }
    });
    const handleAddItem = () => {
        setOpen(true);
        setQuery('');
    }
    const handleChange = (e) => {
        setOpenAddProduct(false);
        setProduct({
            id: e[0].id,
            unit: e[0].unit,
            product: e[0].product,
            description: e[0].description,
            status: 'created',
            quantity: 1,
            price: e[0].price
        });
        setOpen(true);
    }

    return (
        <>
            <Combobox as="div" value={selectedPerson} onChange={e => handleChange(e)} className='w-full'>
                <Combobox.Label className="w-full block text-sm font-medium text-gray-700"><span className='capitalize'>{`${to}`}</span> frecuente <span className='text-red-400'>*</span></Combobox.Label>
                <div className="relative mt-1 outline-none">
                    <Combobox.Input
                        className="w-full rounded-md border border-gray-300 bg-white py-2 pl-4 pr-7 shadow-sm sm:text-sm focus:border-blue-sky focus:outline-none focus:ring-1 focus:ring-blue-sky placeholder:text-gray-300"
                        onChange={(event) => setQuery(event.target.value)}
                        displayValue={(item) => item?.description}
                        placeholder={`Selecciona un ${to}`}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md pl-2 pr-4 focus:outline-none">
                        <ChevronDownIcon className='w-4 h-4 text-gray-500' />
                    </Combobox.Button>
                    {filteredPeople.length > 0 ? (
                        <Combobox.Options className="absolute z-10 max-h-[170px] mt-1.5 w-full overflow-auto rounded-md bg-white text-sm shadow-lg sm:text-sm ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div
                                onClick={handleAddItem}
                                className='relative cursor-pointer select-none py-2.5 px-3 overflow-auto font-medium text-orange flex items-center justify-between gap-2 hover:bg-orange hover:text-white rounded-md'>
                                <div>
                                    Agrega un nuevo {to}
                                </div>
                                <div>
                                    <PlusIcon className='w-5 h-5 font-bold' />
                                </div>
                            </div>
                            <p className='text-xs text-gray-400 pl-3 py-1.5'>
                                Recientes
                            </p>
                            {filteredPeople.sort((a, b) => {
                                if (a.updated_at > b.updated_at) return -1;
                                return a.updated_at < b.updated_at ? 1 : 0
                            })?.slice(0, 5)?.map((item, i) => (
                                <Combobox.Option
                                    key={i}
                                    value={[item]}
                                    className='cursor-pointer select-none overflow-y-hidden scrollbar py-2 px-3 font-medium flex items-center rounded-md hover:bg-orange hover:text-white text-gray-900'
                                >
                                    <div className="flex items-center">
                                        <span className='font-semibold'>
                                            {item.description}
                                        </span>
                                    </div>
                                </Combobox.Option>
                            ))}
                        </Combobox.Options>
                    ) :
                        <>
                            <Combobox.Options className="absolute z-10 mt-1.5 max-h-60 w-full overflow-auto rounded-md bg-white text-base shadow-lg sm:text-sm ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div
                                    onClick={handleAddItem}
                                    className='relative cursor-pointer select-none py-2.5 px-3 overflow-auto font-medium text-orange flex items-center justify-between gap-2 hover:bg-orange hover:text-white rounded-md'>
                                    <div>
                                        Agrega un nuevo {to}
                                    </div>
                                    <div>
                                        <PlusIcon className='w-5 h-5 font-bold' />
                                    </div>
                                </div>
                            </Combobox.Options>
                        </>
                    }
                </div>
            </Combobox>
        </>
    )
}

SelectProductService.propTypes = {
    selectedPerson: PropTypes.any,
    query: PropTypes.string,
    setQuery: PropTypes.func,
    setOpen: PropTypes.func,
    people: PropTypes.array,
    to: PropTypes.string,
    setOpenAddProduct: PropTypes.func,
    setProduct: PropTypes.func,
    setPreTag: PropTypes.func
}

export default SelectProductService