<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        \App\Models\User::factory()->create([
            'name' => 'paki leonel',
            'email' => 'pakileonel1@gmail.com',
            'password'=>bcrypt('pakileo312'),
            'branche_id'=>1,
            'role'=>'admin'
        ]);

        \App\Models\User::factory()->create([
            'name' => 'salomon leonel',
            'email' => 'salomonleonel72@gmail.com',
            'password'=>bcrypt('pakileo312'),
            'branche_id'=>2,
            'role'=>'admin'
        ]);

        $this->call(BrancheSeeder::class);
        $this->call(ClientSeeder::class);

    }
}
