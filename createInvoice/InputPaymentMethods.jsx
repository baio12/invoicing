import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/solid';
import { Combobox } from '@headlessui/react';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function InputPaymentMethods({value, setValue, items, label, placeholder}) {
    const [filtered, setFiltered] = useState([]);
    useEffect(() => {
    setFiltered(items);
    }, [items])
    
    const handleSearch = value => {
        const filteredInfo = items.filter(item => {
            if (value == '') {
                return ''
            } else if (item.name.toLowerCase().includes(value.toLowerCase())) {
                return item
            } else {
                return ''
            }
        });
        setFiltered(filteredInfo);
    }

    const handleChange = val => {
        setValue(val.name);
        setFiltered(items);
    }

    return (
        <>
            <Combobox as="div" value={value} onChange={(val) => handleChange(val)} className='w-full'>
                {label && 
                    <Combobox.Label className="w-full block text-sm font-medium text-gray-700"><span>{label}<span className='text-red-400'>*</span></span></Combobox.Label>
                }
                <div className="relative mt-1 outline-none">
                    <Combobox.Input
                        className="w-full rounded-md border border-gray-300 bg-white py-2 pl-4 pr-7 shadow-sm text-base sm:text-sm focus:border-blue-sky focus:outline-none focus:ring-1 focus:ring-blue-sky placeholder:text-gray-300"
                        onChange={(event) => handleSearch(event.target.value)}
                        displayValue={(item) => item}
                        placeholder={placeholder}
                        autoComplete='off'
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md pl-2 pr-4 focus:outline-none" onClick={() => setFiltered(items)}>
                        <ChevronDownIcon className='w-4 h-4 text-gray-500' />
                    </Combobox.Button>
                    {filtered.length > 0 && (
                        <Combobox.Options className="absolute z-10 max-h-40 mt-1.5 w-full overflow-auto rounded-md bg-white text-base sm:text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {filtered.map((item, i) => (
                                <Combobox.Option
                                    key={i}
                                    value={item}
                                    className={({ active }) =>
                                        classNames(
                                            'cursor-pointer select-none py-2.5 px-3 font-medium flex items-center rounded-md',
                                            active ? 'bg-orange text-white' : 'text-gray-900'
                                        )
                                    }
                                >
                                    {({ selected, active }) => (
                                        <>
                                            <span className={`${selected && !active && 'text-orange'} block font-normal`}>
                                                {item.name}
                                            </span>

                                            {selected ? (
                                                <span
                                                    className={classNames(
                                                        active ? 'text-white' : 'text-orange',
                                                        'absolute inset-y-0 right-0 flex items-center pr-4'
                                                    )}
                                                >
                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </Combobox.Option>
                            ))}
                        </Combobox.Options>
                    )
                    }
                </div>
            </Combobox>
        </>
    )
}

export default InputPaymentMethods