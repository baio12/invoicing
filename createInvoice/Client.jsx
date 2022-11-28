import React, { useState, useEffect } from 'react';
import Modal from '../hooks/Modal';
import SelectWithCreateButton from '../hooks/SelectWithCreateButton';
import MenuButton from '../hooks/MenuButton';
import AddClient from '../../clients/AddClient';
import Loader from '../hooks/Loader';
import { DotsVerticalIcon } from '@heroicons/react/solid';
//import { getCustomers } from '../../../apiClient/operations/customerOperations';

function Client({ user, setClient }) {

    const [clients, setClients] = useState([]);
    const [recentClients, setRecentClients] = useState([]);
    const [clientQuery, setClientQuery] = useState('');
    const [selectedClient, setSelectedClient] = useState(null);
    const [editClient, setEditClient] = useState(null);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    /*useEffect(() => {
        const getClients = async () => {
            const res = await getCustomers(user.organizationId);
            setClients(res.data.customers);
            setRecentClients(formatedClients(res.data.customers));
        }

        getClients();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);*/

    const formatedClients = clients => clients.map(({
        id,
        tax_id: title,
        legal_name: description,
    }) => ({
        id,
        title,
        description
    }));

    const handleEditClient = () => {
        if (!selectedClient) return;
        const client = clients.find(client => client.id == selectedClient?.id);
        setEditClient(client);
        setOpen(true);
    }

    const handleChangeClient = () => {
        setEditClient(null);
        setSelectedClient(null);
        setClientQuery('');
    }

    const menuItems = [
        {
            name: 'Editar cliente',
            action: handleEditClient
        },
        {
            name: 'Cambiar de cliente',
            action: handleChangeClient
        }
    ];

    const onClientAdded = async clientAdded => {
        let updatedClients = clients;
        if (editClient) {
            setEditClient(null);
            updatedClients = clients.filter(client => client.id !== clientAdded.id);
        }
        setClients([
            clientAdded,
            ...updatedClients
        ]);
        setRecentClients(formatedClients([
            clientAdded,
            ...updatedClients
        ]));
        setSelectedClient(clientAdded);
        setOpen(false);
    }

    const onChangeClient = client => {
        if (client == 1) return;
        setSelectedClient(clients.find(e => e.id == client.id));
    }

    useEffect(() => {
        setClient(selectedClient);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedClient]);

    return (
        <>
            <Loader show={isLoading} />
            <div className='w-full pb-9 pt-7 border-t border-gray-border'>
                <div className='w-full flex justify-between'>
                    <h5 className='font-bold'>
                        Datos del cliente
                    </h5>
                    {selectedClient && (
                        <>
                            <div className='hidden lg:block text-gray-500'>
                                <MenuButton
                                    items={menuItems}>
                                    Editar
                                </MenuButton>
                            </div>
                            <div className='block lg:hidden'>
                                <MenuButton
                                    items={menuItems}>
                                    <DotsVerticalIcon className="min-w-[1.25rem] h-5 text-gray-400" />
                                </MenuButton>
                            </div>
                        </>
                    )}
                </div>
                <div className='w-full flex justify-start'>
                    {!selectedClient ?
                        <div className='w-full lg:w-1/2 max-w-full lg:max-w-[41%] mt-6'>
                            <SelectWithCreateButton
                                setSelectedItem={onChangeClient}
                                query={clientQuery}
                                setQuery={setClientQuery}
                                setOpen={setOpen}
                                items={recentClients}
                                label="Cliente"
                                placeholder="Busca o agrega un cliente"
                                createButtonTitle="Agrega un nuevo cliente" />
                        </div>
                        :
                        <>
                            <div className='w-full flex justify-between mt-2'>
                                <div className='text-sm w-full xl:w-3/4'>
                                    <div className="mb-2 lg:mb-1 lg:grid lg:grid-cols-4 sm:gap-4">
                                        <dt className="text-sm text-gray-500">Nombre o razón social:</dt>
                                        <dd className="text-sm text-gray-900 sm:mt-0 sm:col-span-3">{selectedClient?.legal_name}</dd>
                                    </div>
                                    <div className="mb-2 lg:mb-1 lg:grid lg:grid-cols-4 sm:gap-4">
                                        <dt className="text-sm text-gray-500">Régimen fiscal:</dt>
                                        <dd className="text-sm text-gray-900 sm:mt-0 sm:col-span-3">{selectedClient?.tax_system?.name}</dd>
                                    </div>
                                    <div className="mb-2 lg:mb-1 lg:grid lg:grid-cols-4 sm:gap-4">
                                        <dt className="text-sm text-gray-500">RFC:</dt>
                                        <dd className="text-sm text-gray-900 sm:mt-0 sm:col-span-3">{selectedClient?.tax_id}</dd>
                                    </div>
                                    <div className="mb-2 lg:mb-1 lg:grid lg:grid-cols-4 sm:gap-4">
                                        <dt className="text-sm text-gray-500">Correo electrónico:</dt>
                                        <dd className="text-sm text-gray-900 sm:mt-0 sm:col-span-3">{selectedClient.email}</dd>
                                    </div>
                                    <div className="lg:grid lg:grid-cols-4 sm:gap-4">
                                        <dt className="text-sm text-gray-500">Código postal:</dt>
                                        <dd className="text-sm text-gray-900 sm:mt-0 sm:col-span-3">{selectedClient?.address?.zip}</dd>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                </div>
            </div>
            {setOpen &&
                <Modal open={open} setOpen={setOpen} className='w-full sm:max-w-[30rem]'>
                    <AddClient organizationId={user.organizationId} client={editClient} onAdded={onClientAdded} onCancel={() => setOpen(false)} setIsLoading={setIsLoading} />
                </Modal>
            }
        </>
    )
}

export default Client