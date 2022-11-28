import React, { useState, useEffect } from 'react';
import { Combobox } from '@headlessui/react';
import { XIcon } from '@heroicons/react/solid';
import PropTypes from 'prop-types';


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function InputUnitCode({ selectedPerson, setSelectedPerson, people, errors, setErrors }) {

    const [filtered, setFiltered] = useState([]);
    const [disabled, setDisabled] = useState(selectedPerson?.unit !== '');
    const handleSearch = value => {
        const filteredInfo = people.filter(item => {
            if (value == '') {
                return ''
            } else if (item.name.toLowerCase().includes(value.toLowerCase())) {
                return item
            } else if (item.key_id.toLowerCase().includes(value.toLowerCase())) {
                return item
            } else {
                return ''
            }
        });
        const cutArr = filteredInfo.length > 10 ? filteredInfo.slice(0, 10) : filteredInfo;
        setFiltered(cutArr);
    }

    useEffect(() => {
        setDisabled(selectedPerson?.unit !== '');
    }, [selectedPerson])

    const handleChange = (e) => {
        setSelectedPerson({ ...selectedPerson, unit: e });
        setErrors({ ...errors, unit: '' });
        setDisabled(true);
    }

    const handleActivate = () => {
        setSelectedPerson({ ...selectedPerson, unit: '' });
        setDisabled(false);
    }
    return (
        <>
            <Combobox as="div" value={selectedPerson?.unit} onChange={e => handleChange(e)} className='w-full'>
                <Combobox.Label className="w-full block text-sm font-medium text-gray-700">Unidad de medida<span className='text-red-400'>*</span></Combobox.Label>
                <div className="relative mt-1 outline-none">
                    <Combobox.Input
                        className={`w-full ${disabled ? 'opacity-50 outline-none focus:ring-0 focus:border-gray-300 focus:ring-none cursor-not-allowed' : 'opacity-100 focus:border-blue-sky focus:outline-none focus:ring-1 focus:ring-blue-sky'} rounded-md border border-gray-300 bg-white py-2 pl-4 pr-7 shadow-sm sm:text-sm placeholder:text-gray-300`}
                        onChange={(event) => handleSearch(event.target.value)}
                        displayValue={(item) => item !== '' ? `${item?.key_id || item?.key} ${item?.name}` : ''}
                        placeholder='Selecciona una unidad de medida'
                        autoComplete='off'
                        readOnly={disabled}
                    />
                    {disabled && <span className="absolute inset-y-0 right-0 flex items-center border border-gray-300 hover:bg-orange hover:text-white text-gray-500 bg-white rounded-r-md pl-4 pr-4 focus:outline-none border-l border-gray-200 cursor-pointer" onClick={handleActivate}>
                        <XIcon className='w-5 h-5' />
                    </span>}
                    <Combobox.Options className="absolute z-10 max-h-32 mt-1.5 w-full overflow-y-auto rounded-md bg-white text-sm shadow-lg sm:text-sm ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {filtered.map((item, i) => (
                            <Combobox.Option
                                key={i}
                                value={item}
                                className={({ active }) =>
                                    classNames(
                                        'relative cursor-default select-none overflow-auto py-2.5 px-3 font-medium flex items-center rounded-md',
                                        active ? 'bg-orange text-white' : 'text-gray-900'
                                    )
                                }
                            >
                                {({ active, selected }) => (
                                    <>
                                        <div className="flex items-center">
                                            <span className={classNames('truncate', selected && 'font-semibold')}>{item.key_id}</span>
                                            <span
                                                className={classNames(
                                                    'ml-2 truncate font-normal text-sm',
                                                    active ? 'text-white' : 'text-gray-500'
                                                )}
                                            >
                                                {item.name}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                </div>
                {errors.unit !== '' && <span className='block mt-0.5 text-red-500 text-sm'>{errors.unit}</span>}
            </Combobox>
        </>
    )
}

InputUnitCode.propTypes = {
    selectedPerson: PropTypes.any,
    setSelectedPerson: PropTypes.func,
    people: PropTypes.array,
    errors: PropTypes.object,
    setErrors: PropTypes.func
}

export default InputUnitCode