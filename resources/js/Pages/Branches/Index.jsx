import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';

export default function Index({ auth, branches }) {
    const form = useForm({ name: '', location: '' });

    function submit(e) {
        e.preventDefault();
        form.post(route('branches.store'), {
            onSuccess: () => form.reset(),
        });
    }

    function activate(id) {
        Inertia.post(route('branches.activate', id));
    }

    function deactivate(id) {
        Inertia.post(route('branches.deactivate', id));
    }

    function destroy(id) {
        Inertia.delete(route('branches.destroy', id));
    }

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Branches</h2>}>
            <Head title="Branches" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block font-medium text-sm text-gray-700">Nom</label>
                                <TextInput value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} className="mt-1 block w-full" />
                                <InputError message={form.errors.name} className="mt-2" />
                            </div>

                            <div>
                                <label className="block font-medium text-sm text-gray-700">Location</label>
                                <TextInput value={form.data.location} onChange={(e) => form.setData('location', e.target.value)} className="mt-1 block w-full" />
                                <InputError message={form.errors.location} className="mt-2" />
                            </div>

                            <div>
                                <PrimaryButton processing={form.processing}>Créer</PrimaryButton>
                            </div>
                        </form>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3" />
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {branches.data && branches.data.map((b) => (
                                    <tr key={b.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.location}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.status === 1 ? 'Active' : 'Inactive'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                                            {b.status === 1 ? (
                                                <button onClick={() => deactivate(b.id)} className="text-yellow-600">Désactiver</button>
                                            ) : (
                                                <button onClick={() => activate(b.id)} className="text-green-600">Activer</button>
                                            )}
                                            <button onClick={() => destroy(b.id)} className="text-red-600">Supprimer</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="mt-4">{branches.links && branches.links.map((l, idx) => (
                            <span key={idx} dangerouslySetInnerHTML={{ __html: l.label }} />
                        ))}</div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
