<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // You can add client seeding logic here if needed in the future
        $clients = [
            [
                'name' => 'John Doe',
                'email' => 'john1@test.local',
                'phone' => '1234567890',
                'address' => '123 Main St, Cityville',
                'date_of_birth' => '1980-01-01',
                'gender' => 'Male',
                'occupation' => 'Engineer',
                'branche_id' => 1,
                'created_by' => 1,
                'updated_by' => 1,
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'janesmith123',
                'phone' => '0987654321',
                'address' => '456 Elm St, Townsville',
                'date_of_birth' => '1990-05-15',
                'gender' => 'Female',
                'occupation' => 'Designer',
                'branche_id' => 2,
                'created_by' => 2,
                'updated_by' => 2,
            ],
        ];

        foreach ($clients as $client) {
            \App\Models\Client::create($client);
        }
    }
}
