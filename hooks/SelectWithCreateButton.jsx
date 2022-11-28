import React from 'react';
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/solid';
import { Combobox } from '@headlessui/react';
import PropTypes from 'prop-types';


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function SelectWithCreateButton({ selectedItem, setSelectedItem, query, setQuery, setOpen, items, label, placeholder, createButtonTitle }) {

    const filteredPeople =
        query === ''
            ? items
            : items.filter((item) => {
                return item.title.toLowerCase().includes(query.toLowerCase()) || item.description.toLowerCase().includes(query.toLowerCase())
            });

    const handleResetItems = () => {
        setOpen(true);
        setQuery('');
    }

    return (
        <>
            <Combobox as="div" value={selectedItem} onChange={setSelectedItem} className='w-full'>
                {label && 
                    <Combobox.Label className="w-full block text-sm font-medium text-gray-700"><span>{label}</span></Combobox.Label>
                }
                <div className="relative mt-1 outline-none">
                    <Combobox.Input
                        className="w-full rounded-md border border-gray-300 bg-white py-2 pl-4 pr-7 shadow-sm sm:text-sm focus:border-blue-sky focus:outline-none focus:ring-1 focus:ring-blue-sky placeholder:text-gray-300"
                        onChange={(event) => setQuery(event.target.value)}
                        displayValue={(item) => item?.title}
                        placeholder={placeholder}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md pl-2 pr-4 focus:outline-none">
                        <ChevronDownIcon className='w-4 h-4 text-gray-500' />
                    </Combobox.Button>
                    {filteredPeople.length > 0 ? (
                        <Combobox.Options className="absolute z-10 max-h-60 mt-1.5 w-full overflow-auto rounded-md bg-white text-sm shadow-lg sm:text-sm ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <Combobox.Option
                                value={1}
                                onClick={handleResetItems}
                                className='relative cursor-pointer select-none py-2.5 px-3 overflow-auto font-medium text-orange flex items-center justify-between gap-2 hover:bg-orange hover:text-white rounded-md'>
                                <div>
                                    {createButtonTitle}
                                </div>
                                <div>
                                    <PlusIcon className='w-5 h-5 font-bold' />
                                </div>
                            </Combobox.Option>
                            <p className='text-xs text-gray-400 pl-3 py-1.5'>
                                Recientes
                            </p>
                            {filteredPeople.map((item, i) => (
                                <Combobox.Option
                                    key={i}
                                    value={item}
                                    className={({ active }) =>
                                        classNames(
                                            'relative cursor-pointer select-none py-2.5 px-3 font-medium flex items-center rounded-md',
                                            active ? 'bg-orange text-white' : 'text-gray-900'
                                        )
                                    }
                                >
                                    {({ active, selected }) => (
                                        <>
                                            <div className="flex items-center">
                                                <span className={classNames('truncate', selected && 'font-semibold')}>{item.title}</span>
                                                <span
                                                    className={classNames(
                                                        'ml-2 truncate font-normal text-sm',
                                                        active ? 'text-white' : 'text-gray-500'
                                                    )}
                                                >
                                                    {item.description}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </Combobox.Option>
                            ))}
                        </Combobox.Options>
                    ) :
                        <>
                            <Combobox.Options className="absolute z-10 mt-1.5 max-h-60 w-full overflow-auto rounded-md bg-white text-base shadow-lg sm:text-sm ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <Combobox.Option
                                    value={1}
                                    onClick={handleResetItems}
                                    className='relative cursor-pointer select-none py-2.5 px-3 overflow-auto font-medium text-orange flex items-center justify-between gap-2 hover:bg-orange hover:text-white rounded-md'>
                                    <div>
                                        {createButtonTitle}
                                    </div>
                                    <div>
                                        <PlusIcon className='w-5 h-5 font-bold' />
                                    </div>
                                </Combobox.Option>
                            </Combobox.Options>
                        </>
                    }
                </div>
            </Combobox>
        </>
    )
}

SelectWithCreateButton.defaultProps = {
    createButtonTitle: 'Agrega uno nuevo'
}

SelectWithCreateButton.propTypes = {
    selectedItem: PropTypes.any,
    setSelectedItem: PropTypes.func,
    query: PropTypes.string,
    setQuery: PropTypes.func,
    setOpen: PropTypes.func,
    items: PropTypes.array,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    createButtonTitle: PropTypes.string,
}

export default SelectWithCreateButton