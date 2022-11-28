import React from 'react';
import SkeletonLoader from '../hooks/SkeletonLoader';

function Emmiter({ organization }) {
    
    return (
        <>
            <div className='w-full pb-9'>
                <div className='w-full flex justify-between'>
                    <h5 className='font-bold'>
                        Datos del emisor
                    </h5>
                </div>
                <div className='w-full flex justify-start mt-2'>
                    <div className='w-full flex justify-between'>
                        <div className='text-sm w-full xl:w-3/4'>
                            <div className="mb-2 lg:mb-1 lg:grid lg:grid-cols-4 sm:gap-4">
                                <dt className="text-sm text-gray-500">Nombre o razón social:</dt>
                                <dd className="text-sm text-gray-900 sm:mt-0 sm:col-span-3">{ organization?.legal_name || <SkeletonLoader /> }</dd>
                            </div>
                            <div className="mb-2 lg:mb-1 lg:grid lg:grid-cols-4 sm:gap-4">
                                <dt className="text-sm text-gray-500">Régimen fiscal:</dt>
                                <dd className="text-sm text-gray-900 sm:mt-0 sm:col-span-3">{ organization?.tax_system?.name || <SkeletonLoader /> }</dd>
                            </div>
                            <div className="mb-2 lg:mb-1 lg:grid lg:grid-cols-4 sm:gap-4">
                                <dt className="text-sm text-gray-500">RFC:</dt>
                                <dd className="text-sm text-gray-900 sm:mt-0 sm:col-span-3">{ organization?.tax_id || <SkeletonLoader /> }</dd>
                            </div>
                            <div className="lg:grid lg:grid-cols-4 sm:gap-4">
                                <dt className="text-sm text-gray-500">Código postal:</dt>
                                <dd className="text-sm text-gray-900 sm:mt-0 sm:col-span-3">{ organization?.address?.zip || <SkeletonLoader /> }</dd>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Emmiter