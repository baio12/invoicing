import React from 'react';
import PropTypes from 'prop-types';
import { Transition } from '@headlessui/react';
import { ExclamationCircleIcon } from '@heroicons/react/solid';

function Input({ label, needed, name, id, placeholder, error, ...rest }) {
    return (
        <div>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                    {label} {needed && <span className='text-red-400'>*</span>}
                </label>
            )}
            <div className="mt-1 relative rounded-md shadow-sm">
                <textarea
                    name={name}
                    id={id}
                    className={`${error ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : 'border-gray-300 text-gray-800 placeholder:text-gray-300 focus:ring-blue-sky focus:border-blue-sky'} transition-all block w-full px-4 sm:text-sm rounded-md resize-none`}
                    placeholder={placeholder}
                    {...rest}
                />
                <Transition
                    show={error != null}
                    enter="transition-all ease-in"
                    enterFrom="opacity-0 scale-0"
                    enterTo="opacity-100 scale-100"
                    leave="transition-all ease-out"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-0"
                    className="absolute right-0 top-3 mr-3 flex items-center">
                    <ExclamationCircleIcon className='w-4 h-4 text-red-500' />
                </Transition>
            </div>
            <Transition
                show={error != null}
                enter="transition-all ease-in"
                enterFrom="max-h-0 opacity-0"
                enterTo="max-h-[3rem] opacity-100"
                leave="transition-all ease-out"
                leaveFrom="max-h-[3rem] opacity-100"
                leaveTo="max-h-0 opacity-0">
                <span className='text-sm text-red-600'>{error}</span>
            </Transition>
        </div>
    )
}

Input.propTypes = {
    label: PropTypes.string,
    needed: PropTypes.bool,
    name: PropTypes.string,
    id: PropTypes.string,
    placeholder: PropTypes.string,
    error: PropTypes.string
}

Input.defaultProps = {
    needed: false
}

export default Input;