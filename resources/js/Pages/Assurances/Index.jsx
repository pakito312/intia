import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import { useState } from 'react';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';

export default function Index({ auth, assurances, clients }) {
    const [showModal, setShowModal] = useState(false);
    const [editingAssurance, setEditingAssurance] = useState(null);
    
    const form = useForm({ 
        client_id: '', 
        type: '', 
        amount: '', 
        start_date: '', 
        end_date: '',
        status: 1
    });

    function openCreateModal() {
        setEditingAssurance(null);
        form.reset();
        setShowModal(true);
    }

    function openEditModal(assurance) {
        setEditingAssurance(assurance);
        form.setData({
            client_id: assurance.client_id,
            type: assurance.type,
            amount: assurance.amount,
            start_date: assurance.start_date,
            end_date: assurance.end_date,
            status: assurance.status
        });
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
        setEditingAssurance(null);
        form.reset();
        form.clearErrors();
    }

    function submit(e) {
        e.preventDefault();
        if (editingAssurance) {
            form.put(route('assurances.update', editingAssurance.id), {
                onSuccess: () => closeModal()
            });
        } else {
            form.post(route('assurances.store'), {
                onSuccess: () => closeModal()
            });
        }
    }

    function activate(id) {
        Inertia.post(route('assurances.activate', id));
    }

    function deactivate(id) {
        Inertia.post(route('assurances.deactivate', id));
    }

    function destroy(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette assurance ?')) {
            Inertia.delete(route('assurances.destroy', id));
        }
    }

    // Types d'assurance prédéfinis
    const assuranceTypes = [
        'Auto',
        'Habitation',
        'Santé',
        'Vie',
        'Responsabilité Civile',
        'Professionnelle',
        'Automobile',
        'Voyage',
        'Animaux'
    ];

    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Assurances</h2>
                    <PrimaryButton onClick={openCreateModal}>
                        Nouvelle Assurance
                    </PrimaryButton>
                </div>
            }>
            <Head title="Assurances" />

            {/* Modal pour création/édition */}
            <Modal show={showModal} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        {editingAssurance ? 'Modifier l\'Assurance' : 'Nouvelle Assurance'}
                    </h2>

                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="block font-medium text-sm text-gray-700">Client *</label>
                                <select
                                    value={form.data.client_id}
                                    onChange={(e) => form.setData('client_id', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    required
                                >
                                    <option value="">Sélectionner un client</option>
                                    {clients && clients.map((client) => (
                                        <option key={client.id} value={client.id}>
                                            {client.name} - {client.email}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={form.errors.client_id} className="mt-2" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block font-medium text-sm text-gray-700">Type d'assurance *</label>
                                <select
                                    value={form.data.type}
                                    onChange={(e) => form.setData('type', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    required
                                >
                                    <option value="">Sélectionner un type</option>
                                    {assuranceTypes.map((type, index) => (
                                        <option key={index} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={form.errors.type} className="mt-2" />
                            </div>

                            <div>
                                <label className="block font-medium text-sm text-gray-700">Montant *</label>
                                <TextInput 
                                    type="number"
                                    step="0.01"
                                    value={form.data.amount} 
                                    onChange={(e) => form.setData('amount', e.target.value)} 
                                    className="mt-1 block w-full" 
                                    required
                                    placeholder="0.00"
                                />
                                <InputError message={form.errors.amount} className="mt-2" />
                            </div>

                            <div>
                                <label className="block font-medium text-sm text-gray-700">Statut</label>
                                <select
                                    value={form.data.status}
                                    onChange={(e) => form.setData('status', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                >
                                    <option value={1}>Active</option>
                                    <option value={0}>Inactive</option>
                                </select>
                                <InputError message={form.errors.status} className="mt-2" />
                            </div>

                            <div>
                                <label className="block font-medium text-sm text-gray-700">Date de début *</label>
                                <TextInput 
                                    type="date" 
                                    value={form.data.start_date} 
                                    onChange={(e) => form.setData('start_date', e.target.value)} 
                                    className="mt-1 block w-full" 
                                    required
                                />
                                <InputError message={form.errors.start_date} className="mt-2" />
                            </div>

                            <div>
                                <label className="block font-medium text-sm text-gray-700">Date de fin *</label>
                                <TextInput 
                                    type="date" 
                                    value={form.data.end_date} 
                                    onChange={(e) => form.setData('end_date', e.target.value)} 
                                    className="mt-1 block w-full" 
                                    required
                                />
                                <InputError message={form.errors.end_date} className="mt-2" />
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
                                {editingAssurance ? 'Modifier' : 'Créer'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Tableau des assurances */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {assurances.data && assurances.data.map((a) => {
                                        const isExpired = new Date(a.end_date) < new Date();
                                        const isActive = a.status === 1 && !isExpired;
                                        
                                        return (
                                            <tr key={a.id} className={isExpired ? 'bg-red-50' : ''}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{a.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {a.client ? a.client.name : `Client ${a.client_id}`}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{a.type}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {parseFloat(a.amount).toLocaleString('fr-FR', {
                                                        style: 'currency',
                                                        currency: 'EUR'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <div>{new Date(a.start_date).toLocaleDateString('fr-FR')}</div>
                                                    <div>→ {new Date(a.end_date).toLocaleDateString('fr-FR')}</div>
                                                    {isExpired && (
                                                        <span className="text-xs text-red-600 font-semibold">Expirée</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                                                        isActive 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : isExpired
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {isActive ? 'Active' : isExpired ? 'Expirée' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    <button 
                                                        onClick={() => openEditModal(a)} 
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Modifier
                                                    </button>
                                                    {a.status === 1 ? (
                                                        <button 
                                                            onClick={() => deactivate(a.id)} 
                                                            className="text-yellow-600 hover:text-yellow-900"
                                                        >
                                                            Désactiver
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            onClick={() => activate(a.id)} 
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            Activer
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => destroy(a.id)} 
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Supprimer
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            {assurances.links && assurances.links.length > 0 && (
                                <div className="mt-4 flex justify-center">
                                    <nav className="flex items-center space-x-2">
                                        {assurances.links.map((link, idx) => (
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