import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import { useState } from 'react';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';

export default function Index({ auth, clients, branches }) {
    const [showModal, setShowModal] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    console.log("auth:", auth);
    const form = useForm({ 
        name: '', 
        email: '', 
        phone: '', 
        address: '', 
        date_of_birth: '', 
        gender: '', 
        occupation: '', 
        branche_id: auth.user.branche_id 
    });

    function openCreateModal() {
        setEditingClient(null);
        form.reset();
        setShowModal(true);
    }

    function openEditModal(client) {
        setEditingClient(client);
        form.setData({
            name: client.name,
            email: client.email,
            phone: client.phone,
            address: client.address,
            date_of_birth: client.date_of_birth,
            gender: client.gender,
            occupation: client.occupation,
            branche_id: client.branche_id
        });
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
        setEditingClient(null);
        form.reset();
        form.clearErrors();
    }

    function submit(e) {
        e.preventDefault();
        if (editingClient) {
            form.put(route('clients.update', editingClient.id), {
                onSuccess: () => closeModal()
            });
        } else {
            form.post(route('clients.store'), {
                onSuccess: () => closeModal()
            });
        }
    }

    function activate(id) {
        Inertia.post(route('clients.activate', id));
    }

    function deactivate(id) {
        Inertia.post(route('clients.deactivate', id));
    }

    function destroy(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
            Inertia.delete(route('clients.destroy', id));
        }
    }

    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Clients</h2>
                    <PrimaryButton onClick={openCreateModal}>
                        Nouveau Client
                    </PrimaryButton>
                </div>
            }>
            <Head title="Clients" />

            {/* Modal pour création/édition */}
            <Modal show={showModal} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        {editingClient ? 'Modifier le Client' : 'Nouveau Client'}
                    </h2>

                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="block font-medium text-sm text-gray-700">Nom *</label>
                                <TextInput 
                                    value={form.data.name} 
                                    onChange={(e) => form.setData('name', e.target.value)} 
                                    className="mt-1 block w-full" 
                                    required
                                />
                                <InputError message={form.errors.name} className="mt-2" />
                            </div>
                            
                            <div>
                                <label className="block font-medium text-sm text-gray-700">Email</label>
                                <TextInput 
                                    type="email"
                                    value={form.data.email} 
                                    onChange={(e) => form.setData('email', e.target.value)} 
                                    className="mt-1 block w-full" 
                                />
                                <InputError message={form.errors.email} className="mt-2" />
                            </div>
                            
                            <div>
                                <label className="block font-medium text-sm text-gray-700">Téléphone</label>
                                <TextInput 
                                    value={form.data.phone} 
                                    onChange={(e) => form.setData('phone', e.target.value)} 
                                    className="mt-1 block w-full" 
                                />
                                <InputError message={form.errors.phone} className="mt-2" />
                            </div>
                            
                            
                            
                            <div>
                                <label className="block font-medium text-sm text-gray-700">Date de Naissance</label>
                                <TextInput 
                                    type="date" 
                                    value={form.data.date_of_birth} 
                                    onChange={(e) => form.setData('date_of_birth', e.target.value)} 
                                    className="mt-1 block w-full" 
                                />
                                <InputError message={form.errors.date_of_birth} className="mt-2" />
                            </div>
                            
                            <div>
                                <label className="block font-medium text-sm text-gray-700">Genre</label>
                                <select
                                    value={form.data.gender}
                                    onChange={(e) => form.setData('gender', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                >
                                    <option value="">Sélectionner</option>
                                    <option value="male">Masculin</option>
                                    <option value="female">Féminin</option>
                                </select>
                                <InputError message={form.errors.gender} className="mt-2" />
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="block font-medium text-sm text-gray-700">Adresse</label>
                                <textarea
                                    value={form.data.address}
                                    onChange={(e) => form.setData('address', e.target.value)}
                                    rows={3}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                />
                                <InputError message={form.errors.address} className="mt-2" />
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="block font-medium text-sm text-gray-700">Profession</label>
                                <TextInput 
                                    value={form.data.occupation} 
                                    onChange={(e) => form.setData('occupation', e.target.value)} 
                                    className="mt-1 block w-full" 
                                />
                                <InputError message={form.errors.occupation} className="mt-2" />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Annuler
                            </button>
                            <PrimaryButton processing={form.processing}>
                                {editingClient ? 'Modifier' : 'Créer'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Tableau des clients */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branche</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {clients.data && clients.data.map((c) => (
                                        <tr key={c.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.phone}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {c.branch ? c.branch.name : `Branche ${c.branche_id}`}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                                                    c.status === 1 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {c.status === 1 ? 'Actif' : 'Inactif'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <button 
                                                    onClick={() => openEditModal(c)} 
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Modifier
                                                </button>
                                                {c.status === 1 ? (
                                                    <button 
                                                        onClick={() => deactivate(c.id)} 
                                                        className="text-yellow-600 hover:text-yellow-900"
                                                    >
                                                        Désactiver
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => activate(c.id)} 
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        Activer
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => destroy(c.id)} 
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Supprimer
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            {clients.links && clients.links.length > 0 && (
                                <div className="mt-4 flex justify-center">
                                    <nav className="flex items-center space-x-2">
                                        {clients.links.map((link, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    if (link.url) {
                                                        Inertia.visit(link.url);
                                                    }
                                                }}
                                                className={`px-3 py-1 rounded-md text-sm font-medium ${
                                                    link.active
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}